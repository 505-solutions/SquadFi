'use client';

import { FooterCentered } from '@/components/Footer/FooterCentered';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';
import { Button, Group, Input } from '@mantine/core';
import { useState } from 'react';

export default function ExploreClusters() {
  const [searchValue, setSearchValue] = useState('');
  
  return (
    <>
      <HeaderMegaMenu />

      <Group style={{flexDirection: 'column'}}>
        <h1 style={{display: 'block', margin: 'auto'}}>Join a cluster</h1>
      
        <Group style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            placeholder="Enter cluster name"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            size='lg'
          />
        </Group>

      </Group>

      <FooterCentered />
    </>
  );
}
