'use client';

import { Grid, Title } from '@mantine/core';
import { map } from 'lodash';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import useSWR from 'swr';

import IManaderOrder from '@/types/ManagerOrder';

import LoadingOverlay from '../LoadingOverlay';
import MoreItem from './MoreItem';
import OrderItem from './OrderItem';

export default function OrdersList() {
  const query = useSearchParams();
  const { data, error, isValidating, mutate } = useSWR<IManaderOrder[]>(`/api/manager/order/?${query.toString()}`);

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
    <Grid>
      {map(data, (order: IManaderOrder) => (
        <Grid.Col span={{ base: 12, lg: 3, md: 6 }} key={order.id}>
          <OrderItem order={order} />
        </Grid.Col>
      ))}
      {data.length >= 250 && <MoreItem />}
    </Grid>
  );
}
