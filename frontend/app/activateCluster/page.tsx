'use client';

import { FooterCentered } from '@/components/Footer/FooterCentered';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';
import { Group, TextInput, Button, Modal, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAddressBook, IconCheck, IconCircleCheck, IconUser, IconArrowBigRightLineFilled } from '@tabler/icons-react';
import { IconBlockquote, IconPlus, IconUserBolt, IconUserSquare, IconUsersGroup } from '@tabler/icons-react';
import Link from 'next/link';


export default function CreateCluster() {
  const [opened, { open, close }] = useDisclosure(false);

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

      <Group style={{flexDirection: 'column', width: '500px', margin: 'auto'}}>
        <h1 style={{display: 'block', margin: 'auto'}}>Activate a cluster</h1>

        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>VALIDATOR ID</p>
        <TextInput
          placeholder="Validator ID in Smart Contract"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          size='xl'
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />
        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>VALIDATOR PUB KEY</p>
        <TextInput
          placeholder="Assigned Validator Public Key"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          size='xl'
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />
        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>WITHDRAW CREDENTIALS</p>
        <TextInput
          placeholder="Generated Withdraw Credentials"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          size='xl'
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />
        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>BLS SIGNATURE</p>
        <TextInput
          placeholder="Generated BLS Signature"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          size='xl'
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />
        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>DEPOSIT DATA ROUTE</p>
        <TextInput
          placeholder="ETH Staking Contract"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          size='xl'
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />

      <Divider size="md" />
        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>SAFE (multisig) Wallet Address</p>
        <TextInput
          placeholder="Squad's SAFE Wallet Address"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          size='xl'
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />
        <Button
          style={{marginTop: '20px', backgroundColor: "#EEAD36"}}
          variant="gradient"
          gradient={{ from: '#EEAD36', to: '#E97333', deg: 90 }}
          size="xl"
          rightSection={<IconArrowBigRightLineFilled />}
          onClick={open}
        >
          Send multisig TX to SAFE
        </Button>
      </Group>
      
      <Modal opened={opened} onClose={close} title="Success" centered size="lg">
        <IconCircleCheck size={64} color="green" style={{display: "block", margin: "auto"}}/>
        <h2 style={{textAlign: 'center'}}>Your transaction proposal has been sent to SAFE Wallet.</h2>
        <p style={{textAlign: 'center'}}>Sign the proposal to activate your cluster/validator.</p>
        <Link href="exploreClusters" style={{textDecoration: 'none', color: 'white'}}>
          <Button color='#EEAD36' style={{display: 'block', margin: 'auto'}}>Sign in SAFE Wallet</Button>
        </Link>
      </Modal>
      
      <FooterCentered />
      </Group>
    </>
  );
}
