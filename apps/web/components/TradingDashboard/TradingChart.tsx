"use client";

import React, { useState } from 'react';

interface ChartDataPoint {
  value: number;
  height: number;
  date: string;
  volume: number;
}

export const TradingChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('1Y');

  // Fake data 
  const chartData: ChartDataPoint[] = [
    { value: 1.2, height: 15, date: 'Jan', volume: 120000 },
    { value: 2.8, height: 35, date: 'Feb', volume: 280000 },
    { value: 1.8, height: 22, date: 'Mar', volume: 180000 },
    { value: 4.2, height: 52, date: 'Apr', volume: 420000 },
    { value: 8.2, height: 100, date: 'May', volume: 820000 },
    { value: 6.1, height: 75, date: 'Jun', volume: 610000 },
    { value: 3.5, height: 43, date: 'Jul', volume: 350000 },
    { value: 5.8, height: 71, date: 'Aug', volume: 580000 },
    { value: 4.9, height: 60, date: 'Sep', volume: 490000 },
    { value: 7.2, height: 88, date: 'Oct', volume: 720000 },
    { value: 5.5, height: 67, date: 'Nov', volume: 550000 },
    { value: 6.8, height: 83, date: 'Dec', volume: 680000 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));
  const yAxisLabels = [
    `$${maxValue.toFixed(1)} US$`,
    `$${(maxValue * 0.8).toFixed(1)} US$`,
    `$${(maxValue * 0.6).toFixed(1)} US$`,
    `$${(maxValue * 0.4).toFixed(1)} US$`,
    `$${(maxValue * 0.2).toFixed(1)} US$`,
    '$0.00 US$'
  ];

  const periods = ['1D', '7D', '1M', '1Y'];

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">8.2 N US$</h2>
          <p className="text-sm text-gray-400 mt-1">Hiện tại: 8.2N</p>
        </div>
        <div className="flex items-center space-x-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
                selectedPeriod === period
                  ? 'bg-button-pri-fill text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80 bg-gray-900/50 rounded-lg p-4">
        {/* Y-axis Grid Lines */}
        {/* <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {yAxisLabels.map((_, index) => (
            <div key={index} className="border-t border-gray-700/30 w-full" />
          ))}
        </div> */}

        {/* Y-axis Labels */}
        {/* <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-4 py-2">
          {yAxisLabels.map((label, index) => (
            <span key={index} className="leading-none">{label}</span>
          ))}
        </div> */}

        {/* Chart Bars */}
        {/* <div className="ml-20 mr-4 h-full flex items-end justify-between pb-8">
        
        </div> */}

        {/* X-axis Labels */}
        {/* <div className="absolute bottom-0 left-20 right-4 flex justify-between text-xs text-gray-400">
          {chartData.map((bar, index) => (
            <span key={index} className="text-center">{bar.date}</span>
          ))}
        </div> */}
      </div>

      {/* Chart Info */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-sm"></div>
            <span className="text-sm text-gray-400">Volume (US$)</span>
          </div>
          <button className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
            📊 Phóng to
          </button>
          <button className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
            📉 Thu nhỏ
          </button>
        </div>
        <div className="text-xs text-gray-400 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Cập nhật lần cuối: 2 phút trước</span>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-lg font-semibold text-white">
            {chartData.reduce((sum, item) => sum + item.volume, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Tổng Volume</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">
            +{((chartData[chartData.length - 1].value / chartData[0].value - 1) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">Tăng trưởng</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-white">
            {Math.max(...chartData.map(d => d.value)).toFixed(1)}N
          </div>
          <div className="text-xs text-gray-400">Cao nhất</div>
        </div>
      </div>
    </div>
  );
};