'use client';

import { Drawer, Tabs, Title, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { map } from 'lodash';
import { useSearchParams } from 'next/navigation';
import React, { memo, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import IManaderOrder from '@/types/ManagerOrder';

import LoadingOverlay from '../LoadingOverlay';
import MoreItem from './MoreItem';
import OrderItem from './OrderItem';
import MainTabOrder from './tabs/MainTabOrder';
import SpecificationTabOrder from './tabs/SpecificationTabOrder';

const MemoOrderItem = memo(OrderItem);

export default function OrdersList() {
  const query = useSearchParams();
  const { data, error, isValidating, mutate } = useSWR<IManaderOrder[]>(`/api/manager/order/?${query.toString()}`);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  const selectedOrder: IManaderOrder | undefined = useMemo(
    () => data?.at(selectedOrderIndex),
    [data, selectedOrderIndex]
  );

  useEffect(() => {
    mutate();
  }, [mutate, query]);

  if (isValidating) {
    return (
      <div className='relative mt-3 h-[400px] w-full'>
        <LoadingOverlay />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col gap-6 text-center'>
        <Title order={2}>Помилка</Title>
        <Title order={3}>Сталася помилка при завантаженні замовлень</Title>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className='flex flex-col gap-6 text-center'>
        <Title order={2}>Не знайдено жодного замовлення</Title>
      </div>
    );
  }
  return (
    <>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {map(data, (order, index) => (
          <UnstyledButton
            key={order.id}
            className='group'
            onClick={() => {
              setSelectedOrderIndex(index);
              open();
            }}
          >
            <MemoOrderItem order={order} />
          </UnstyledButton>
        ))}
        {data.length >= 250 && <MoreItem />}
      </div>

      {selectedOrder && (
        <Drawer offset={8} radius='md' opened={opened} onClose={close} position='right' title='Замовлення' size='xl'>
          <Tabs variant='outline' defaultValue='main'>
            <Tabs.List>
              <Tabs.Tab value='main'>Інформація</Tabs.Tab>
              <Tabs.Tab value='specification'>Специфікація</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value='main'>
              <MainTabOrder order={selectedOrder} />
            </Tabs.Panel>
            <Tabs.Panel value='specification'>
              <SpecificationTabOrder order={selectedOrder} />
            </Tabs.Panel>
          </Tabs>
        </Drawer>
      )}
    </>
  );
}
