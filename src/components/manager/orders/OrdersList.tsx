'use client';

import { Center, Grid, StyleProp } from '@mantine/core';
import { map } from 'lodash';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import DefaultManagerOrder from '@/data/default-manager-order';
import IManaderOrder from '@/types/ManagerOrder';

import ErrorAlert from '../../ui/ErrorAlert';
import GridSkeleton from '../../ui/GridSkeleton';
import InfoAlert from '../../ui/InfoAlert';
import Pagination from '../../ui/Pagination';
import OrderItem from './OrderItem';

const span: StyleProp<number> = {
  base: 12,
  md: 6,
  lg: 4,
  xl: 3,
  '2xl': 2,
};

interface IResponse {
  data: IManaderOrder[];
  total: number;
}

export default function OrdersList() {
  const query = useSearchParams();
  const { data, error, isValidating, mutate } = useSWR<IResponse>(`/api/manager/order/?${query.toString()}`);

  if (isValidating) {
    return (
      <GridSkeleton span={span} times={12}>
        <OrderItem order={DefaultManagerOrder} />
      </GridSkeleton>
    );
  }

  if (error) {
    return (
      <Center>
        <ErrorAlert
          maw={576}
          w={576}
          title='Помилка'
          description='Не вдалось завантажити список замовлень'
          refresh={mutate}
        />
      </Center>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Center>
        <InfoAlert
          maw={576}
          w={576}
          title='Немає замовлень'
          description='Не знадено жодного замовлення за вказаними параметрами'
        />
      </Center>
    );
  }

  return (
    <>
      <Grid>
        {map(data.data, (order) => (
          <Grid.Col span={span} key={order.id}>
            <OrderItem order={order} />
          </Grid.Col>
        ))}
      </Grid>
      <Pagination baseRoute='/manager' total={Math.ceil(data.total / 50)} query={query} />
    </>
  );
}