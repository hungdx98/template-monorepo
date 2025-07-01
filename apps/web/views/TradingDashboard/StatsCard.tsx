import React from 'react';

interface StatsCardProps {
  title: string;
  children: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
};
