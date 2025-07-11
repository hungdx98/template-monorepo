'use client';
import { useParams } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@coin98-com/wallet-adapter-react';
import axios from 'axios';
import get from 'lodash/get';
import toLower from 'lodash/toLower';
import pick from 'lodash/pick';
import { useBaseStore, useTokensStore } from '@/stores';
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
   const [baseService] = useBaseStore(useShallow(state => [
              state.baseService
          ]));
  
  const { address: positionAddress, nftId } = useParams<{ address: string, nftId: string }>()

  const [tokenRawBalances, setTokenRawBalances] = useState<{ base: string, pair: string }>({ base: '0', pair: '0' });


  const coinLocal = useTokensStore(useShallow((state) => state.coinLocal));
  const coinLocalCurrent = coinLocal['tomo'];
  

   const { data, isLoading, error } = useQuery({
        queryKey: ['pools-info', address, positionAddress, nftId],
        queryFn: async () => {
          if (!address) return []; // If no address, return empty array
            const response = await axios.get(`/api/pools/info?nftId=${nftId}&position=${positionAddress}`);
            return get(response, 'data.data', {});
        },
        enabled: !!address && !!positionAddress && !!nftId, // Only fetch if address exists
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    });

  
    const { data: rawBalances, isLoading: isLoadingBalance, refetch } = useQuery({
    queryKey: ['token-balance' + JSON.stringify(data)],
    queryFn: async () => {
      if (!data || !address) return { base: '0', pair: '0' };
      try {
        const fromToken = get(data, 'position.token0', {});
        const toToken = get(data, 'position.token1', {});
        // const fromChain = get(fromToken, 'chain') || get(pairTokens, 'chain')
        const randomId = Math.random().toString()

        const results = await Promise.all([fromToken, toToken].map(async (tkAddress, index) => {
          const rawBalance = await baseService?.getBalance({
            address: address!,
            token: {
              address: tkAddress,
              chain: 'tomo',
            },
            chain: 'tomo',
            func: index === 0 ? 'from-swap-balance' + randomId : 'to-swap-balance' + randomId
          })

          return rawBalance

        }))

        setTokenRawBalances({
          base: results[0] || '0',
          pair: results[1] || '0'
        });
      
        return {
          base: results[0],
          pair: results[1]
        }
      } catch (error) {
        return {
          base: '0',
          pair: '0'
        }
      }
    },
    refetchOnWindowFocus: false,
    refetchInterval: 15000
  })

    // const balances
  

  const poolData = useMemo(() => {
    if(isLoading || !data) return {};

    const token0Address = get(data, 'position.token0', '');
    const token1Address = get(data, 'position.token1', '');
    

    const token0Meta = coinLocalCurrent?.find((tk): tk is Token => toLower(token0Address) === toLower(tk.address)) as Token
    const token1Meta = coinLocalCurrent?.find((tk): tk is Token => toLower(token1Address) === toLower(tk.address)) as Token

    const token0Balance = convertWeiToBalance(get(tokenRawBalances, 'base', '0'), get(token0Meta, 'decimals', 18));
    const token1Balance = convertWeiToBalance(get(tokenRawBalances, 'pair', '0'), get(token1Meta, 'decimals', 18));

    token0Meta.balance = token0Balance;
    token1Meta.balance = token1Balance;

    const getData = pick(get(data, 'position', {}), ['tickLower', 'tickUpper', 'amount0', 'amount1', 'tokenId', 'nftMetadata', 'tick', 'sqrtPriceX96', 'fee', 'token0', 'token1'])
    getData.token0 = token0Meta;
    getData.token1 = token1Meta;

    return getData 
  }, [data, isLoading, tokenRawBalances]);


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

    const rate = type === 'base'
      ? Number(amount1) / Number(amount0 || 1)
      : Number(amount0) / Number(amount1 || 1);

    const amountOut = Number(amountIn) * rate;
    return amountOut.toFixed(6);
  }

  const increaseLiquidity = async (amount0: string, amount1: string) => {
    const rawAmount0 = convertBalanceToWei(amount0, get(poolData, 'token0.decimals', 18));
    const rawAmount1 = convertBalanceToWei(amount1, get(poolData, 'token1.decimals', 18));
    const tokenId = get(poolData, 'tokenId', '');
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