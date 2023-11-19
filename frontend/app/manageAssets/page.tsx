'use client';

import { FooterCentered } from '@/components/Footer/FooterCentered';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';
import { Positions } from '@/components/Positions/Positions';
import { Group } from '@mantine/core';

export default function HomePage() {
  return (
    <>
      <Group
        style={{
          backgroundImage: `url(/background.png)`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          padding: '0',
          margin: '0',
          display: 'block',
          minHeight: '100%',
          alignContent: 'space-between',
          flexDirection: 'column',
        }}
      >
      <HeaderMegaMenu />
      <h1 style={{margin: 'auto', textAlign: 'center'}}>Delegate</h1>
      <h1 style={{margin: 'auto', textAlign: 'center'}}>Manage your positions</h1>
      <Positions />
      <FooterCentered />
      </Group>
    </>
  );
}
