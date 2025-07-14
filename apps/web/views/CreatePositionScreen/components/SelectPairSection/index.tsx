import Button from "@/components/Button";
import { Icon } from "@/components/Icon";
import TokenSelector from "@/components/TokenSelector";
import { EPositionStep, useCreatePositionContext } from "@/context";
import { useTokensStore } from "@/stores";
import cx from "@/utils/styled";
import get from "lodash/get";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import FeeSelections from "../FeeSelections";

const SelectPairSection = () => {

  const { state: {  pairTokens, isContinue, feeTier }, jobs: { 
    onChangeStep, onSelectPairToken, onSelectFeeTier , setIsCreatedPool,
    findPoolAddress, setPoolAddress
  } 
} = useCreatePositionContext();
  const tokens = useTokensStore((state) => state.coinCurrent);

  const t = useTranslations()
  const [isDisplayMoreFee, setIsDisplayMoreFee] = useState(false);



   const checkIsCreatedPool = async() => {
      const poolAddress = await findPoolAddress(feeTier.toString());
      setIsCreatedPool(!!poolAddress);
      if(poolAddress) {
        setPoolAddress(poolAddress);
      }
    }
  
    useEffect(() => {
      checkIsCreatedPool()
    }, [feeTier, JSON.stringify(pairTokens)]);


  const onShoMoreFee = () => {
    if(!pairTokens.token0 || !pairTokens.token1) return
    setIsDisplayMoreFee(!isDisplayMoreFee)
  };

  const handleContinue = () => {
    onChangeStep(EPositionStep.price_range)
  }


  

  return (
    <div className="rounded-border-radius-huge border border-border-1-subtle p-5">
      <div className="space-y-6">
        <div>
          <div className="text-font-size-225">{t('select_pair')}</div>
          <p className='text-sm text-text-subtle'>{t('select_pair_description')}</p>
          <div className="flex space-x-4 mt-4">
            <TokenSelector
              tokens={tokens}
              onSelectedToken={(token) => onSelectPairToken('token0', token)}
              key={'token0'}
              selectedToken={get(pairTokens, 'token0')}
            />
            <TokenSelector
              tokens={tokens}
              onSelectedToken={(token) => onSelectPairToken('token1', token)}
              key={'token1'}
              selectedToken={get(pairTokens, 'token1')}

            />
          </div>
        </div>

        <div>
          <h2 className="text-font-size-225">{t('fee_tier')}</h2>
          <p className='text-sm text-text-subtle'>{t('fee_tier_description')}</p>
        </div>

        <div className='flex flex-col gap-y-2'>

          <div className='rounded-border-radius-large border border-border-1-subtle p-4 flex items-center justify-between'>
            <div>
              <span className="text-font-size-200">{t('fee_tier_value', { value: feeTier })}</span>
              <p className='text-sm text-text-subtle'>{t('fee_earn_description')}</p>
            </div>

            <div
              onClick={onShoMoreFee}
              className={cx('flex items-center gap-x-space-100 cursor-pointer bg-button-sec-fill p-2 rounded-border-radius-medium hover:opacity-75 transition', {
                'cursor-not-allowed hover:opacity-100': !pairTokens.token0 || !pairTokens.token1
              })}>
              <p className='text-sm'>{t('more')}</p>
              <Icon name='app_chevron_down' />
            </div>
          </div>

          <FeeSelections
            isDisplayed={isDisplayMoreFee}
            currentFee={feeTier}
            onChangeFee={onSelectFeeTier}
          />
        </div>


        <div>
          <Button
            size='lg'
            disabled={!isContinue}
            onClick={handleContinue}
          >
            {/* {isCreatedPool ? t('continue') : t('create_pool')} */}
            {t('continue')}
          </Button>
        </div>
      </div>
  </div>
  );
}
 
export default SelectPairSection;