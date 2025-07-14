import Button from "@/components/Button";
import ToastSuccess from "@/components/ToastSuccess";
import TokenInput from "@/components/TokenInput";
import { convertWeiToBalance, formatNumberBro } from "@wallet/utils";
import get from "lodash/get";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";

interface RemoveLiquidityModalProps {
  poolData: any
  calculateAmountOut?: (amount0: string, type: 'base' | 'pair') => string
  dereaseLiquidity?: () => Promise<string | any>
}
const RemoveLiquidityModal = (props: RemoveLiquidityModalProps) => {
  const { poolData, calculateAmountOut, dereaseLiquidity } = props;
  console.log("🚀 ~ RemoveLiquidityModal ~ poolData:", poolData)

  const t = useTranslations()

  const [amount, setAmount] = useState({
    base: '',
    pair: ''
  })

  const [isLoading, setIsLoading] = useState(false);

  const token0 = get(poolData, 'token0', {});
  const token1 = get(poolData, 'token1', {});

  const {fee, amount0, amount1} = poolData;

  const token0Position = formatNumberBro(convertWeiToBalance(amount0, get(token0, 'decimals', 18)), 6) ;
  const token1Position = formatNumberBro(convertWeiToBalance(amount1, get(token1, 'decimals', 18)), 6) ;

  const onChangeAmount = (type: 'base' | 'pair') => (e) => {
    const value = e.target.value;

    const otherValue = calculateAmountOut?.(value, type)
    setAmount((prev) => ({
      ...prev,
      [type]: value,
      [type === "base" ? "pair" : "base"]: otherValue
    }));
  }

  const handleRemoveLiquidity = async () => {
    setIsLoading(true);
    const hash = await dereaseLiquidity?.();
    console.log('hash remove liquidity', hash);
    if(hash && typeof hash === 'string') {
      toast.success(<ToastSuccess message={'remove_liquidity_success'} hash={hash}/>, {
        type: 'success',
        delay: 50,
        autoClose: 15000,
        transition: Bounce
      })
    }
    setIsLoading(false);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">{t('remove_liquidity')}</h1>
        <div className="text-gray-400 cursor-pointer">⚙️</div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-x-space-100 mr-4">
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
              <Image width={32} height={32} src={get(token0, 'image', '_')} alt="token" className="rounded-full" />
            </div>
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
              <Image width={32} height={32} src={get(token1, 'image', '_')} alt="token" className="rounded-full" />
            </div>
          </div>
          <span className="uppercase">{token0?.symbol} / {token1?.symbol}</span>
        </div>
        <div className="flex items-center space-x-space-100">
          <div className="bg-background-2 p-1 rounded text-xs">v3</div>
          <div className="bg-background-2 p-1 rounded text-xs">{Number(fee) / 10000}%</div>
        </div>
      </div>

      <div className="flex items-center text-green-500 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        In range
      </div>

      <div className="flex flex-col gap-y-space-100">


      </div>



      <div className="text-font-size-175 mb-4 flex flex-col gap-y-space-100 mt-3">
        <div className="flex justify-between">
          <span className="text-text-subtle">{t('symbol_position', {symbol: token0?.symbol?.toUpperCase()})}</span>
          <span className="uppercase">{token0Position} {token0?.symbol?.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-subtle">{t('symbol_position', {symbol: token1?.symbol})}</span>
          <span className="uppercase">{token1Position} {token1?.symbol}</span>
        </div>
      </div>

      <Button
        onClick={handleRemoveLiquidity}
        isLoading={isLoading}
      >
        {t('review')}
      </Button>
    </div>
  );
}
 
export default RemoveLiquidityModal;