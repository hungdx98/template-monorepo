import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  change?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  subValue, 
  change 
}) => {
  const isPositive = change?.startsWith('+');

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="text-lg font-semibold mb-1">{value}</div>
      {subValue && (
        <div className="text-sm text-gray-400 mb-1">{subValue}</div>
      )}
      {change && (
        <div className={`text-xs font-medium ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {change}
        </div>
      )}
    </div>
  );
};
