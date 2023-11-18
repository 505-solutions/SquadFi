'use client';

import { MetaMaskProvider } from '@metamask/sdk-react';
import { MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';
import { GlobalPropsProvider } from '@/contexts/globalContext';
import { Web3ModalProvider } from "./context/Web3Modal";
import { Notifications } from '@mantine/notifications';

export const metadata = {
  title: "Web3Modal",
  description: "Web3Modal Example",
};


export function Providers({ children }:{ children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Notifications/>
      <Web3ModalProvider>
        <GlobalPropsProvider>
          {children}
        </GlobalPropsProvider>
      </Web3ModalProvider>
    </MantineProvider>
  );
}
