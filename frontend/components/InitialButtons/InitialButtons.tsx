'use client';

import { Group, Button } from '@mantine/core';
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
              href="/joinCluster"
            >
                <Button
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'violet', deg: 90 }}
                  size="xl"
                >
                  Join cluster
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
      </>
    );
}
