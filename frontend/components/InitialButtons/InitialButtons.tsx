'use client';

import { Group, Button, Text, Anchor } from '@mantine/core';
import Link from 'next/link';

export function InitialButtons() {
    return (
        <>
        <Group style={{ marginTop: '30px', justifyContent: 'center', columnGap: '100px' }}>
            <Link
              style={{ textDecoration: 'none', color: 'white' }}
              href="/createCluster"
            >
                <Button
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'violet', deg: 90 }}
                  size="xl"
                >
                  Create cluster
                </Button>
            </Link>

            <Link
              style={{ textDecoration: 'none', color: 'white' }}
              href="/exploreClusters"
            >
                <Button
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'violet', deg: 90 }}
                  size="xl"
                >
                  Explore clusters
                </Button>
            </Link>
        </Group>
        <Group style={{justifyContent: 'center', marginTop: '30px'}}>
          <Link
            style={{ textDecoration: 'none', color: 'white' }}
            href="/manageAssets"
          >
            <Button
              variant="gradient"
              gradient={{ from: 'gold', to: 'orange', deg: 90 }}
              size="xl"
            >
              Manage Assets
            </Button>
          </Link>
        </Group>

        <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt={30}>
        The core part of our achitecture is obol. The Obol Network is an ecosystem for trust minimized staking that enables people to create, test, run & co-ordinate distributed validators.
        <Anchor style={{display: 'block'}} href="https://obol.tech/" size="lg">
           Learn more about Obol.
        </Anchor>
      </Text>
      </>
    );
}
