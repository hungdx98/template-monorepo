'use client'
import { Skeleton } from '@/components/Skeleton';
import { useTokensStore } from '@/stores';
import { useWallet } from '@coin98-com/wallet-adapter-react';
import { Token } from '@repo/utils/types';
import get from 'lodash/get';
import { useParams } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import _toLower from 'lodash/toLower';
import { convertWeiToBalance, formatNumberBro } from '@wallet/utils';
import Image from 'next/image';
import PageContainer from '@/layouts/PageContainer';
import ActionsButtons from './components/ActionButtons';
import { PoolCardSkeleton } from './components/PoolCardSkelton';
import { usePoolDetailContext } from '@/context/positionDetail';



export default function PositionDetailScreen() {
  const { address } = useWallet();
  const { address: positionAddress, nftId } = useParams<{ address: string, nftId: string }>()

  const { state: {
    poolData: data,
    isLoadingPool
  } } = usePoolDetailContext();

  console.log("🚀 ~ PositionViewer ~ data:", data);



  if (isLoadingPool || !data) return <PoolCardSkeleton />

  const token0Meta = get(data, 'token0', {}) as Token;
  const token1Meta = get(data, 'token1', {}) as Token;
  console.log("🚀 ~ PositionViewer ~ token0Meta:", token0Meta)
  console.log("🚀 ~ PositionViewer ~ token1Meta:", token1Meta)
  // console.log('Position data:', data, token0Meta, token1Meta);
  const decimals0 = get(token0Meta, 'decimals', 18);
  const decimals1 = get(token1Meta, 'decimals', 18);
  const amount0 = convertWeiToBalance(get(data, 'amount0', '0'), decimals0);
  const amount1 = convertWeiToBalance(get(data, 'amount1', '0'), decimals1);
  const priceToken0 = get(token0Meta, 'current_price', 0);
  const priceToken1 = get(token1Meta, 'current_price', 0);
  const totalValue0 = Number(amount0) * Number(priceToken0);
  const totalValue1 = Number(amount1) * Number(priceToken1);
  const totalValue = totalValue0 + totalValue1;
  const percentage0 = totalValue0 / totalValue * 100;
  const percentage1 = totalValue1 / totalValue * 100;
  const rate = Number(priceToken1) / Number(priceToken0);

  return (
    <PageContainer
      size="md"
      className="min-h-screen p-6 text-white space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-black text-white p-4 border-b border-border-1-subtle">
        {/* Pair info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-x-space-100 mr-4">
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
              <Image width={32} height={32} src={get(token0Meta, 'image', '_')} alt="token" className="rounded-full" />
            </div>
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
              <Image width={32} height={32} src={get(token1Meta, 'image', '_')} alt="token" className="rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium uppercase">{get(token0Meta, 'symbol')} / {get(token1Meta, 'symbol')}</span>
              <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">v3</span>
              <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">0.05%</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="flex items-center text-xs text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                Viction
              </span>
              <span className="flex items-center text-xs text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                In range
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <ActionsButtons />
      </div>
      {/* Main grid */}
      <div className="flex gap-x-space-1000">
        <div className='w-full flex-1'>
          <div className="text-xl font-medium mb-3 uppercase">
            {formatNumberBro(rate, 6)} {token0Meta.symbol} = 1 {token1Meta.symbol} <span className="text-white/60">(${priceToken1})</span>
          </div>
          <div className="w-[90%] min-w-[300px] min-h-[480px] rounded-2xl py-8 px-4 flex flex-col justify-between items-center relative shadow-lg bg-[#121212]">
            <img src={get(data, 'nftMetadata.image', '')} alt="NFT Image" className="max-w-[300px] max-h-[480px]" />
          </div>
        </div>
        <div className="flex flex-col gap-4 w-[400px]">
          <div className="bg-[#1E1E1E] text-white rounded-xl p-5 space-y-4 w-full">
            <div className="text-sm text-white/70">Position</div>
            <div className="text-2xl font-medium">${formatNumberBro(totalValue, 4)}</div>

            <div className="flex flex-col w-full text-xs gap-4">
              <div className='flex items-center w-full'>
                <div className={`w-[${percentage0.toFixed(0)}%] h-1 bg-blue-400`} />
                <div className={`w-[${percentage1.toFixed(0)}%] h-1 bg-purple-400`} />
              </div>
              <div className='flex justify-between items-center w-full'>
                <div className="flex items-center gap-1 text-blue-400">
                  <img src={get(token0Meta, 'image', '')} alt={token0Meta?.symbol} className="w-4 h-4 rounded-full" />
                  {percentage0.toFixed(0)}%
                </div>
                <div className="flex items-center gap-1 text-purple-400">
                  <img src={get(token1Meta, 'image', '')} alt={token1Meta?.symbol} className="w-4 h-4 rounded-full" />
                  {percentage1.toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <img src={get(token0Meta, 'image', '')} alt={token0Meta?.symbol} className="w-4 h-4 rounded-full" />
                  ${formatNumberBro(totalValue0, 4)}
                </div>
                <span className="text-white/60 uppercase">{formatNumberBro(amount0, 6)} {token0Meta?.symbol}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <img src={get(token1Meta, 'image', '')} alt={token1Meta?.symbol} className="w-4 h-4 rounded-full" />
                  ${formatNumberBro(totalValue1, 4)}
                </div>
                <span className="text-white/60 uppercase">{formatNumberBro(amount1, 6)} {token1Meta?.symbol}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>

  );
}
