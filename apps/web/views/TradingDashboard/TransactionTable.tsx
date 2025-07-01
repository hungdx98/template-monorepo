"use client";

import React, { useState } from 'react';

interface Transaction {
  type: 'Mua' | 'Bán';
  time: string;
  price: string;
  amount: string;
  total: string;
  hash: string;
  usdValue: number;
}

type FilterType = 'all' | 'buy' | 'sell';

export const TransactionTable: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');

  const allTransactions: Transaction[] = [
    {
      type: 'Mua',
      time: '14 giây',
      price: '138.23 US$',
      amount: '893.649',
      total: '6.81970',
      hash: '0x4f1...A8a1',
      usdValue: 123456
    },
    {
      type: 'Bán',
      time: '1 phút',
      price: '137.89 US$',
      amount: '942.863',
      total: '6.84521',
      hash: '0x7a2...B9c3',
      usdValue: 130021
    },
    {
      type: 'Mua',
      time: '3 phút',
      price: '139.15 US$',
      amount: '756.234',
      total: '5.43210',
      hash: '0x9d4...C7e5',
      usdValue: 105234
    },
    {
      type: 'Bán',
      time: '5 phút',
      price: '136.78 US$',
      amount: '1205.847',
      total: '8.81234',
      hash: '0x2f6...D8g7',
      usdValue: 164892
    },
    {
      type: 'Mua',
      time: '8 phút',
      price: '140.56 US$',
      amount: '623.891',
      total: '4.43876',
      hash: '0x5h8...E9i1',
      usdValue: 87654
    },
    {
      type: 'Bán',
      time: '12 phút',
      price: '135.42 US$',
      amount: '1089.567',
      total: '8.04321',
      hash: '0x8j0...F2k3',
      usdValue: 147563
    }
  ];

  const filteredTransactions = allTransactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'buy') return tx.type === 'Mua';
    if (filter === 'sell') return tx.type === 'Bán';
    return true;
  });

  const totalVolume = allTransactions.reduce((sum, tx) => sum + tx.usdValue, 0);
  const buyCount = allTransactions.filter(tx => tx.type === 'Mua').length;
  const sellCount = allTransactions.filter(tx => tx.type === 'Bán').length;

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Giao dịch</h3>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
            <span>Tổng: {allTransactions.length}</span>
            <span className="text-green-400">Mua: {buyCount}</span>
            <span className="text-red-400">Bán: {sellCount}</span>
            <span>Volume: ${totalVolume.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`text-sm px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('buy')}
            className={`text-sm px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
              filter === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Mua
          </button>
          <button
            onClick={() => setFilter('sell')}
            className={`text-sm px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
              filter === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Bán
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
              <th className="pb-3 font-medium">Thời gian</th>
              <th className="pb-3 font-medium">Loại</th>
              <th className="pb-3 font-medium">USD</th>
              <th className="pb-3 font-medium">WISE</th>
              <th className="pb-3 font-medium">ETH</th>
              <th className="pb-3 font-medium">Tx</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, index) => (
              <tr 
                key={index} 
                className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-all duration-200"
              >
                <td className="py-3 text-sm text-gray-300">{tx.time}</td>
                <td className="py-3">
                  <span className={`text-sm font-semibold px-2 py-1 rounded-md ${
                    tx.type === 'Mua' 
                      ? 'text-green-400 bg-green-400/10' 
                      : 'text-red-400 bg-red-400/10'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="py-3 text-sm font-medium text-white">{tx.price}</td>
                <td className="py-3 text-sm text-gray-300">{tx.amount}</td>
                <td className="py-3 text-sm text-gray-300">{tx.total}</td>
                <td className="py-3">
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline">
                    {tx.hash}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
        <span className="text-sm text-gray-400">
          Hiển thị {filteredTransactions.length} trong {allTransactions.length} giao dịch
        </span>
        <div className="flex space-x-2">
          <button className="text-sm px-3 py-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200">
            ← Trước
          </button>
          <div className="flex space-x-1">
            <button className="text-sm px-3 py-1.5 bg-button-pri-fill text-white rounded-md">1</button>
            <button className="text-sm px-3 py-1.5 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors duration-200">2</button>
            <button className="text-sm px-3 py-1.5 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors duration-200">3</button>
          </div>
          <button className="text-sm px-3 py-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200">
            Tiếp →
          </button>
        </div>
      </div>
    </div>
  );
};