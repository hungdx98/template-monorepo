"use client"
import ToastSuccess from '@/components/ToastSuccess';
import { ERC20_ABI } from '@/services/abi';
import { useTokensStore } from '@/stores';
import { useWallet } from '@coin98-com/wallet-adapter-react';
import { Token } from '@repo/utils/types';
import { useQuery } from '@tanstack/react-query';
import { convertBalanceToWei, convertWeiToBalance } from '@wallet/utils';
import axios from 'axios';
import _debounce from 'lodash/debounce';
import get from 'lodash/get';
import _uniqBy from 'lodash/uniqBy';
import React, { ChangeEvent, createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import Web3, { Transaction } from 'web3';
import { useShallow } from 'zustand/shallow';
import { EFeeTier, IStatePositionPairTokens } from '../createPosition';
import { IStateSwapContext } from './swap.context.types';

const SwapContext = createContext<IStateSwapContext>({} as IStateSwapContext);

const SwapProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { address, sendTransaction } = useWallet();
    const coinLocal = useTokensStore(useShallow(state => state.coinLocal));
    const tokens = useTokensStore(useShallow(state => state.coinCurrent));
    const coinCurrentByChain = coinLocal["tomo"] || [];
    const client = new Web3(new Web3.providers.HttpProvider("https://rpc.viction.xyz"));

    const [feeTier, setFeeTier] = useState<EFeeTier>(EFeeTier.STANDARD);

    const [pairTokens, setPairTokens] = useState<IStatePositionPairTokens>({
        token0: undefined,
        token1: undefined
    })
    const [approveTx, setApproveTx] = useState<Transaction | undefined>(undefined);

    const [isLoadingTx, setIsLoadingTx] = useState<boolean>(false);

    const [amountIn, setAmountIn] = useState<string>('0');
    const [amountOut, setAmountOut] = useState<string>('0');
    const [slippage, setSlippage] = useState<string>('0.5');

    const onChangeAmountIn = _debounce((e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.target.value;
        if (isNaN(Number(value)) || value === '' || !value) {
            setAmountOut('0');
            return;
        }
        setAmountIn(value);
    }, 500);

    const onSelectPairToken = (type: 'token0' | 'token1', token: Token) => {
        setPairTokens((prev) => ({
            ...prev,
            [type]: token
        }));
    };

    const [fiatIn, fiatOut, priceImpact, isHigherPriceImpact] = useMemo(() => {
        const priceIn = get(pairTokens, 'token0.market.current_price', get(pairTokens, 'token0.marketInfo.current_price', '0'));
        const priceOut = get(pairTokens, 'token1.market.current_price', get(pairTokens, 'token1.marketInfo.current_price', '0'));
        const fiatIn = String((Number(amountIn) * Number(priceIn)));
        const fiatOut = String((Number(amountOut) * Number(priceOut)));
        let priceImpact = (((Number(fiatOut) - Number(fiatIn)) / Number(fiatIn)) * 100);
        if (!amountOut || isNaN(priceImpact) || amountOut === '0') {
            priceImpact = 0;
        }
        const isHigherPriceImpact = Number(priceImpact) < -5;
        return [fiatIn, fiatOut, priceImpact, isHigherPriceImpact];
    }, [pairTokens, amountIn, amountOut]);

    const isEnableFetching = useMemo(() => {
        return !!pairTokens.token0 && !!pairTokens.token1 && !!address && amountIn !== '0' && !isNaN(Number(amountIn)) && !!amountIn;
    }, [pairTokens, address, amountIn]);

    const { data: quote, isFetching, error, refetch: refetchQuotesConcurrently } = useQuery({
        queryKey: [{
            key: 'quotes-concurrently',
            address,
            pairTokens,
            amountIn,
            slippage,
            feeTier
        }],
        queryFn: async () => {
            try {
                setAmountOut('0');
                setApproveTx(undefined);
                // Simulate fetching quotes sequentially
                const amountInExpect = convertBalanceToWei(amountIn, get(pairTokens, 'token0.decimals', 18));
                const params = {
                    token0: pairTokens.token0?.address,
                    token1: pairTokens.token1?.address,
                    amountIn: amountInExpect,
                    fee: Number(feeTier) * 10000,
                    slippage: Number(slippage),
                    wallet: address
                }
                const res = await axios.post('/api/quote', params);
                const quotes = get(res, 'data.data', {});
                if (!!quotes) {
                    const amountOut = convertWeiToBalance(get(quotes, 'amountOut', '0'), get(pairTokens, 'token1.decimals', 18));
                    setAmountOut(amountOut);
                }
                return quotes;
            } catch (error: any) {
                throw get(error, 'response.data', 'Failed to fetch quotes');
            }
        },
        enabled: isEnableFetching,
        retry: 0,
        refetchOnWindowFocus: false,
        refetchInterval: 20 * 1000 // Refetch every 20 seconds
        // ...queryNoCacheOptions
    })

    const { data: gas, isFetching: isFetchGas, error: errorGas } = useQuery({
        queryKey: ['est-gas', {
            quote,
            token0: get(pairTokens, 'token0.address'),
            token1: get(pairTokens, 'token1.address'),
            amountIn,
            address
        }],
        queryFn: async () => {
            try {
                const token0Address = get(pairTokens, 'token0.address')
                if (!!token0Address && !!address) {
                    const addressTo = get(quote, 'transaction.approveAddress') as string;
                    const tokenContract = new client.eth.Contract(ERC20_ABI, token0Address);
                    const ownerAddress = address; // Define the owner address as the wallet address
                    const spenderAddress = get(quote, 'transaction.approveAddress') as string; // Define the spender address from the quote
                    if (!spenderAddress) throw new Error('Spender address is undefined');
                    if (!tokenContract.methods.allowance) throw new Error('Token contract methods are undefined');
                    const allowance = await tokenContract.methods.allowance(ownerAddress, spenderAddress).call();
                    const amountInRaw = convertBalanceToWei(amountIn, get(pairTokens, 'token0.decimals', 18));
                    const isApproval = Number(amountInRaw) > Number(allowance);
                    const nonce = Number(await client.eth.getTransactionCount(ownerAddress as string));
                    const gasPrice = await client.eth.getGasPrice();
                    if (isApproval) {
                        // const amountBN = BigNumber.from(amountInRaw);
                        if (!tokenContract.methods.approve) throw new Error('approve method is undefined on tokenContract');
                        const rawABI = tokenContract.methods.approve(addressTo, amountInRaw).encodeABI();

                        const txObject = {
                            from: ownerAddress,
                            to: token0Address, // approve token address
                            data: rawABI, // approve callData
                            value: '0', // approve value fix 0
                            nonce
                        } as Transaction;
                        setApproveTx(txObject);
                        // Estimate gas limit and gas price
                        const estimatedGas = await client.eth.estimateGas(txObject);

                        return { gasLimit: estimatedGas.toString(), gasPrice: gasPrice.toString() };
                    }
                    const transactionObject = get(quote, 'transaction');
                    const { approveAddress, ...tx } = transactionObject;
                    const estimatedGas = await client.eth.estimateGas(tx);
                    return { gasLimit: estimatedGas.toString(), gasPrice: gasPrice.toString() };
                }
            } catch (error: any) {
                const getError = get(error, 'message', error)
                if (getError.includes('insufficient funds')) {
                    throw new Error("insufficient funds for gas * price + value");
                }
                throw error;
            }
        },
        retry: 0,
        refetchOnWindowFocus: false,
        enabled: !!quote && isEnableFetching,
    })


    const handleExchange = (transaction: Transaction) => async () => {
        try {
            if (!transaction) {
                console.error('Invalid quote data');
                return;
            }
            setIsLoadingTx(true);

            const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.viction.xyz'));
            const nonce = Number(await web3.eth.getTransactionCount(transaction.from as string));
            const transactionObject = { ...transaction, nonce };
            const txHashRes = await sendTransaction(transactionObject);
            if (txHashRes.isError) throw txHashRes.error;
            toast.success(<ToastSuccess message={'Success'} hash={txHashRes.data as string} />, {
                type: 'success',
                delay: 50,
                autoClose: 15000,
                transition: Bounce
            })
        } catch (error) {
            toast.error(`Failed to send transaction: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                type: 'error',
                delay: 50,
                autoClose: 5000,
                transition: Bounce
            });
            throw new Error(`Failed to send transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoadingTx(false);
        }
    }

    const onSelectFeeTier = (fee: EFeeTier) => () => {
        setFeeTier(fee);
    };

    const onChangeSlippage = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.target.value;
        if (isNaN(Number(value)) || value === '' || !value) {
            setSlippage('0.5');
            return;
        }
        setSlippage(value);
    };

    const coinCurrent = useMemo(() => {
        const mergeCoinCurrent = [...tokens, ...coinCurrentByChain];
        const uniqCoinCurrent = _uniqBy(mergeCoinCurrent, 'address');
        return uniqCoinCurrent;
    }, [tokens, coinCurrentByChain])

    return <SwapContext.Provider value={{
        state: {
            pairTokens,
            amountIn,
            amountOut,
            fiatIn,
            fiatOut,
            priceImpact,
            isHigherPriceImpact,
            quote,
            isFetching,
            isLoadingTx,
            error: error || errorGas,
            coinCurrent,
            feeTier,
            slippage,
            approveTx,
            isFetchGas,
            gas
        },
        jobs: {
            onSelectPairToken,
            onChangeAmountIn,
            handleExchange,
            onSelectFeeTier,
            onChangeSlippage
        },
        ref: {}
    }
    }>
        {children}
    </SwapContext.Provider>

};

const useSwapService = () => useContext(SwapContext);

export { SwapProvider, useSwapService };
