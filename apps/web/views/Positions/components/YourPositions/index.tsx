import Button from '@/components/Button';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import Link from 'next/link';
import { useWallet } from '@coin98-com/wallet-adapter-react';
import { useWalletModal } from '@coin98-com/wallet-adapter-react-ui';
import { useQuery } from '@tanstack/react-query';
import _get from 'lodash/get';
import _size from 'lodash/size';
import axios from 'axios';
import { useShallow } from 'zustand/shallow';
import { useTokensStore } from '@/stores';
import { Token } from '@repo/utils/types';
import _toLower from 'lodash/toLower';

export default function PositionCard({ position }: any) {
    const { token0, token1, fee } = position;
    const coinLocal = useTokensStore(useShallow((state) => state.coinLocal));
    const coinLocalCurrent = coinLocal['tomo'];
    const token0Meta = coinLocalCurrent?.find((tk): tk is Token => _toLower(token0) === _toLower(tk.address)) as Token;
    const token1Meta = coinLocalCurrent?.find((tk): tk is Token => _toLower(token1) === _toLower(tk.address)) as Token;
    const actualFee = Number(fee) / 10000; // Ensure fee is a number
    return (
        <div className="bg-[#121212] text-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-lg">
            {/* Top */}
            <div className="flex items-center justify-between px-4 py-4">
                {/* Left: Token Info */}
                <div className="flex items-center gap-4">
                    {/* Icons */}
                    {
                        !!_get(token0Meta, 'image') && !!_get(token1Meta, 'image') && <div className="w-10 h-10 bg-button-sec-fill rounded-full flex items-center justify-center">
                            <img src={_get(token0Meta, 'image')} alt="" className='rounded-full z-10' />
                            <img src={_get(token1Meta, 'image')} alt="" className='rounded-full ml-[-50%]' />
                        </div>
                    }

                    {/* Pair + Status */}
                    <div>
                        <div className="text-sm font-semibold uppercase">{_get(token0Meta, 'symbol', 'Unknown')} / {_get(token1Meta, 'symbol', 'Unknown')}</div>
                        <div className="text-green-500 text-xs flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            In range
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2 ml-2">
                        <span className="text-xs bg-[#2e2e2e] text-white px-2 py-0.5 rounded-md">v3</span>
                        <span className="text-xs bg-[#2e2e2e] text-white px-2 py-0.5 rounded-md">{actualFee}%</span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#2e2e2e]" />

            {/* Bottom: Stats */}
            <div className="grid grid-cols-4 px-4 py-3 text-sm text-gray-300">
                <div>
                    <div className="text-white font-semibold">$0.49</div>
                    <div className="text-xs">Position</div>
                </div>
                <div>
                    <div className="text-white font-semibold">$0.00</div>
                    <div className="text-xs">Fees</div>
                </div>
                <div>
                    <div className="text-white font-semibold">4.34%</div>
                    <div className="text-xs">APR</div>
                </div>
            </div>
        </div>
    );
}


export const YourPositions: FC = () => {
    const t = useTranslations();
    const { openWalletModal } = useWalletModal();
    const { connected, address } = useWallet();

    const { data, isLoading } = useQuery({
        queryKey: ['positons', address],
        queryFn: async () => {
            try {
                if (!address) return []; // If no address, return empty array
                const response = await axios.get(`/api/pools/owner/${address}`);
                return _get(response, 'data.data.positions', []);
            } catch (error) {
                return []; // Return empty array on error
            }
        },
        enabled: !!address, // Only fetch if address exists
        refetchOnWindowFocus: false,
    });

    if (connected) {
        if (!_size(data)) {
            return <div className="border border-border-1-subtle rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px]">
                <div className="p-3 rounded-[8px] mb-4 bg-button-sec-fill">
                    <span role="img" aria-label="wallet">💼</span>
                </div>
                <p className="mb-2 text-lg font-medium">No positions</p>
                <p className="mb-4 text-gray-400 text-sm text-center">
                    You don't have any liquidity positions. Create a new position to start earning fees.
                </p>
                <div className="flex gap-2">
                    <Button
                        size='md'
                        className="bg-button-sec-fill whitespace-nowrap"
                    >
                        Explore pools
                    </Button>
                    <Link href="positions/create" className='w-full h-full'>
                        <Button
                            size='md'
                            className="bg-white text-black whitespace-nowrap"
                        >
                            {t("new_position")}
                        </Button>
                    </Link>
                </div>
            </div>
        }
        return data.map((position: any, index: number) => <PositionCard position={position} key={`positions: ${index}`} />)
    }

    return (
        <div className="border border-border-1-subtle rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px]">
            <div className="p-3 rounded-[8px] mb-4 bg-button-sec-fill">
                <span role="img" aria-label="wallet">💼</span>
            </div>
            <p className="mb-2 text-lg font-medium">{t("connect_y_wallet")}</p>
            <p className="mb-4 text-gray-400 text-sm text-center">
                {t("view_positions_title")}
            </p>
            <div className="flex gap-2">
                <Link href="positions/create" className='w-full h-full'>
                    <Button
                        size='md'
                        className="bg-button-sec-fill whitespace-nowrap"
                    >
                        {t("new_position")}
                    </Button>
                </Link>

                <Button
                    size='md'
                    className="bg-white text-black whitespace-nowrap"
                    onClick={openWalletModal}
                >
                    {t("connect_wallet")}
                </Button>
            </div>
        </div>
    );
}