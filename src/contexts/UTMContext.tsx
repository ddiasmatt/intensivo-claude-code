import React, { createContext, useContext, ReactNode } from 'react';
import { useUTMParams } from '@/hooks/useUTMParams';

interface UTMContextValue {
  buildCTAUrl: (baseUrl: string) => string;
}

const UTMContext = createContext<UTMContextValue | undefined>(undefined);

interface UTMProviderProps {
  children: ReactNode;
}

export const UTMProvider = ({ children }: UTMProviderProps) => {
  const { buildCTAUrl } = useUTMParams();

  return (
    <UTMContext.Provider value={{ buildCTAUrl }}>
      {children}
    </UTMContext.Provider>
  );
};

export const useUTMContext = (): UTMContextValue => {
  const context = useContext(UTMContext);
  if (!context) {
    throw new Error('useUTMContext must be used within a UTMProvider');
  }
  return context;
};
