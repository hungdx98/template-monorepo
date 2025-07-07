import Button from "@/components/Button";
import { Input } from "@/components/Input";
import Notice from "@/components/Notice";
import { IDepositAmount, usePositionContext } from "@/context";
import cx from "@/utils/styled";
import { formatNumberBro } from '@wallet/utils';
import get from "lodash/get";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

export const SetInitialPrice = () => {
  const t = useTranslations();

  return (
    <div className="bg-black text-white max-w-xl rounded-xl py-4 space-y-5">
      {/* Title + subtitle */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{t('set_initial_price')}</h2>
        <p className="text-sm text-white/70">
          {t('set_initial_price_description')}
        </p>
      </div>

      {/* Price box */}
      <div className="bg-[#1E1E1E] rounded-xl px-5 py-4 space-y-2">
        <div className="text-sm text-white/70">{t('initial_price')}</div>
        <Input
          value={0}
          // onChange={}
          variant="unstyled"
          placeholder="0.00"
          containerClassName="px-0"
          className="text-font-size-300 text-3xl font-medium focus:outline-none appearance-none outline-none"
        />
        <div className="text-sm text-white/60">C98 = 1 BNB</div>
      </div>
    </div>
  );
}

// Mini component cho token pill
export const TokenPill = ({ label }: { label: string }) => {
  return (
    <div className="bg-[#2A2A2A] rounded-full px-3 py-1 flex items-center gap-2">
      <div className="w-5 h-5 rounded-full bg-yellow-500" /> {/* Token icon placeholder */}
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default function SelectPriceRangeSection() {
  const t = useTranslations();
  const [rangeMode, setRangeMode] = useState<"full" | "custom">("custom");

  const {
    state: {
      pairTokens,
      priceRange,
      depositAmount,
      isCreatedPool
    },
    jobs: {
      onChangePriceRange,
      setDepositAmount,
      setPriceRange,
      onCheckAllowance,
      setAllowanceAmount,
      onAddPoolLiquidity
      // onChangeDepositAmount
    }
  } = usePositionContext()

  const token0 = get(pairTokens, 'token0')
  const token1 = get(pairTokens, 'token1')
  const price0 = parseFloat(get(token0, 'market.current_price', '0'));
  const price1 = parseFloat(get(token1, 'market.current_price', '1'));


  const marketRate = useMemo(() => {
    if (!token0 || !token1) return 0;

    return Number(price0 / price1).toFixed(4);
  }, [token0, token1]);

  const handleChangeDepositAmount = (type: "base" | "pair") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return setDepositAmount({ base: '', pair: '' } as IDepositAmount);
    const rate = type === "base"
      ? price0 / price1
      : price1 / price0;
    const otherValue = Number(value) === 0 ? '0' : (parseFloat(value) * rate).toFixed(4).toString();

    const depositAmount = {
      [type]: value,
      [type === "base" ? "pair" : "base"]: otherValue
    }
    setDepositAmount(depositAmount as IDepositAmount);

  };

  const handleCheckAllowance = async () => {
    if (!token0 || !token1) return;
    const allowance0 = await onCheckAllowance(token0);
    const allowance1 = await onCheckAllowance(token1);

    setAllowanceAmount({
      base: allowance0,
      pair: allowance1
    })

    console.log('allowance0', allowance0);
    console.log('allowance1', allowance1);
  }

  useEffect(() => {
    handleCheckAllowance()
  }, [])

  useEffect(() => {
    handleSetInitPriceRange()
  }, [rangeMode]);



  const handleSetInitPriceRange = () => {
    if (rangeMode === "full") {
      return setPriceRange({
        min: '0',
        max: '0'
      });
    }
    const pairRate = price1 / price0
    const minPrice = pairRate * 0.95
    const maxPrice = pairRate * 1.05;
    setPriceRange({
      min: minPrice.toFixed(4).toString(),
      max: maxPrice.toFixed(4).toString()
    })
  }


  const pairRate = `${get(token0, 'symbol', '')} = 1 ${get(token1, 'symbol', '')}`;

  return (
    <div className="">
      <div className="rounded-border-radius-huge border border-border-1-subtle p-5 mb-4">
        <div className="flex items-center">
          <div className="flex items-center gap-x-space-100 mr-4">
            <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
              <Image width={48} height={48} src={get(token0, 'image', '')} alt="token" className="rounded-full" />
            </div>
            <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
              <Image width={48} height={48} src={get(token1, 'image', '')} alt="token" className="rounded-full" />
            </div>
          </div>
          <div className="text-2xl font-bold mr-2 uppercase">{token0?.symbol} / {token1?.symbol}</div>
          <span className="bg-gray-700 text-xs px-2 py-1 rounded">v3</span>
          <span className="ml-2 bg-gray-700 text-xs px-2 py-1 rounded">0.05%</span>
        </div>
        {!isCreatedPool && <Notice content='create_new_pool' title="create_new_pool_description" />}
      </div>

      <div className="rounded-border-radius-huge border border-border-1-subtle p-5 ">
        {!isCreatedPool && <SetInitialPrice />}

        <div className="flex items-center mb-2 bg-[#1E1E1E] rounded-xl px-5 py-4 space-y-2">
          <p className="text-text-subtle">Market price:</p>
          <p className="uppercase ml-1">1 {get(token0, 'symbol')} ~ {marketRate} {get(token1, 'symbol')}</p>
          <p className="text-text-subtle ml-1">(${formatNumberBro(get(token1, 'market.current_price', '0'), 2)})</p>
        </div>

        <div className="text-font-size-300 mb-4">{t('set_price_range')}</div>

        <div className="flex items-center gap-x-space-200 p-2 border border-border-1-subtle rounded-full">
          <div
            className={cx('px-4 flex-1 py-2 rounded-full cursor-pointer text-center', {
              "bg-background-2-active": rangeMode === "full",
            })}
            onClick={() => setRangeMode("full")}
          >
            Full range
          </div>
          <div
            className={cx('px-4 flex-1 py-2 rounded-full cursor-pointer text-center', {
              "bg-background-2-active": rangeMode === "custom",
            })}
            onClick={() => setRangeMode("custom")}
          >
            Custom range
          </div>
        </div>

        <p className="text-sm my-4">
          {rangeMode === "full"
            ? t('full_range_description')
            : t('custom_range_description')
          }
        </p>


        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-background-2 p-4 rounded-border-radius-large">
            <div className="mb-2 text-sm">Min price</div>
            <div className="flex items-center">
              <Input
                value={priceRange.min}
                onChange={onChangePriceRange('min')}
                variant="unstyled"
                placeholder="0"
                containerClassName="px-0"
                className="text-font-size-300"
              />
            </div>
            <div className="text-xs mt-1 text-gray-400 uppercase"> {pairRate}</div>
          </div>

          <div className="bg-background-2 p-4 rounded-border-radius-large">
            <div className="mb-2 text-sm">Max price</div>
            <div className="flex items-center">
              <Input
                value={priceRange.max}
                onChange={onChangePriceRange('max')}
                variant="unstyled"
                placeholder="0"
                containerClassName="px-0"
                className="text-font-size-300"
              />
            </div>
            <div className="text-xs mt-1 text-gray-400 uppercase">{pairRate}</div>
          </div>
        </div>

        <div className="text-font-size-300 mb-4">{t('deposit_tokens')}</div>

        <div className="flex flex-col gap-y-space-200">
          <div className="bg-background-2 p-4 rounded-border-radius-large">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <Input
                  value={depositAmount.base}
                  onChange={handleChangeDepositAmount('base')}
                  variant="unstyled"
                  placeholder="0"
                  containerClassName="px-0"
                  className="text-font-size-300"
                />
                <p className="text-text-subtle">${price0 * Number(depositAmount.base)}</p>
              </div>

              <div className="flex flex-col gap-y-space-100">
                <div className="flex items-center gap-x-space-100">
                  <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
                    <Image width={32} height={32} src={get(token0, 'image', '')} alt="token" className="rounded-full" />
                  </div>
                  <p className="uppercase">{token0?.symbol}</p>
                </div>
                <div className="uppercase text-font-size-175 text-text-subtle">{formatNumberBro(get(token0, 'balance', '0'), 4)} {get(token0, 'symbol')}</div>

              </div>
            </div>
          </div>

          <div className="bg-background-2 p-4 rounded-border-radius-large">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <Input
                  value={depositAmount.pair}
                  onChange={handleChangeDepositAmount('pair')}
                  variant="unstyled"
                  placeholder="0"
                  containerClassName="px-0"
                  className="text-font-size-300"
                />
                <p className="text-text-subtle">${price1 * Number(depositAmount.pair)}</p>
              </div>
              <div className="flex flex-col gap-y-space-100">
                <div className="flex items-center gap-x-space-100">
                  <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
                    <Image width={32} height={32} src={get(token1, 'image', '')} alt="token" className="rounded-full" />
                  </div>
                  <p className="uppercase">{token1?.symbol}</p>
                </div>
                <div className="uppercase text-font-size-175 text-text-subtle">{formatNumberBro(get(token1, 'balance', '0'), 4)} {get(token1, 'symbol')}</div>
              </div>
            </div>
          </div>

        </div>

        <Button
          size="lg"
          disabled={!depositAmount.base || !depositAmount.pair}
          onClick={onAddPoolLiquidity}
          className="mt-4">
          Continue
        </Button>
      </div>

    </div>
  );
}
