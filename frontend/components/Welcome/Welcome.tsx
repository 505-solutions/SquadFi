'use client';

import { Title, Text, Anchor, Image } from '@mantine/core';
import classes from './Welcome.module.css';
import landingTop from '../../public/landingTop.png'
import NextImage from 'next/image';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={50}>
        Every pawprint {' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: '#EEAD36', to: '#E97333' }}>
          echoes
        </Text>
      </Title>
      <Title style={{
        color: '#FCE0A9',
        textAlign: 'center',
        fontSize: '23px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 'normal',
        width: '80%',
        margin: 'auto',
        marginBottom: '30px',
      }}>
        <b>SquadFi</b> let’s you easily bootstrap censorship-resistant, permissionless, and trustless multi-paw validator squads. Block MEV, preserve decentralization, and resiliency of the Ethereum network.      </Title>
      <Image
        radius="md"
        component={NextImage}
        alt='Cats'
        src={landingTop}
        style={{width: '40%', margin: 'auto', height: 'auto'}}
      />
    </>
  );
}
