'use client';

import { Welcome } from '../components/Welcome/Welcome';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';
import { FooterCentered } from '@/components/Footer/FooterCentered';
import { InitialButtons } from '@/components/InitialButtons/InitialButtons';
import { BackgroundImage, Group, Image, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export default function HomePage() {
  const icon = <IconInfoCircle />;

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
        <Alert style={{maxWidth: 422, position: 'sticky', left: 30, bottom:30}} variant="light" color="#ffffff" withCloseButton title="We know you are hungry!" icon={icon}>
          ...but this is not a time for a sandwich. Protect yourself from frontrunning attacks when setting up your squad. Install <span style={{color: '#F35034'}}>MEV Blocker</span> today, thank us later.
        </Alert>
        <FooterCentered />
      </Group>
    </>
    
  );
}
