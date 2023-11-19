import '@mantine/core/styles.css';
import React from 'react';
import { Providers } from './Providers';
import '@mantine/notifications/styles.css';

export const metadata = {
  title: 'SquadFi',
  description: 'Distributed validatior technology made easy',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
