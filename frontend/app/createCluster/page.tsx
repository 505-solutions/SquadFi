'use client';

import { FooterCentered } from '@/components/Footer/FooterCentered';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';
import { Group, TextInput, Button, Modal, Code } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck, IconChecks, IconCircleCheck, IconTicket } from '@tabler/icons-react';
import { Icon2fa, IconAddressBook, IconAt, IconBlockquote, IconPlus, IconSquareCheckFilled, IconUser, IconUserBolt, IconUserSquare, IconUsersGroup } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

interface Validator {
  id: number;
  name: string;
  addr: string;
}

export default function CreateCluster() {
  const [name, setName] = useState<string>('');
  const [vName, setVName] = useState<string>('');
  const [vAddr, setVAddr] = useState<string>('');
  const [validators, setValidators] = useState<Validator[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

  function addValidator() {
    setValidators([...validators, {id: validators.length, name: vName!, addr: vAddr!}]);
    setVName('');
    setVAddr(''); 
  }

  return (
    <>
      <HeaderMegaMenu />
      
      <Group style={{flexDirection: 'column'}}>
        <h1 style={{display: 'block', margin: 'auto'}}>Create a cluster</h1>

        <TextInput
          placeholder="Cluster name"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          leftSection={<IconUsersGroup size={16} />}
          onChange={(event) => setName(event.currentTarget.value)}
          size='xl'
        />

        <h2>Validators:</h2>
        
        <Group style={{flexDirection: 'column'}}>
          {validators.map((validator) => (
            <Group key={validator.id}>
              <IconUserBolt />
              <p>
                Validator{validator.id}
              </p>
              <p>
                <strong>{validator.name}</strong>
              </p>
              <p>
                <i>{validator.addr}</i>
              </p>
            </Group>
          ))}
        </Group>
        
        <Group>
          <TextInput
            placeholder="Validator name"
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            leftSection={<IconUserSquare size={16} />}
            value={vName}
            onChange={(event) => setVName(event.currentTarget.value)}
          />

          <TextInput
            placeholder="Validator addr"
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            leftSection={<IconBlockquote size={16} />} 
            value={vAddr}
            onChange={(event) => setVAddr(event.currentTarget.value)}
          />
          <Button onClick={addValidator} leftSection={<IconPlus />}>Add validator</Button>
        </Group>
        <p>Treshold: {Math.ceil(validators.length * 2 / 3)}/{validators.length}</p>
      
        <Button
          style={{marginTop: '20px'}}
          variant="gradient"
          gradient={{ from: 'blue', to: 'violet', deg: 90 }}
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
        <p>Copy and paste the following command in your node:</p>
        <Code block>
          curl -o https://raw.githubusercontent.com/squadfi/create/main/create.sh <br />
          bash create.sh
        </Code>
        <p>Afterwards invite validators to join your cluster</p>
        <Link href="exploreClusters" style={{textDecoration: 'none', color: 'white'}}>
          <Button style={{display: 'block', margin: 'auto'}}>Explore clusters</Button>
        </Link>
      </Modal>

      <FooterCentered />
    </>
  );
}
