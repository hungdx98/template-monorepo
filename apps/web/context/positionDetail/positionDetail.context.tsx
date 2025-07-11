'use client';
import { useParams } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@coin98-com/wallet-adapter-react';
import axios from 'axios';
import get from 'lodash/get';
import toLower from 'lodash/toLower';
import pick from 'lodash/pick';
import { useTokensStore } from '@/stores';
import { useShallow } from 'zustand/shallow';
import { Token } from '@repo/utils/types';
import { PeripheryService } from '@/services';
import { convertBalanceToWei, convertWeiToBalance } from '@wallet/utils';
import { CONSECUTIVE_TICKS_RATIO } from '@/utils';
type PoolDetail = {
  id: string;
  name: string;
  liquidity: number;
  // Add more pool detail fields as needed
};

type PoolDetailContextType = {
  state: {
    poolData: any | null;
    isLoadingPool: boolean;
  };
  jobs: {
    increaseLiquidity: (amount0: string, amount1: string) => Promise<string | any>;
    calculateAmountOut: (amount0: string) => string
  }
};

const PoolDetailContext = createContext<PoolDetailContextType | undefined>(undefined);

export const PoolDetailProvider = ({ children }: { children: ReactNode }) => {

  const { address = '', sendTransaction } = useWallet();
  
  const { address: positionAddress, nftId } = useParams<{ address: string, nftId: string }>()


  const coinLocal = useTokensStore(useShallow((state) => state.coinLocal));
  const coinLocalCurrent = coinLocal['tomo'];
  

   const { data, isLoading, error } = useQuery({
        queryKey: ['pools-info', address, positionAddress, nftId],
        queryFn: async () => {
            try {
                if (!address) return []; // If no address, return empty array
                const response = await axios.get(`/api/pools/info?nftId=${nftId}&position=${positionAddress}`);
                return get(response, 'data.data', {});
            } catch (error) {
                throw error; // Rethrow error to be caught by the query
            }
        },
        enabled: !!address && !!positionAddress && !!nftId, // Only fetch if address exists
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    });

  console.log("🚀 ~ PoolDetailProvider ~ data:", data);
  

  const poolData = useMemo(() => {
    if(isLoading || !data) return {};

    const token0Address = get(data, 'position.token0', '');
    const token1Address = get(data, 'position.token1', '');

    const token0Meta = coinLocalCurrent?.find((tk): tk is Token => toLower(token0Address) === toLower(tk.address)) as Token
    const token1Meta = coinLocalCurrent?.find((tk): tk is Token => toLower(token1Address) === toLower(tk.address)) as Token

    const getData = pick(get(data, 'position', {}), ['tickLower', 'tickUpper', 'amount0', 'amount1', 'tokenId', 'nftMetadata', 'tick', 'sqrtPriceX96', 'fee', 'token0', 'token1'])
    getData.token0 = token0Meta;
    getData.token1 = token1Meta;

    console.log("getData:", getData);
    return getData 
  }, [data, isLoading]);


  const calculateAmountOut = (amountIn: string, type: 'base' | 'pair') => {

    // const SQRTPriceUpper = CONSECUTIVE_TICKS_RATIO ** (Number(get(poolData, 'tickUpper', 0)) / 2);
    // const SQRTPriceLower = CONSECUTIVE_TICKS_RATIO ** (Number(get(poolData, 'tickLower', 0)) / 2);
    // const SQRTPriceCurrent = CONSECUTIVE_TICKS_RATIO ** (Number(get(poolData, 'tick', 0)) / 2);
    // const L1 = (SQRTPriceUpper - SQRTPriceCurrent) / (Number(amountIn) * SQRTPriceUpper * SQRTPriceUpper);
    // const L2 = (SQRTPriceCurrent - SQRTPriceLower) / Number(amountIn);
    // const L = Math.min(L1, L2);
    // console.log('check Ls', {L, L1, L2})
    // const amountOut = L * (SQRTPriceCurrent - SQRTPriceLower);

    const amount0 = convertWeiToBalance(get(poolData, 'amount0', '0'), get(poolData, 'token0.decimals', 18));
    const amount1 = convertWeiToBalance(get(poolData, 'amount1', '0'), get(poolData, 'token1.decimals', 18));

    console.log(amount1, amount0)
    const rate = type === 'base'
      ? Number(amount1) / Number(amount0 || 1)
      : Number(amount0) / Number(amount1 || 1);

    console.log('rate', rate)
    const amountOut = Number(amountIn) * rate;

    console.log("🚀 ~ calculateAmountOut ~ amountIn:", amountIn, "amountOut:", amountOut);
    return amountOut.toFixed(6);
  }

  const increaseLiquidity = async (amount0: string, amount1: string) => {
    const rawAmount0 = convertBalanceToWei(amount0, get(poolData, 'token0.decimals', 18));
    const rawAmount1 = convertBalanceToWei(amount1, get(poolData, 'token1.decimals', 18));
    const tokenId = get(poolData, 'tokenId', '');

    console.log("🚀 ~ increaseLiquidity ~ rawAmount0:", rawAmount0, "rawAmount1:", rawAmount1, "tokenId:", tokenId, "address:", address);

    const txData = await PeripheryService.increaseLiquidity( 
      Number(tokenId),
      rawAmount0,
      rawAmount1,
      address as string)
  
    const result = await sendTransaction({
        ...txData,
        gasLimit: '0x0',
        gasPrice: '0x0',
        gas: '0x0'
    })

    console.log("🚀 ~ increaseLiquidity ~ result:", result);

    return result.data;
  }

  return (
    <PoolDetailContext.Provider value={{ 
      state: {
        poolData: poolData,
        isLoadingPool: isLoading,
      },
      jobs:{
        increaseLiquidity,
        calculateAmountOut
      } 
    }}>
      {children}
    </PoolDetailContext.Provider>
  );
};

export const usePoolDetailContext = () => {
  const context = useContext(PoolDetailContext);
  if (context === undefined) {
    throw new Error('usePoolDetailContext must be used within a PoolDetailProvider');
  }
  return context;
};