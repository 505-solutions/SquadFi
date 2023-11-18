'use client';

import { Welcome } from '../components/Welcome/Welcome';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';
import { FooterCentered } from '@/components/Footer/FooterCentered';
import { InitialButtons } from '@/components/InitialButtons/InitialButtons';
import { BackgroundImage, Group, Image } from '@mantine/core';

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
        }}
      >
        <HeaderMegaMenu />
        <Welcome />
        <InitialButtons />
        <FooterCentered />
      </Group>
    </>
    
  );
}
