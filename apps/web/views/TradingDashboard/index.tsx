"use client";

import React from 'react';
import { TradingChart } from './TradingChart';
import { PriceDisplay } from './PriceDisplay';
import { TransactionTable } from './TransactionTable';
import { MetricCard } from './MetricCard';

export const TradingDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">WISE / ETH</h1>
            <span className="text-gray-400 text-sm">0x3b4b...5d4f</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-button-pri-fill px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Thêm thanh khoản
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Token liquidity
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TradingChart />
          </div>

          <div className="space-y-6">
            <PriceDisplay 
              price="8.2 N US$"
              change="0.01%"
              isPositive={true}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <MetricCard 
                label="Thống kê"
                value="502.9 N wise"
                subValue="29.5 N ETH"
              />
              <MetricCard 
                label="Giá trị"
                value="144.0 Tr US$"
                change="+0.01%"
              />
            </div>

            <MetricCard 
              label="Khối lượng trong 24 giờ"
              value="8.2 N US$"
              change="+0.01%"
            />

            <MetricCard 
              label="Phí"
              value="24.57 US$"
            />
          </div>
        </div>

        <div className="mt-8">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
};