'use client';

import { Grid, StyleProp } from '@mantine/core';
import { map } from 'lodash';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import IManaderOrder from '@/types/ManagerOrder';

import ErrorOnPage from '../ErrorOnPage';
import Pagination from '../ui/Pagination';
import OrderItem from './OrderItem';
import SkeletonOrderItem from './SkeletonOrderItem';

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
  const { data, error, isValidating } = useSWR<IResponse>(`/api/manager/order/?${query.toString()}`);

  if (isValidating) {
    return (
      <Grid>
        <SkeletonOrderItem span={span} />
        <SkeletonOrderItem span={span} />
        <SkeletonOrderItem span={span} />
      </Grid>
    );
  }

  if (error) {
    return (
      <ErrorOnPage
        description='Не вдалось завантажити список замовлень'
        code={error.response?.status}
        detailedMessage={error?.message}
      />
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <ErrorOnPage title='Немає замовлень' description='Не знайдено жодного замовлення за вашим запитом' code={404} />
    );
  }
  return (
    <>
      <Pagination baseRoute='/manager' total={Math.floor(data.total / 50)} query={query} />
      <Grid grow>
        {map(data.data, (order) => (
          <Grid.Col span={span} key={order.id}>
            <OrderItem order={order} />
          </Grid.Col>
        ))}
      </Grid>
      <Pagination baseRoute='/manager' total={Math.floor(data.total / 50)} query={query} />
    </>
  );
}
