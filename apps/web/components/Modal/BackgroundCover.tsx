import React from 'react';
import { twMerge } from 'tailwind-merge';

export const BackgroundCover = ({ className }: { className?: string }) => {
  return (
    <div className={twMerge('inset-0 bg-black/70 w-full h-full', className)} />
  );
};
