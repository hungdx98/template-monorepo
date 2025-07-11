import { Input } from "@/components/Input";
import { useTranslations } from "next-intl";
import get from "lodash/get";
import Image from "next/image";
import cx from "@/utils/styled";
import { useEffect } from "react";
import { useCreatePositionContext } from "@/context";

interface ISetInitialPriceProps {
  rateBy: 'base' | 'pair';
  setRateBy: (value: 'base' | 'pair') => void;
}

export const SetInitialPrice = (props: ISetInitialPriceProps) => {
  const { rateBy, setRateBy } = props;
  const t = useTranslations();

  const {state: {initialRate, pairTokens}, jobs: {setInitialRate}} = useCreatePositionContext();

  const token0 = get(pairTokens, 'token0', {});
  const token1 = get(pairTokens, 'token1', {});

  useEffect(() => {
    const token0Price = get(token0, 'market.current_price', 0);
    const token1Price = get(token1, 'market.current_price', 0);
    const initRate = rateBy === 'base'
      ? Number(token0Price) / Number(token1Price)
      : Number(token1Price) / Number(token0Price);

    setInitialRate(initRate.toFixed(6));

  }, [rateBy])
    // Reset initial rate when pair tokens change}

  const onselect = (type: 'base' | 'pair') => () => {
    setRateBy(type);
  }

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

        <div className="flex items-center justify-between mb-2">
          <Input
            value={initialRate}
            onChange={e => setInitialRate(e.target.value)}
            variant="unstyled"
            placeholder="0.00"
            containerClassName="px-0"
            className="flex-1 text-font-size-300 text-3xl font-medium focus:outline-none appearance-none outline-none"
          />

          <div>
            <div className="flex items-center gap-x-space-100 bg-background-app rounded-full p-2">
              <div 
                onClick={onselect('base')}
                className={cx("flex-1 rounded-full flex items-center p-2 w-24 cursor-pointer", {
                "bg-background-2": rateBy === 'base',
                })}
              >
                <div className="w-6 h-6 rounded-full flex all-center">
                  <Image width={24} height={24} src={get(token0, 'image', '')} alt="token" className="rounded-full" />
                </div>
                <p className="uppercase ml-2 truncate  text-font-size-175">{get(token0, 'symbol')}</p>
              </div>
              <div 
                onClick={onselect('pair')}
                className={cx("flex-1 cursor-pointer rounded-full flex items-center p-2 w-24", {
                "bg-background-2": rateBy === 'pair',
              })}>
                <div className="w-6 h-6 rounded-full flex all-center">
                  <Image width={24} height={24} src={get(token1, 'image', '')} alt="token" className="rounded-full" />
                </div>
                <p className="uppercase ml-2 truncate text-font-size-175">{get(token1, 'symbol')}</p>
              </div>
            </div>
          </div>
        </div>
      
        <div className="text-sm text-white/60 uppercase">{
          rateBy === 'base' 
            ? `${get(token0, 'symbol')} = 1 ${get(token1, 'symbol')}`
            : `${get(token1, 'symbol')} = 1 ${get(token0, 'symbol')}`
          }
        </div>
      </div>
    </div>
  );
}