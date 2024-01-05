import { Grid, Skeleton, StyleProp } from '@mantine/core';
import React from 'react';

import DefaultManagerOrder from '@/data/default-manager-order';

import OrderItem from './OrderItem';

interface IProps {
  span: StyleProp<number>;
}

export default function SkeletonOrderItem({ span }: IProps) {
  return (
    <Grid.Col span={span}>
      <Skeleton>
        <OrderItem order={DefaultManagerOrder} />
      </Skeleton>
    </Grid.Col>
  );
}
