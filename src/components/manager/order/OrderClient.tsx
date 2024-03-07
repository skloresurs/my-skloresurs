'use client';

import { Skeleton, Tabs } from '@mantine/core';
import { Boxes, Info } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import { FullOrder } from '@/types/manager/Order';

import MainTabOrder from './tabs/MainTabOrder';
import SpecificationTabOrder from './tabs/SpecificationTabOrder';

export default function OrderClient({ id }: { id: string }) {
  const { data, error, isValidating } = useSWR<FullOrder>(`/api/manager/orders/${id}`);
  if (isValidating) {
    return <Skeleton height={150} width='100%' />;
  }

  if (error || !data) {
    redirect('/manager');
  }

  return (
    <Tabs defaultValue='main'>
      <Tabs.List>
        <Tabs.Tab value='main' leftSection={<Info />}>
          Інформація
        </Tabs.Tab>
        <Tabs.Tab value='specifications' leftSection={<Boxes />}>
          Специфікації
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='main'>
        <MainTabOrder order={data} />
      </Tabs.Panel>

      <Tabs.Panel value='specifications'>
        <SpecificationTabOrder order={data} />
      </Tabs.Panel>
    </Tabs>
  );
}
