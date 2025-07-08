'use client'
import { Skeleton } from '@/components/Skeleton';
import { useTokensStore } from '@/stores';
import { useWallet } from '@coin98-com/wallet-adapter-react';
import { Token } from '@repo/utils/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import _get from 'lodash/get';
import { useParams } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import _toLower from 'lodash/toLower';
import { convertWeiToBalance, formatNumberBro } from '@wallet/utils';

export function PoolCardSkeleton() {
    return (
        <div className="min-h-screen p-6 text-white space-y-4">
            <div className="flex gap-8 justify-center">
                <div className='w-[60%]'>
                    <div className="text-xl font-medium mb-3">
                        <Skeleton className="h-8 w-[30%]" /> {/* v4 badge */}
                    </div>
                    <div className="w-[90%] min-w-[300px] min-h-[480px] rounded-2xl py-8 px-4 flex flex-col justify-between items-center relative shadow-lg bg-[#121212]">
                        <Skeleton className="w-[300px] h-[480px]" /> {/* v4 badge */}
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-[20%]">
                    <Skeleton className="h-[30%]" />
                </div>
            </div>
        </div>
    );
}

export default function PositionViewer() {
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
                return _get(response, 'data.data', {});
            } catch (error) {
                throw error; // Rethrow error to be caught by the query
            }
        },
        enabled: !!address && !!positionAddress && !!nftId, // Only fetch if address exists
        refetchOnWindowFocus: true,
    });

    if (!!error) {
        return (
            <div className="min-h-screen p-6 text-white">
                <div>404</div>
            </div>
        );
    }

    if (isLoading || !data) return <PoolCardSkeleton />

    const token0 = _get(data, 'position.token0', '');
    const token1 = _get(data, 'position.token1', '');

    const token0Meta = coinLocalCurrent?.find((tk): tk is Token => _toLower(token0) === _toLower(tk.address)) as Token
    const token1Meta = coinLocalCurrent?.find((tk): tk is Token => _toLower(token1) === _toLower(tk.address)) as Token
    // console.log('Position data:', data, token0Meta, token1Meta);
    const decimals0 = _get(token0Meta, 'decimals', 18);
    const decimals1 = _get(token1Meta, 'decimals', 18);
    const amount0 = convertWeiToBalance(_get(data, 'position.amount0', '0'), decimals0);
    const amount1 = convertWeiToBalance(_get(data, 'position.amount1', '0'), decimals1);
    console.log('Amount0:', amount0, 'Amount1:', amount1);
    const priceToken0 = _get(token0Meta, 'current_price', 0);
    const priceToken1 = _get(token1Meta, 'current_price', 0);
    const totalValue0 = Number(amount0) * Number(priceToken0);
    const totalValue1 = Number(amount1) * Number(priceToken1);
    console.log('Total Value 0:', totalValue0, 'Total Value 1:', totalValue1);
    const totalValue = totalValue0 + totalValue1;
    const percentage0 = totalValue0 / totalValue * 100;
    const percentage1 = totalValue1 / totalValue * 100;
    const rate = Number(priceToken1) / Number(priceToken0);

    return (
        <div className="min-h-screen p-6 text-white space-y-4">
            {/* Main grid */}
            <div className="flex gap-8 justify-center">
                <div className='w-[60%]'>
                    <div className="text-xl font-medium mb-3 uppercase">
                        {formatNumberBro(rate, 6)} {token0Meta.symbol} = 1 {token1Meta.symbol} <span className="text-white/60">(${priceToken1})</span>
                    </div>
                    <div className="w-[90%] min-w-[300px] min-h-[480px] rounded-2xl py-8 px-4 flex flex-col justify-between items-center relative shadow-lg bg-[#121212]">
                        <img src={_get(data, 'position.nftMetadata.image', '')} alt="NFT Image" className="max-w-[300px] max-h-[480px]" />
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-[20%]">
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
                                    <img src={_get(token0Meta, 'image', '')} alt={token0Meta?.symbol} className="w-4 h-4 rounded-full" />
                                    {percentage0.toFixed(0)}%
                                </div>
                                <div className="flex items-center gap-1 text-purple-400">
                                    <img src={_get(token1Meta, 'image', '')} alt={token1Meta?.symbol} className="w-4 h-4 rounded-full" />
                                    {percentage1.toFixed(0)}%
                                </div>
                            </div>
                        </div>

                        <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                                <div className="flex gap-2 items-center">
                                    <img src={_get(token0Meta, 'image', '')} alt={token0Meta?.symbol} className="w-4 h-4 rounded-full" />
                                    ${formatNumberBro(totalValue0, 4)}
                                </div>
                                <span className="text-white/60 uppercase">{formatNumberBro(amount0, 6)} {token0Meta?.symbol}</span>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex gap-2 items-center">
                                    <img src={_get(token1Meta, 'image', '')} alt={token1Meta?.symbol} className="w-4 h-4 rounded-full" />
                                    ${formatNumberBro(totalValue1, 4)}
                                </div>
                                <span className="text-white/60 uppercase">{formatNumberBro(amount1, 6)} {token1Meta?.symbol}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
