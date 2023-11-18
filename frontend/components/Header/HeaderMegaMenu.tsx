'use client';

import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
  Image
} from '@mantine/core';
import { IconPhoto, IconDownload, IconMessageShare } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
} from '@tabler/icons-react';
import { useContext, useState } from 'react';
import { useWeb3Modal } from '@web3modal/ethers5/react'
import classes from './HeaderMegaMenu.module.css';
import { globalPropsContext } from '@/contexts/globalContext';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { useDisclosure } from '@mantine/hooks';
import MessagingDrawer from '../MessagingDrawer';
import NextImage from 'next/image';
import logo from "../../public/logo.png";
import Link from 'next/link';


export function HeaderMegaMenu() {
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [linksOpened, setLinksOpened] = useState(false);
    const theme = useMantineTheme();
    const { open, close } = useWeb3Modal()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const [messagesOpened, setMessagesOpened] = useState(false);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
        <Link
          href='/'
        >
          <Image
            radius="md"
            component={NextImage}
            alt='Cats'
            src={logo}
            style={{width: '70px', height: 'auto', marginTop: '25px', marginLeft: '10px'}}
          />
        </Link>

          {/* <Group h="100%" gap={0} visibleFrom="sm">
            <a href="#" className={classes.link}>
              Home
            </a>
            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Features
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Features</Text>
                  <Anchor href="#" fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider my="sm" />


                <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" c="dimmed">
                        Their food sources have decreased, and their numbers
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            <a href="#" className={classes.link}>
              Learn
            </a>
            <a href="#" className={classes.link}>
              Academy
            </a>
          </Group> */}

          <Group visibleFrom="sm">
            { address ?
              <>
              <Button variant='light' onClick={() => setMessagesOpened(true)} rightSection={<IconMessageShare size={14} />}>Open web3inbox</Button>
              <Button color="green" onClick={() => open()}/>
              <Button variant="gradient" gradient={{ from: '#EEAD36', to: '#E97333', deg: 90 }} onClick={() => open()}>
                {`${address.substring(0, 7)}...${address.substring(address.length - 5, address.length)}`}
              </Button>
              </>
              :
              <Button variant="gradient" gradient={{ from: '#EEAD36', to: '#E97333', deg: 90 }} onClick={() => open()}>
                Connect wallet
              </Button>
            }

          </Group>

          <Burger opened={drawerOpened} onClick={() => setDrawerOpened(true)} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={'auto'} mx="-md">
          <Divider my="sm" />

          <a href="#" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link} onClick={() => setLinksOpened(true)}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
              />
            </Center>
          </UnstyledButton>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>

          <Divider my="sm" />
        </ScrollArea>
      </Drawer>

    <Drawer
        opened={messagesOpened}
        onClose={() => setMessagesOpened(false)}
        padding="md"
        position='right'
        title={<><Text fw={900} size='xl'>Your Squad's messages</Text><small style={{color: '#999'}}>powered by web3inbox</small></>}
        zIndex={1000000}
      >
        <MessagingDrawer/>
    </Drawer>

    </Box>
  );
}
