'use client'

import Button from '@/components/Button';
import { Icon } from '@/components/Icon';
import TokenSelector from '@/components/TokenSelector';
import { EPositionStep, usePositionContext } from '@/context/position';
import { useTokensStore } from '@/stores';
import cx from '@/utils/styled';
import { get } from 'lodash';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import FeeSelections from './components/FeeSelections';

export default function CreatePositionSreen() {
  const { state: { step, pairTokens, isContinue, feeTier }, jobs: { onChangeStep, onSelectPairToken, onSelectFeeTier } } = usePositionContext();

  const tokens = useTokensStore(useShallow(state => [
    state.coinCurrent,
  ]));

  const [isDisplayMoreFee, setIsDisplayMoreFee] = useState(false);

  const isPriceRangeStep = step === EPositionStep.price_range;
  const isTokenPairStep = step === EPositionStep.token_pair;

  const t = useTranslations();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">{t('new_position')}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Step Indicator */}
        <div className="border border-border-1-subtle rounded-border-radius-huge p-5 h-fit">
          <div className={cx("flex items-center space-x-4", isPriceRangeStep && 'opacity-50 cursor-pointer')} onClick={onChangeStep(EPositionStep.token_pair)}>
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
              1
            </div>
            <div>
              <p className="text-text-subtle">{t('step', { number: 1 })}</p>
              <p>{t('select_token_pair_fee')}</p>
            </div>
          </div>

          <div className='h-[36] border-l-2 border-border-2 mx-4 my-2'></div>

          <div className={cx("flex items-center space-x-4 cursor-pointer", isTokenPairStep && 'opacity-50 cursor-not-allowed')}>
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
              2
            </div>
            <div>
              <p className="text-text-subtle">{t('step', { number: 2 })}</p>
              <p>{t('select_token_range_amount')}</p>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-border-radius-huge border border-border-1-subtle p-5">
            {
              isTokenPairStep && <div className="space-y-6">
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
                      onClick={() => setIsDisplayMoreFee(!isDisplayMoreFee)}
                      className='flex items-center gap-x-space-100 cursor-pointer bg-button-sec-fill p-2 rounded-border-radius-medium hover:opacity-75 transition'>
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
                    onClick={onChangeStep(EPositionStep.price_range)}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            }
            {
              isPriceRangeStep && <div className="space-y-6">
                <h2 className="text-font-size-225">hehehehe</h2>
                {/* <p className='text-sm text-text-subtle'>{t('price_range_description')}</p> */}
                {/* Price Range Input Component would go here */}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
