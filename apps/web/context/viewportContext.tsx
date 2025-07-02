'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { viewport } from '@/config/viewport';
import { useGlobalStore } from '@/stores/useGlobalStore';

interface ViewportContextProps {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  mounted?: boolean;
}

const ViewportContext = createContext({} as ViewportContextProps);

export const ViewportProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setIsGlobalMounted } = useGlobalStore();

  const [width, setWidth] = useState<number>(0);

  const isMobile = width <= viewport.sm;
  const isTablet = width <= viewport.md || width <= viewport.lg;
  const isDesktop = width > viewport.lg;

  const handleWindowResize = () => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
    }
  };

  useEffect(() => {
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    setIsGlobalMounted(true);

    return () => window.removeEventListener('resize', handleWindowResize);
  }, [setIsGlobalMounted]);

  return (
    <ViewportContext.Provider value={{ width, isMobile, isTablet, isDesktop }}>
      {children}
    </ViewportContext.Provider>
  );
};

export const useViewport = () => {
  const value = useContext(ViewportContext);
  return value;
};
