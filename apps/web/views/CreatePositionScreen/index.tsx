'use client'

import { useTokensStore } from '@/stores';
import cx from '@/utils/styled';
import { get } from 'lodash';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import FeeSelections from './components/FeeSelections';
import SelectPairSection from './components/SelectPairSection';
import SelectPriceRangeSection from './components/SelectPriceRangeSection';
import PageContainer from '@/layouts/PageContainer';
import { useCreatePositionContext, EPositionStep } from '@/context';

export default function CreatePositionSreen() {
  const { state: { step }, jobs: { onChangeStep } } = useCreatePositionContext();

  const tokens = useTokensStore(useShallow(state => [
    state.coinCurrent,
  ]));

  const isPriceRangeStep = step === EPositionStep.price_range;
  const isTokenPairStep = step === EPositionStep.token_pair;


  const t = useTranslations();

  return (
    <PageContainer 
      size='sm'
      className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">{t('new_position')}</h1>

      <div className="grid md:grid-cols-10 gr gap-6">
        {/* Step Indicator */}
        <div className="border border-border-1-subtle rounded-border-radius-huge p-5 h-fit md:col-span-4">
          <div className={cx("flex items-center space-x-4", isPriceRangeStep && 'opacity-50 cursor-pointer')} onClick={() => onChangeStep(EPositionStep.token_pair)}>
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
              1
            </div>
            <div className='flex-1'>
              <p className="text-text-subtle">{t('step', { number: 1 })}</p>
              <p className='text-font-size-175'>{t('select_token_pair_fee')}</p>
            </div>
          </div>

          <div className='h-[36] border-l-2 border-border-2 mx-4 my-2'></div>

          <div className={cx("flex items-center space-x-4 cursor-pointer", isTokenPairStep && 'opacity-50 cursor-not-allowed')}>
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
              2
            </div>
            <div className='flex-1'>
              <p className="text-text-subtle">{t('step', { number: 2 })}</p>
              <p className='text-font-size-175'>{t('select_token_range_amount')}</p>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="md:col-span-6 space-y-6">
          {
            isTokenPairStep
            ? <SelectPairSection/>
            : <SelectPriceRangeSection />
          }
          
        </div>
      </div>
    </PageContainer>
  );
}
