'use client';

import { MetaMaskProvider } from '@metamask/sdk-react';
import { MantineProvider, createTheme } from '@mantine/core';
import { ReactNode } from 'react';
import { GlobalPropsProvider } from '@/contexts/globalContext';
import { Web3ModalProvider } from "./context/Web3Modal";

export const metadata = {
  title: "Web3Modal",
  description: "Web3Modal Example",
};


export function Providers({ children }:{ children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Web3ModalProvider>
        <GlobalPropsProvider>
          {children}
        </GlobalPropsProvider>
      </Web3ModalProvider>
    </MantineProvider>
  );
}
