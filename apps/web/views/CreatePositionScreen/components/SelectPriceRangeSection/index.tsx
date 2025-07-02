import React, { use, useState } from "react";
import { useTranslations } from "next-intl";
import cx from "@/utils/styled";
import { usePositionContext } from "@/context";
import get from "lodash/get";
import Image from "next/image";
import { Input } from "@/components/Input";
import Button from "@/components/Button";
export default function SelectPriceRangeSection() {

  const t = useTranslations();
  const [rangeMode, setRangeMode] = useState<"full" | "custom">("custom");
  const [minPrice, setMinPrice] = useState(2284.7593);
  const [maxPrice, setMaxPrice] = useState(2651.8386);

  const {
    state: {
      pairTokens,
      priceRange,
      depositAmount
    },
    jobs: {
      onChangePriceRange,
      onChangeDepositAmount
    }
} = usePositionContext()

  const token0 = get(pairTokens, 'token0')
  const token1 = get(pairTokens, 'token1')

  const adjustPrice = (
    type: "min" | "max",
    delta: number
  ) => {
    if (type === "min") {
      setMinPrice((prev) => prev + delta);
    } else {
      setMaxPrice((prev) => prev + delta);
    }
  };

  const handleChangePrice = (type: "min" | "max") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (type === "min") {
      setMinPrice(value ? parseFloat(value) : 0);
    } else {
      setMaxPrice(value ? parseFloat(value) : 0);
    }
  };



  return (
    <div className="">
      <div className="flex items-center mb-4 rounded-border-radius-huge border border-border-1-subtle p-5">

        <div className="flex items-center gap-x-space-100 mr-4">
          <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
              <Image width={48} height={48} src={get(token0, 'image', '')} alt="token" className="rounded-full"/>
          </div>
           <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
              <Image width={48} height={48} src={get(token1, 'image', '')} alt="token" className="rounded-full"/>
          </div>
        </div>
        <div className="text-2xl font-bold mr-2 uppercase">{token0?.symbol} / {token1?.symbol}</div>
        <span className="bg-gray-700 text-xs px-2 py-1 rounded">v3</span>
        <span className="ml-2 bg-gray-700 text-xs px-2 py-1 rounded">0.05%</span>
      </div>

      <div className="rounded-border-radius-huge border border-border-1-subtle p-5 ">
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
            { rangeMode === "full"
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
            <div className="text-xs mt-1 text-gray-400"> = 1 ETH</div>
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
            <div className="text-xs mt-1 text-gray-400">{token0?.symbol} = 1 {token1?.symbol}</div>
          </div>
        </div>

        <div className="text-font-size-300 mb-4">{t('deposit_tokens')}</div>

        <div className="flex flex-col gap-y-space-200">
          <div className="bg-background-2 p-4 rounded-border-radius-large">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <Input 
                  value={depositAmount.base}
                  onChange={onChangeDepositAmount('base')}
                  variant="unstyled" 
                  placeholder="0" 
                  containerClassName="px-0" 
                  className="text-font-size-300"
                />
                <p className="text-text-subtle">$0</p>
              </div>
              <div className="flex items-center gap-x-space-100">
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
                  <Image width={32} height={32} src={get(token0, 'image', '')} alt="token" className="rounded-full"/>
                </div>
                <p className="uppercase">{token0?.symbol}</p>
              </div>
            </div>
          </div>

          <div className="bg-background-2 p-4 rounded-border-radius-large">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <Input 
                  value={depositAmount.pair}
                  onChange={onChangeDepositAmount('pair')}
                  variant="unstyled" 
                  placeholder="0" 
                  containerClassName="px-0" 
                  className="text-font-size-300"
                />
                <p className="text-text-subtle">$0</p>
              </div>
              <div className="flex items-center gap-x-space-100">
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
                  <Image width={32} height={32} src={get(token1, 'image', '')} alt="token" className="rounded-full"/>
                </div>
                <p className="uppercase">{token1?.symbol}</p>
              </div>
            </div>
          </div>

        </div>

        <Button className="mt-4">Continue</Button>
      </div>
     
    </div>
  );
}
