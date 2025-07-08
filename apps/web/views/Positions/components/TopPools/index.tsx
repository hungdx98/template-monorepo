import { Skeleton } from '@/components/Skeleton';
import { useTokensStore } from '@/stores';
import { IPools, ITokenResponse, ITopPools } from "@/types";
import { useWallet } from "@coin98-com/wallet-adapter-react";
import { Token } from '@repo/utils/types';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import _get from "lodash/get";
import { useTranslations } from "next-intl";
import { FC, useMemo } from "react";
import { useShallow } from 'zustand/shallow';
import _toLower from 'lodash/toLower';
import Link from 'next/link';
import Web3 from 'web3';

export default function PoolCardSkeleton() {
    return (
        <div className="bg-[#1a1a1a] text-white rounded-xl p-4 flex items-center justify-between w-full max-w-md">
            <div className="flex items-center gap-3">
                {/* Token Pair Label */}
                <div className="flex flex-col">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-6 rounded-full" /> {/* v4 badge */}
                        <Skeleton className="h-5 w-12 rounded-full" /> {/* fee badge */}
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-5 w-16" /> {/* APR */}
                <Skeleton className="h-5 w-14 rounded-full" /> {/* Pink badge */}
            </div>
        </div>
    );
}

export const TopPools: FC = () => {
    const t = useTranslations();
    const { address } = useWallet();
    const coinLocal = useTokensStore(useShallow((state) => state.coinLocal));
    const coinLocalCurrent = coinLocal['tomo'];

    const { data, isLoading } = useQuery({
        queryKey: ['pools', address],
        queryFn: async () => {
            try {
                if (!address) return []; // If no address, return empty array
                const response = await axios.get(`/api/pools`);
                return _get(response, 'data.data', {}) as ITopPools;
            } catch (error) {
                return {}; // Return empty array on error
            }
        },
        enabled: !!address, // Only fetch if address exists
        refetchOnWindowFocus: true,
    });

    const renderPools = useMemo(() => {
        if (isLoading) {
            return Array.from({ length: 4 }, (_, idx) => <PoolCardSkeleton key={idx} />);
        }
        return _get(data, 'pools', []).map(({ token0, token1, fee, pool, tokenId }: IPools, idx) => {
            const actualFee = Number(fee) / 10000 // Ensure fee is a string
            const token0Meta: Token | ITokenResponse = coinLocalCurrent?.find((tk): tk is Token => _toLower(token0.address) === _toLower(tk.address)) || token0;
            const token1Meta: Token | ITokenResponse = coinLocalCurrent?.find((tk): tk is Token => _toLower(token1.address) === _toLower(tk.address)) || token1;
            // const poolAddress = encodePoolAndNftId(pool, tokenId); // Assuming '0' is the NFT ID for the pool

            return <div key={idx} className="flex items-start justify-between border border-border-1-subtle rounded-lg p-3 cursor-pointer">
                <div className="flex items-center gap-5 w-full">
                    {
                        !!_get(token0Meta, 'image') && <div className="w-15 rounded-full flex items-center justify-center">
                            <img src={_get(token0Meta, 'image')} alt="" className='rounded-full z-10' width={40} height={40} />
                            <img src={_get(token1Meta, 'image')} alt="" className='rounded-full ml-[-30%]' width={40} height={40} />
                        </div>
                    }
                    <div>
                        <div className="font-medium uppercase">{_get(token0Meta, 'symbol', 'Unknown')}/{_get(token1Meta, 'symbol', 'Unknown')}</div>
                        <div className="flex gap-0.5 mt-1">
                            <div className="text-xs text-gray-400 bg-button-sec-fill rounded-tl-[6px] rounded-bl-[6px] py-1 px-2">v3</div>
                            <div className="text-xs text-gray-400 bg-button-sec-fill rounded-tr-[6px] rounded-br-[6px] py-1 px-2">{actualFee}%</div>
                        </div>
                    </div>
                </div>
                <div className="flex text-right flex-col gap-2">
                    {/* <div className="text-text-subtle">{pool.apr} {t("apr")}</div> */}
                    {/* {pool.extra && <div className="text-pink-400 text-xs">{pool.extra}</div>} */}
                </div>
            </div>
            // <Link href={`/explore/pools/${poolAddress}}`} className="no-underline" key={idx}>
            // </Link>
        });
    }, [data, isLoading]);

    return (
        <div className="rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">{t("top_pools_tvl")}</h3>
            <div className="flex flex-col gap-3">
                {renderPools}
            </div>
            <div className="mt-4 text-right">
                <a href="#" className="text-gray-400 hover:underline text-sm">{t("explore_more")} →</a>
            </div>
        </div>
    );
}