'use client'

import { useTranslations } from 'next-intl';
import React, { FC, useState } from 'react';
import { Button, Icon, TokenSelector } from '../../components';
import { usePoolStore } from '@repo/containers';
import FeeSelections from './components/FeeSelections';

export const CreatePositionSreen: FC = () => {

  const { poolAddress } = usePoolStore();

  console.log("Pool Address:", poolAddress);

  const [tokenA, setTokenA] = useState("ETH");
  const [tokenB, setTokenB] = useState("");
  const [feeTier, setFeeTier] = useState("0.3");

  const [isDisplayMoreFee, setIsDisplayMoreFee] = useState(false);

  const canContinue = tokenA && tokenB && feeTier;


  const t = useTranslations();

  const onOpenModal = () => {
    window.openModal({
      title: t('select_token_pair_fee'),
      content: <div>oheah</div>,
      onClose: () => {
        console.log("Modal closed");
      }
    })
  }

  const onChangeFee = (fee: string) => () => {
    setFeeTier(fee);
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">{t('new_position')}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Step Indicator */}
        <div className="border border-border-1-subtle rounded-border-radius-huge p-5 h-fit">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
              1
            </div>
            <div>
              <p className="text-text-subtle">{t('step', { number: 1 })}</p>
              <p>{t('select_token_pair_fee')}</p>
            </div>
          </div>

          <div className='h-[36] border-l-2 border-border-2 mx-4 my-2'></div>

          <div className="flex items-center space-x-4 opacity-50">
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
            <div className="space-y-6">
              <div>
                <div className="text-font-size-225">{t('select_pair')}</div>
                <p className='text-sm text-text-subtle'>{t('select_pair_description')}</p>
                <div className="flex space-x-4 mt-4">
                  <TokenSelector onClick={onOpenModal} />
                  <TokenSelector onClick={onOpenModal} />
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
                  onChangeFee={onChangeFee}
                />
              </div>


              <div>
                <Button
                  size='lg'
                  disabled={!canContinue}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
