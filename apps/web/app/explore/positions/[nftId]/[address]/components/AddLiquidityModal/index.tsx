import get from "lodash/get";

interface AddLiquidityModalProps {
  poolData: any
}
const AddLiquidityModal = (props: AddLiquidityModalProps) => {
  const { poolData } = props;
  console.log("🚀 ~ AddLiquidityModal ~ poolData:", poolData)

  

  // const token0 = get


  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Add liquidity</h1>
        <div className="text-gray-400 cursor-pointer">⚙️</div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span role="img" aria-label="ETH">Ξ</span>
          </div>
          <span>ETH / USDC</span>
        </div>
        <div className="bg-gray-700 px-2 py-1 rounded text-xs">v3 0.05%</div>
      </div>

      <div className="flex items-center text-green-500 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        In range
      </div>

      <div className="bg-[#2a2a2a] rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-2xl font-semibold">0.0001</span>
          <span className="bg-blue-600 px-2 py-1 rounded text-sm">ETH</span>
        </div>
        <div className="text-gray-400 text-sm">$0.28</div>
        <div className="text-gray-400 text-sm">0.004 ETH</div>
      </div>

      <div className="bg-[#2a2a2a] rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-2xl font-semibold">0.280848</span>
          <span className="bg-blue-600 px-2 py-1 rounded text-sm">USDC</span>
        </div>
        <div className="text-gray-400 text-sm">$0.28</div>
        <div className="text-gray-400 text-sm">2.23 USDC</div>
      </div>

      <div className="text-sm text-gray-400 mb-4">
        <div className="flex justify-between">
          <span>ETH position</span>
          <span>&lt;0.001 ETH</span>
        </div>
        <div className="flex justify-between">
          <span>USDC position</span>
          <span>0.262 USDC</span>
        </div>
        <div className="flex justify-between">
          <span>Network cost</span>
          <span>&lt;$0.01</span>
        </div>
      </div>

      <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold">
        Review
      </button>
    </div>
  );
}
 
export default AddLiquidityModal;