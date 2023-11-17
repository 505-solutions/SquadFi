'use client';

import { createContext, useState, ReactNode } from 'react';

interface GlobalProps {
  address: string | null;
  setAddress: (address:string) => void;
}

export const globalPropsContext = createContext<GlobalProps>({
  address: null,
  setAddress: (address:string) => { address; },
});

export function GlobalPropsProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  return (
    <globalPropsContext.Provider
      value={{
        address,
        setAddress,
      }}
    >
      {children}
    </globalPropsContext.Provider>
  );
}
