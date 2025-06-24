'use client'
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { usePoolStore } from '../../stores/usePoolStore';

export default function NewPosition() {

  const { poolAddress } = usePoolStore();

  console.log("Pool Address:", poolAddress);

  const [tokenA, setTokenA] = useState("ETH");
  const [tokenB, setTokenB] = useState("");
  const [feeTier, setFeeTier] = useState("0.3%");

  const canContinue = tokenA && tokenB && feeTier;


  const t = useTranslations();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">{t('common_go_back')}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Step Indicator */}
        <div className="space-y-4 border border-border-1-subtle rounded-border-radius-large p-5">
          <div className="flex items-start space-x-4">
            <div className="w-6 h-6 rounded-full bg-white text-black text-center">1</div>
            <div>
              <p className="font-semibold">Step 1</p>
              <p>Select token pair and fees</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 opacity-50">
            <div className="w-6 h-6 rounded-full border border-white text-center">2</div>
            <div>
              <p className="font-semibold">Step 2</p>
              <p>Set price range and deposit amounts</p>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-border-radius-large border border-border-1-subtle p-5">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Select pair</h2>
                <div className="flex space-x-4">
                  <div>
                    <select
                      className="w-[150px] p-2 bg-black border border-gray-600 rounded"
                      value={tokenA}
                      onChange={(e) => setTokenA(e.target.value)}
                    >
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                      <option value="DAI">DAI</option>
                    </select>
                  </div>
                  <div>
                    <select
                      className="w-[150px] p-2 bg-black border border-gray-600 rounded"
                      value={tokenB}
                      onChange={(e) => setTokenB(e.target.value)}
                    >
                      <option value="">Choose token</option>
                      <option value="USDC">USDC</option>
                      <option value="DAI">DAI</option>
                      <option value="WBTC">WBTC</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Fee tier</h2>
                <select
                  className="w-[200px] p-2 bg-black border border-gray-600 rounded"
                  value={feeTier}
                  onChange={(e) => setFeeTier(e.target.value)}
                >
                  <option value="0.05%">0.05%</option>
                  <option value="0.3%">0.3%</option>
                  <option value="1%">1%</option>
                </select>
                <p className="text-sm text-gray-400 mt-1">The % you will earn in fees</p>
              </div>

              <div>
                <button
                  disabled={!canContinue}
                  className={`w-full py-2 rounded ${canContinue ? 'bg-white text-black' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
