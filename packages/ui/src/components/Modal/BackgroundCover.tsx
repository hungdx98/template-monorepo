import React from 'react';
import { cx } from '@repo/tailwind-config';

export const BackgroundCover = ({ className }: { className?: string }) => {
  return (
    <div className={cx('inset-0 bg-black/70 w-full h-full', className)} />
  );
};
