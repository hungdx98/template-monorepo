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

  }
};

const PoolDetailContext = createContext<PoolDetailContextType | undefined>(undefined);

export const PoolDetailProvider = ({ children }: { children: ReactNode }) => {

  const { address } = useWallet();
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


  const calculateAmountOut = (amountIn: string) => {

  }

  return (
    <PoolDetailContext.Provider value={{ 
      state: {
        poolData: poolData,
        isLoadingPool: isLoading,
      },
      jobs:{ } 
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