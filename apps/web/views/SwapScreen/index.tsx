"use client"

import Button from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Input } from "@/components/Input";
import TokenSelector from "@/components/TokenSelector";
import { useSwapService } from "@/context";
import PageContainer from "@/layouts/PageContainer";
import { useTokensStore } from "@/stores";
import { useWallet } from "@coin98-com/wallet-adapter-react";
import { convertWeiToBalance, formatNumberBro } from "@wallet/utils";
import get from "lodash/get";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/shallow";

const SwapScreen = () => {
    const t = useTranslations();
    const tokens = useTokensStore(useShallow(state => state.coinCurrent));
    const { state: { pairTokens, amountIn, fiatIn, fiatOut, quote }, jobs: { onSelectPairToken, onChangeAmountIn, handleExchange } } = useSwapService();
    const { address } = useWallet();

    const amountOutExpect = convertWeiToBalance(get(quote, 'amountOut', '0'), get(pairTokens, 'token0.decimals', 18));

    return <PageContainer
        size='sm'
        className="min-h-screen bg-black text-white p-6 mt-4">
        <div className="max-w-md mx-auto mt-10 bg-background-1 text-white rounded-xl p-4 shadow-lg">
            {/* Tabs */}
            <div className="flex items-center space-x-4 text-sm">
                <button className="px-3 py-1 rounded-full text-white">
                    Swap
                </button>
            </div>
            {/* Sell box */}
            <div className="relative border border-border-1-subtle p-4 rounded-xl mt-4">
                <div className="flex justify-between items-center text-sm mb-3 text-gray-400">
                    <span>Sell</span>
                    <span>Balance: {formatNumberBro(get(pairTokens, 'token0.balance', '0'), 4)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <Input
                        value={amountIn}
                        onChange={(e) => onChangeAmountIn(e.target.value)}
                        variant="unstyled"
                        placeholder="0"
                        containerClassName="px-0"
                        className="text-font-size-300"
                        type="number"
                        disabled={!address}
                    />
                    <div className="ml-auto cursor-pointer">
                        <TokenSelector
                            tokens={tokens}
                            onSelectedToken={(token) => onSelectPairToken('token0', token)}
                            key={'token0'}
                            className="bg-background-2 text-white rounded-[8px] px-3 py-2 flex items-center gap-2 w-32"
                            selectedToken={get(pairTokens, 'token0')}
                            textClassName="text-white"
                            iconClassName="text-white"
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm mt-2 text-gray-400">
                    <span>${formatNumberBro(fiatIn, 4)}</span>
                </div>
            </div>

            {/* Arrow down */}
            <div className="flex justify-center z-10" style={{
                margin: '-20px 0',
            }}>
                <div className="z-10 p-2 rounded-[8px] bg-background-1">
                    <div className="rounded-[8px] px-3 py-2 z-10 bg-background-2">
                        <Icon name='app_arrow_down' />
                    </div>
                </div>
            </div>

            {/* Buy box */}
            <div className="bg-background-2 p-4 rounded-xl mb-4">
                <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                    <span>Buy</span>
                    <span>Balance: {formatNumberBro(get(pairTokens, 'token1.balance', '0'), 4)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <Input
                        value={formatNumberBro(amountOutExpect, 8)}
                        variant="unstyled"
                        placeholder="0"
                        containerClassName="px-0"
                        className="text-font-size-300"
                        type="number"
                        readOnly
                        disabled
                    />
                    <div className="ml-auto cursor-pointer">
                        <TokenSelector
                            tokens={tokens}
                            onSelectedToken={(token) => onSelectPairToken('token1', token)}
                            key={'token0'}
                            className="bg-transparent border border-border-2 rounded-[8px] px-3 py-2 flex items-center gap-2 w-32"
                            selectedToken={get(pairTokens, 'token1')}
                            textClassName="text-white"
                            iconClassName="text-white"
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm mt-2 text-gray-400">
                    <span>${formatNumberBro(fiatOut, 4)}</span>
                </div>
            </div>
            {/* Submit button */}
            <Button
                variant="secondary"
                className="text-font-size-175 rounded-xl"
                onClick={handleExchange(quote)}
                disabled={!quote || !quote.transaction || !address}
            >
                Swap
            </Button>
        </div>
    </PageContainer>
}
export default SwapScreen;