import { Grid, Skeleton, StyleProp } from '@mantine/core';
import { times } from 'lodash';
import React from 'react';

interface IProps {
  span: StyleProp<number>;
  children: React.ReactNode;
  times: number;
}

export default function GridSkeleton({ span, children, times: timesNumber }: IProps) {
  return (
    <Grid>
      {times(timesNumber, (i) => (
        <Grid.Col span={span} key={i}>
          <Skeleton>{children}</Skeleton>
        </Grid.Col>
      ))}
    </Grid>
  );
}
