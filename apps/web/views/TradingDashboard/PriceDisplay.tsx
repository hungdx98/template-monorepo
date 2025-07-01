import React from 'react';

interface PriceDisplayProps {
  price: string;
  change: string;
  isPositive: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  price, 
  change, 
  isPositive 
}) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="text-center">
        <div className="text-3xl font-bold mb-2">{price}</div>
        <div className={`text-sm font-medium ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? '+' : ''}{change}
        </div>
      </div>
    </div>
  );
};
