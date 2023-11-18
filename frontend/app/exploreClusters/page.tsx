'use client';

import { FooterCentered } from '@/components/Footer/FooterCentered';
import { HeaderMegaMenu } from '@/components/Header/HeaderMegaMenu';
import { Badge, Button, Code, Group, Input, Modal } from '@mantine/core';
import { IconSearch, IconUserBolt } from '@tabler/icons-react';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';


export interface Validator {
  id: number;
  name: string;
  addr: string;
  status: string;
}

interface Cluster {
  name: string;
  validators: Validator[];
}


const initialClusters: Cluster[] = [
  {
    name: '505 Cluster',
    validators: [
      { id: 1, name: 'Jure', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "ready" },
      { id: 2, name: 'Luka', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "ready" },
      { id: 3, name: 'Gal', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "ready" },
      { id: 4, name: 'Jensei', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "ready" },
    ],
  },
  {
    name: 'Crypto Celestials',
    validators: [
      { id: 1, name: 'Oracle', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
      { id: 2, name: 'Sentinel', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
      { id: 3, name: 'Optimus', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
      { id: 4, name: 'Validator', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
    ],
  },
  {
    name: 'Neptune Network',
    validators: [
      { id: 1, name: 'Pioneers', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
      { id: 2, name: 'Trailblazers', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
      { id: 3, name: 'Navigators', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
      { id: 4, name: 'Observers', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
    ],
  },
  {
    name: 'Starship Validators',
    validators: [
      { id: 1, name: 'Sentinel', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
      { id: 2, name: 'Voyager', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
      { id: 3, name: 'Guardian', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
      { id: 4, name: 'Explorer', addr: '0xFA8166634569537ea716b7350383Ab262335994E', status: "waiting" },
    ],
  },
];

export default function ExploreClusters() {
  const [searchValue, setSearchValue] = useState('');
  const [clusters, setClusters] = useState<Cluster[]>(initialClusters);
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [opened, { open, close }] = useDisclosure(false);
  
  return (
    <>
      <HeaderMegaMenu />

      <Group style={{flexDirection: 'column'}}>
        <h1 style={{display: 'block', margin: 'auto'}}>Explore clusters</h1>
      
        <Group style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            placeholder="Enter cluster name"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            size='lg'
            rightSection={<IconSearch />}
          />
        </Group>

        <Group style={{justifyContent: 'left', flexDirection: 'column'}}>
          {clusters.filter((cluster) => cluster.name.toLowerCase().startsWith(searchValue.toLowerCase())).map((cluster, i) => (
            <Group key={cluster.name} style={{justifyContent: 'space-between', width: '100%'}}>
              <h3 style={{textAlign: 'left'}}>{cluster.name}</h3>
              <p>Num validators: {cluster.validators.length}</p>
              <Button onClick={() => {
                setSelectedId(i);
                open();
              }}>View cluster</Button>
            </Group>
          ))}
        </Group>
      </Group>

      { selectedId != -1 &&
        <Modal opened={opened} onClose={close} title="View cluster" centered size="xl">
            <Group style={{alignItems: 'center'}}>
              <h2>{clusters[selectedId].name}</h2>
              <p>(Num validators: {clusters[selectedId].validators.length})</p>
            </Group>
            { clusters[selectedId].validators.map((validator) => (
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
              { validator.status == "ready" ?
                <Badge color="green">Ready</Badge>
                :
                <Badge color="yellow">Wait</Badge>
              }
            </Group>
            ))}
            <Group>
              <p>
                If you are one of the cluster members, run this command on your node to enable muli-party key generation.
                Once the generation is completed, your cluster will be ready to start validating.
              </p>
              <Code block>
                curl -o https://raw.githubusercontent.com/squadfi/create/main/keygen.sh <br />
                bash keygen.sh --clusterName "{clusters[selectedId].name}"
              </Code>
              <Link
                href="http://74.234.16.180:3000/d/laEp8vupp/local-docker-cluster-dashboard?orgId=1&refresh=10s"
                target="_blank"
              >
                <Button>View cluster dashboard</Button>
              </Link>
            </Group>
        </Modal>
      }

      <FooterCentered />
    </>
  );
}
