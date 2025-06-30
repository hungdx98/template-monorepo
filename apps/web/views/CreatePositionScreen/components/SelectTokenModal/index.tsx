import { Input } from "@/components/Input";
import React, { useState } from "react";

const tokens = [
  { name: "Ethereum", symbol: "ETH" },
  { name: "USD Coin", symbol: "USDC" },
  { name: "Tether USD", symbol: "USDT" },
  { name: "Wrapped BTC", symbol: "WBTC" },
  { name: "Wrapped ETH", symbol: "WETH" },
];

const popularTokens = [
  { name: "Ethereum", symbol: "ETH" },
  { name: "USDC", symbol: "USDC", address: "0xA0b8...eB48" },
  { name: "Tether", symbol: "USDT", address: "0xdAC1...1ec7" },
  { name: "Binance Bridged USDT (BNB Smart Chain)", symbol: "USDT", address: "0x55d3...7955" },
  { name: "Base ETH", symbol: "ETH", address: "" },
];

const SelectTokenModal = () => {
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState(["Ethereum", "Tether USD"]);

  const clearRecent = () => setRecent([]);

  const filteredTokens = popularTokens.filter((token) =>
    token.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="text-white rounded-xl p-4 space-y-4">
      {/* Search Bar */}
      {/* <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
        <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" /></svg>
        <input
          type="text"
          className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
          placeholder="Search tokens"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div> */}

      <Input/>

      {/* Token Shortcuts */}
      <div className="flex space-x-2 overflow-x-auto">
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="bg-gray-800 text-sm px-4 py-1 rounded-full whitespace-nowrap"
          >
            {token.symbol}
          </div>
        ))}
      </div>

      {/* Recent Searches */}
      {recent.length > 0 && (
        <div>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
            <span>Recent searches</span>
            <button onClick={clearRecent} className="hover:underline text-gray-500">Clear</button>
          </div>
          <div className="space-y-1">
            {recent.map((token, idx) => (
              <div key={idx} className="flex items-center text-white text-sm">
                {token}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token List by 24H Volume */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Tokens by 24H volume</div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {filteredTokens.map((token, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{token.name}</span>
              <span className="text-gray-400">{token.symbol}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectTokenModal;
