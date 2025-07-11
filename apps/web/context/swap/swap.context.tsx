"use client"
import { Token } from '@repo/utils/types';
import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { IStatePositionPairTokens } from '../createPosition';
import { IStateSwapContext, QuoteResponse } from './swap.context.types';
import get from 'lodash/get';
import { useWallet } from '@coin98-com/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { debounce } from 'lodash';
import { convertBalanceToWei, convertWeiToBalance } from '@wallet/utils';
import Web3 from 'web3';
import { Bounce, toast } from 'react-toastify';
import ToastSuccess from '@/components/ToastSuccess';

const SwapContext = createContext<IStateSwapContext>({} as IStateSwapContext);

const SwapProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { address, sendTransaction } = useWallet();
    const [pairTokens, setPairTokens] = useState<IStatePositionPairTokens>({
        token0: undefined,
        token1: undefined
    })

    const [amountIn, setAmountIn] = useState<string>('0');
    const [amountOut, setAmountOut] = useState<string>('0');

    const onChangeAmountIn = debounce((value: string) => {
        setAmountIn(value);
    }, 100);

    const onSelectPairToken = (type: 'token0' | 'token1', token: Token) => {
        setPairTokens((prev) => ({
            ...prev,
            [type]: token
        }));
    };

    const [fiatIn, fiatOut] = useMemo(() => {
        const priceIn = get(pairTokens, 'token0.market.current_price', '0');
        const priceOut = get(pairTokens, 'token1.market.current_price', '0');
        const fiatIn = String((Number(amountIn) * Number(priceIn)));
        const fiatOut = String((Number(amountOut) * Number(priceOut)));
        return [fiatIn, fiatOut];
    }, [pairTokens, amountIn, amountOut]);

    const fetchQuotesSequentially = async () => {
        try {
            // Simulate fetching quotes sequentially
            const amountInExpect = convertBalanceToWei(amountIn, get(pairTokens, 'token0.decimals', 18));
            const params = {
                token0: pairTokens.token0?.address,
                token1: pairTokens.token1?.address,
                amountIn: amountInExpect,
                fee: '3000',
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
            throw new Error(`Failed to fetch quotes: ${error?.message}`);
        }
    }

    const { data: quote, refetch: refetchQuotesConcurrently } = useQuery({
        queryKey: [{
            key: 'quotes-concurrently',
            address,
            pairTokens,
            amountIn
        }],
        queryFn: fetchQuotesSequentially,
        enabled: !!pairTokens.token0 && !!pairTokens.token1 && !!address && amountIn !== '0',
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
        }
    }

    return <SwapContext.Provider value={{
        state: {
            pairTokens,
            amountIn,
            amountOut,
            fiatIn,
            fiatOut,
            quote
        },
        jobs: {
            onSelectPairToken,
            onChangeAmountIn,
            handleExchange
        },
        ref: {}
    }
    }>
        {children}
    </SwapContext.Provider>

};

const useSwapService = () => useContext(SwapContext);

export { SwapProvider, useSwapService };