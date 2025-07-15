"use client"

import Button from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Input } from "@/components/Input";
import Notice from "@/components/Notice";
import TokenSelector from "@/components/TokenSelector";
import { useSwapService } from "@/context";
import PageContainer from "@/layouts/PageContainer";
import { generateErrorMessage } from "@/utils";
import cx from "@/utils/styled";
import { useWallet } from "@coin98-com/wallet-adapter-react";
import { convertWeiToBalance, formatNumberBro, truncate } from "@wallet/utils";
import dayjs from "dayjs";
import get from "lodash/get";
import { useTranslations } from "next-intl";
import { CustomTooltip } from "@/components/Tooltip";
import FeeSelections from "../CreatePositionScreen/components/FeeSelections";

const SwapScreen = () => {
    const t = useTranslations();
    const { state: { pairTokens, fiatIn, fiatOut, priceImpact, isHigherPriceImpact, quote, isFetching, error, isLoadingTx, coinCurrent: tokens, feeTier, slippage }, jobs: { onSelectPairToken, onChangeAmountIn, handleExchange, onSelectFeeTier, onChangeSlippage } } = useSwapService();
    const { address } = useWallet();
    const amountOutExpect = convertWeiToBalance(get(quote, 'amountOut', '0'), get(pairTokens, 'token0.decimals', 18));

    return <PageContainer
        size='sm'
        className="min-h-screen bg-black text-white p-6 mt-4">
        <div className="max-w-md mx-auto mt-10 bg-background-1 text-white rounded-xl p-4 shadow-lg">
            {/* Tabs */}
            <div className="flex items-center space-x-4 text-sm justify-between">
                <div className="px-3 py-1 rounded-full text-white">
                    Swap
                </div>
                <Button variant="secondary" className="text-font-size-175 rounded-xl w-fit bg-transparent" id="anchor-settings">
                    <Icon name="app_menu_settings" className="text-white text-[14px]" />
                </Button>
                <CustomTooltip
                    variant="dark"
                    anchorSelect="#anchor-settings"
                    place="right-start"
                    className='!p-4 !shadow-drop-shadow z-99 !rounded-lg h-fit'
                    opacity={1}
                    openOnClick
                    events={['click']}
                    clickable
                    noArrow
                >
                    <div className='flex flex-col justify-start items-start w-[360px]'>
                        <div className="flex items-center justify-between w-full mb-2 space-y-2">
                            <div className="text-gray-400">
                                Max slippage
                            </div>
                            <Input
                                value={slippage}
                                variant="filled"
                                placeholder="0"
                                containerClassName="w-2xl h-8 max-w-[40%] px-2 py-1"
                                type="number"
                                onChange={onChangeSlippage}
                            />
                        </div>
                        <div className='flex flex-col gap-y-2 w-full space-y-2'>
                            <div className="text-gray-400">Fee tier</div>
                            <FeeSelections
                                isDisplayed={true}
                                currentFee={feeTier}
                                onChangeFee={onSelectFeeTier}
                                className="w-full h-fit"
                                isHiddenTVL
                            />
                        </div>
                    </div>
                </CustomTooltip>
            </div>
            {/* Sell box */}
            <div className="relative border border-border-1-subtle p-4 rounded-xl mt-4">
                <div className="flex justify-between items-center text-sm mb-3 text-gray-400">
                    <span>Sell</span>
                    <span>Balance: {formatNumberBro(get(pairTokens, 'token0.balance', '0'), 4)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <Input
                        onChange={onChangeAmountIn}
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
                    <span>
                        ${formatNumberBro(fiatOut, 4) + " "}
                        <span className={cx(isHigherPriceImpact && "text-red-500")}>{!!priceImpact && ("(" + formatNumberBro(priceImpact, 2) + "%)")}</span>
                    </span>
                </div>
            </div>
            {
                !!quote && <div className="my-4">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>Fee</span>
                        <span className="">{Number(get(quote, 'fee', '0')) / 10000}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>Slippage</span>
                        <span className="uppercase">{get(quote, 'slippage', 0)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>Minimum Received</span>
                        <span className="uppercase">{formatNumberBro(convertWeiToBalance(get(quote, 'amountOutMinimum', '0'), get(pairTokens, 'token1.decimals', 18)), 8) + ` ${get(pairTokens, 'token1.symbol', '')}`}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>Pool</span>
                        <span className="">{truncate(get(quote, 'pool', ''))}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>Deadline</span>
                        <span className="">{dayjs(get(quote, 'deadline', 0) * 1000).format('DD/MM/YYYY hh:mm:ss')}</span>
                    </div>
                </div>
            }
            {
                // Error handling
                !!error && <Notice icon="warning" content={generateErrorMessage(error)} className="mb-4" />
            }

            {/* Submit button */}
            <Button
                variant="secondary"
                className="text-font-size-175 rounded-xl"
                onClick={handleExchange(quote)}
                disabled={!quote || !quote.transaction || !address}
                isLoading={isFetching || isLoadingTx}
            >
                Swap
            </Button>
        </div>
    </PageContainer>
}
export default SwapScreen;