"use client"
import { Token } from '@repo/utils/types';
import React, { ChangeEvent, createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { EFeeTier, IStatePositionPairTokens } from '../createPosition';
import { IStateSwapContext, QuoteResponse } from './swap.context.types';
import get from 'lodash/get';
import { useWallet } from '@coin98-com/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import _debounce from 'lodash/debounce';
import _uniqBy from 'lodash/uniqBy';
import { convertBalanceToWei, convertWeiToBalance } from '@wallet/utils';
import Web3 from 'web3';
import { Bounce, toast } from 'react-toastify';
import ToastSuccess from '@/components/ToastSuccess';
import { useTokensStore } from '@/stores';
import { useShallow } from 'zustand/shallow';

const SwapContext = createContext<IStateSwapContext>({} as IStateSwapContext);

const SwapProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { address, sendTransaction } = useWallet();
    const coinLocal = useTokensStore(useShallow(state => state.coinLocal));
    const tokens = useTokensStore(useShallow(state => state.coinCurrent));
    const coinCurrentByChain = coinLocal["tomo"] || [];

    const [feeTier, setFeeTier] = useState<EFeeTier>(EFeeTier.STANDARD);

    const [pairTokens, setPairTokens] = useState<IStatePositionPairTokens>({
        token0: undefined,
        token1: undefined
    })
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
        const priceIn = get(pairTokens, 'token0.market.current_price', '0');
        const priceOut = get(pairTokens, 'token1.market.current_price', '0');
        const fiatIn = String((Number(amountIn) * Number(priceIn)));
        const fiatOut = String((Number(amountOut) * Number(priceOut)));
        let priceImpact = (((Number(fiatOut) - Number(fiatIn)) / Number(fiatIn)) * 100);
        if (!amountOut || isNaN(priceImpact) || amountOut === '0') {
            priceImpact = 0;
        }
        const isHigherPriceImpact = Number(priceImpact) < -5;
        return [fiatIn, fiatOut, priceImpact, isHigherPriceImpact];
    }, [pairTokens, amountIn, amountOut]);

    const fetchQuotesSequentially = async () => {
        try {
            setAmountOut('0');

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
    }

    const { data: quote, isFetching, error, refetch: refetchQuotesConcurrently } = useQuery({
        queryKey: [{
            key: 'quotes-concurrently',
            address,
            pairTokens,
            amountIn,
            slippage,
            feeTier
        }],
        queryFn: fetchQuotesSequentially,
        enabled: !!pairTokens.token0 && !!pairTokens.token1 && !!address && amountIn !== '0' && !isNaN(Number(amountIn)) && !!amountIn,
        retry: 0,
        refetchOnWindowFocus: false,
        // ...queryNoCacheOptions
    })

    const handleExchange = (quote: QuoteResponse) => async () => {
        try {
            if (!quote || !quote.transaction) {
                console.error('Invalid quote data');
                return;
            }
            setIsLoadingTx(true);
            const { transaction } = quote;
            const { approveAddress, ...tx } = transaction;

            const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.viction.xyz'));
            const nonce = Number(await web3.eth.getTransactionCount(transaction.from as string));
            const transactionObject = { ...tx, nonce };
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
            // throw new Error(`Failed to send transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            error,
            coinCurrent,
            feeTier,
            slippage
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