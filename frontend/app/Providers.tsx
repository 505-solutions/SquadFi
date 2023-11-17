'use client';

import { MetaMaskProvider } from '@metamask/sdk-react';
import { MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';
import { GlobalPropsProvider } from '@/contexts/globalContext';

export function Providers({ children }:{ children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark">
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        checkInstallationImmediately: false,
        dappMetadata: {
            name: 'SquadFi - DVT made easy',
        } }}
    >
    <GlobalPropsProvider>
        {children}
    </GlobalPropsProvider>
    </MetaMaskProvider>
    </MantineProvider>
  );
}
