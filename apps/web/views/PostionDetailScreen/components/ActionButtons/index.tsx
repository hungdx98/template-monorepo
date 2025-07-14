import Button from "@/components/Button";
import AddLiquidityModal from "../AddLiquidityModal";
import { usePoolDetailContext } from "@/context/positionDetail";
import RemoveLiquidityModal from "../RemoveLiquidityModal";

const ActionsButtons = () => {

  const {state: { poolData }, jobs:{calculateAmountOut,increaseLiquidity, dereaseLiquidity}} = usePoolDetailContext();

  const onOpenModalAddLiquidity = () => {
    window.openModal({
      // title: t('select_token'),
      size: 'sm',
      content: <AddLiquidityModal 
        poolData={poolData} 
        calculateAmountOut={calculateAmountOut} 
        increaseLiquidity={increaseLiquidity}
      />,
      onClose: () => {
        console.log("Modal closed");
      }
    })
  }

  const onOpenModalRemoveLiquidity = () => {
    window.openModal({
      // title: t('select_token'),
      size: 'sm',
      content: <RemoveLiquidityModal 
        poolData={poolData} 
        calculateAmountOut={calculateAmountOut} 
        dereaseLiquidity={dereaseLiquidity}
      />,
      onClose: () => {
        console.log("Modal closed");
      }
    })
  }
  return (
      <div className="flex gap-x-space-100">
        <div>
          <Button
            variant="secondary"
            className="text-font-size-175"
            onClick={onOpenModalAddLiquidity}
          >
            Add liquidity
          </Button>
        </div>
        <div>
           <Button 
            onClick={onOpenModalRemoveLiquidity}
            className="text-font-size-175"
            variant="secondary"
          >
          Remove liquidity
        </Button>
        </div>
       
        {/* <button className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 text-sm">
        Collect fees
        </button> */}
      </div>
  );
}
 
export default ActionsButtons;