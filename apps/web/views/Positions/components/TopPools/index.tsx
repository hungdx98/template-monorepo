import { useTranslations } from "next-intl";
import { FC } from "react";

const pools = [
    { pair: 'WISE / ETH', apr: '0.01%', version: 'v2', fee: '0.3%' },
    { pair: 'USDC / USDT', apr: '0.47%', version: 'v4', fee: '0.01%', extra: '+8.17%' },
    { pair: 'USDC / ETH', apr: '5.25%', version: 'v3', fee: '0.05%' },
    { pair: 'ETH / USDC', apr: '15%', version: 'v4', fee: '0.05%', extra: '+17.68%' },
    { pair: 'ETH / wstETH', apr: '0.10%', version: 'v4', fee: '0.01%', extra: '+5.59%' },
    { pair: 'WBTC / ETH', apr: '5.3%', version: 'v3', fee: '0.3%' },
];

export const TopPools: FC = () => {
    const t = useTranslations();

    return (
        <div className="rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">{t("top_pools_tvl")}</h3>
            <div className="flex flex-col gap-3">
                {pools.map((pool, idx) => (
                    <div key={idx} className="flex items-start justify-between border border-border-1-subtle rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-button-sec-fill rounded-full flex items-center justify-center">
                                {/* Token icon placeholder */}
                                <span role="img" aria-label="token">🪙</span>
                            </div>
                            <div>
                                <div className="font-medium">{pool.pair}</div>
                                <div className="flex gap-0.5 mt-1">
                                    <div className="text-xs text-gray-400 bg-button-sec-fill rounded-tl-[6px] rounded-bl-[6px] py-1 px-2">{pool.version}</div>
                                    <div className="text-xs text-gray-400 bg-button-sec-fill rounded-tr-[6px] rounded-br-[6px] py-1 px-2">{pool.fee}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex text-right flex-col gap-2">
                            <div className="text-text-subtle">{pool.apr} {t("apr")}</div>
                            {pool.extra && <div className="text-pink-400 text-xs">{pool.extra}</div>}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-right">
                <a href="#" className="text-gray-400 hover:underline text-sm">{t("explore_more")} →</a>
            </div>
        </div>
    );
}