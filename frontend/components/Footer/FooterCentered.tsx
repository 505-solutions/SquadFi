'use client';

import { Anchor, Group, ActionIcon, rem, Image, Alert } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import classes from './FooterCentered.module.css';
import NextImage from 'next/image';
import obolLogo from "../../public/obolLogo.png";


const links = [
  { link: '#', label: 'Built with ❤️ by 505 Solutions' },
];

export function FooterCentered() {

  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      key={link.label}
      href={link.link}
      lh={1}
    //   onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Group style={{flexDirection: 'column'}}>

          <p style={{margin: 0}}>Powered by:</p>
          <Image
            radius="md"
            component={NextImage}
            alt='Cats'
            src={obolLogo}
            style={{width: '200px', borderRadius: '50px', height: 'auto'}}
          />
        </Group>

        <Group className={classes.links}>{items}</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
