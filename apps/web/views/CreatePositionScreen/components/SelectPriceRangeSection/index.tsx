import React, { useState } from "react";

export default function SelectPriceRangeSection() {
  const [rangeMode, setRangeMode] = useState<"full" | "custom">("custom");
  const [minPrice, setMinPrice] = useState(2284.7593);
  const [maxPrice, setMaxPrice] = useState(2651.8386);

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

  return (
    <div className="bg-black text-white p-6 rounded-xl max-w-lg mx-auto">
      <div className="flex items-center mb-4">
        <div className="text-2xl font-bold mr-2">ETH / USDT</div>
        <span className="bg-gray-700 text-xs px-2 py-1 rounded">v4</span>
        <span className="ml-2 bg-gray-700 text-xs px-2 py-1 rounded">0.05%</span>
      </div>

      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded-l ${rangeMode === "full" ? "bg-purple-600" : "bg-gray-700"}`}
          onClick={() => setRangeMode("full")}
        >
          Full range
        </button>
        <button
          className={`px-4 py-2 rounded-r ${rangeMode === "custom" ? "bg-purple-600" : "bg-gray-700"}`}
          onClick={() => setRangeMode("custom")}
        >
          Custom range
        </button>
      </div>

      <p className="text-sm mb-4">
        Custom range allows you to concentrate your liquidity within specific price bounds,
        enhancing capital efficiency and fee earnings but requiring more active management.
      </p>

      <div className="bg-gray-800 h-40 mb-4 flex items-center justify-center">
        <span className="text-gray-400">[ Chart Placeholder ]</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <div className="mb-2 text-sm">Min price</div>
          <div className="flex items-center">
            <button
              className="px-2 py-1 bg-gray-700 rounded"
              onClick={() => adjustPrice("min", -1)}
            >
              -
            </button>
            <div className="mx-2">{minPrice.toFixed(4)}</div>
            <button
              className="px-2 py-1 bg-gray-700 rounded"
              onClick={() => adjustPrice("min", 1)}
            >
              +
            </button>
          </div>
          <div className="text-xs mt-1 text-gray-400">USDT = 1 ETH</div>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <div className="mb-2 text-sm">Max price</div>
          <div className="flex items-center">
            <button
              className="px-2 py-1 bg-gray-700 rounded"
              onClick={() => adjustPrice("max", -1)}
            >
              -
            </button>
            <div className="mx-2">{maxPrice.toFixed(4)}</div>
            <button
              className="px-2 py-1 bg-gray-700 rounded"
              onClick={() => adjustPrice("max", 1)}
            >
              +
            </button>
          </div>
          <div className="text-xs mt-1 text-gray-400">USDT = 1 ETH</div>
        </div>
      </div>
    </div>
  );
}
