'use client'
import { useQuery } from '@tanstack/react-query';
import { PositionChartCard, PositionSummary, FeesEarned } from './components';
import { useParams } from 'next/navigation'
import _get from 'lodash/get';
import axios from 'axios';
import { useWallet } from '@coin98-com/wallet-adapter-react';

export default function PositionViewer() {
    const { address } = useWallet();
    const { address: positionAddress, nftId } = useParams<{ address: string, nftId: string }>()

    const { data, isLoading } = useQuery({
        queryKey: ['pools-info', address, positionAddress, nftId],
        queryFn: async () => {
            try {
                if (!address) return []; // If no address, return empty array
                const response = await axios.get(`/api/pools/info?nftId=${nftId}&position=${positionAddress}`);
                return _get(response, 'data.data', {});
            } catch (error) {
                return {}; // Return empty array on error
            }
        },
        enabled: !!address && !!positionAddress && !!nftId, // Only fetch if address exists
        refetchOnWindowFocus: true,
    });

    // console.log('Position data:', data);

    return (
        <div className="bg-black min-h-screen p-6 text-white space-y-4">
            {/* Header */}
            {/* <div className="text-xl font-medium">
                2,569.87 USDC = 1 ETH <span className="text-white/60">($2,569.87)</span> ↺
            </div> */}

            {/* Main grid */}
            <div className="flex gap-8">
                <div className="rounded-2xl p-4 flex flex-col justify-between w-[300px] h-[480px] relative shadow-lg">
                    <img src={_get(data, 'position.nftMetadata.image', '')} alt="NFT Image" />
                </div>
                <div className="flex flex-col gap-4">
                    <PositionSummary />
                    <FeesEarned />
                </div>
            </div>
        </div>
    );
}
