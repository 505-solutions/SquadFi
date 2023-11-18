'use client';

import { FooterCentered } from '@/components/Footer/FooterCentered';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';
import { Group, TextInput, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAddressBook, IconCheck, IconCircleCheck, IconUser } from '@tabler/icons-react';
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
        <h1 style={{display: 'block', margin: 'auto'}}>Create a cluster</h1>

        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>SQUAD NAME</p>
        <TextInput
          placeholder="Cluster name"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          size='xl'
          variant='unstyled'
          style={{
            border: '1px solid #E2D04B',
            width: '100%'
          }}
        />

        <h2>Validators:</h2>
        
        <Group style={{flexDirection: 'column', width: '100%'}}>
          {[1, 2, 3, 4].map((i) => (
            <Group style={{width: '100%', margin: 0, padding: 0}}>
              <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>{`Validator ${i}/4`}</p>
              <TextInput
                placeholder="ETH address or ENS name"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                leftSection={<IconUser size={16} />}
                size='xl'
                variant='unstyled'
                style={{
                  border: '1px solid #E2D04B',
                  width: '100%',
                  height: '60px'
                }}
              />
            </Group>
          ))}
        </Group>

        <p>Treshold: 3/4</p>
        
        <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 0}}>SAFE ADDRESS</p>
        <TextInput
          placeholder="SAFE address"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconAddressBook size={16} />}
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
          leftSection={<IconCheck />}
          onClick={open}
        >
          Create cluster
        </Button>
      </Group>
      
      <Modal opened={opened} onClose={close} title="Success" centered size="lg">
        <IconCircleCheck size={64} color="green" style={{display: "block", margin: "auto"}}/>
        <h2 style={{textAlign: 'center'}}>You have successfully created a cluster</h2>
        <p style={{textAlign: 'center'}}>Find your cluster and invite other validators to join</p>
        <Link href="exploreClusters" style={{textDecoration: 'none', color: 'white'}}>
          <Button color='#EEAD36' style={{display: 'block', margin: 'auto'}}>Explore clusters</Button>
        </Link>
      </Modal>
      
      <FooterCentered />
      </Group>
    </>
  );
}
