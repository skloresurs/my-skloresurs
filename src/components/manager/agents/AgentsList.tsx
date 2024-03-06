'use client';

import { Center, Grid, StyleProp } from '@mantine/core';
import { map } from 'lodash';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import ErrorAlert from '@/components/ui/ErrorAlert';
import GridSkeleton from '@/components/ui/GridSkeleton';
import InfoAlert from '@/components/ui/InfoAlert';
import Pagination from '@/components/ui/Pagination';
import Agent from '@/types/manager/Agent';

import AgentItem from './AgentItem';

const span: StyleProp<number> = {
  base: 12,
  md: 6,
  lg: 4,
  xl: 3,
  '2xl': 2,
};

interface IResponse {
  total: number;
  data: Agent[];
}

export default function AgentsList() {
  const query = useSearchParams();
  const { data, error, isValidating, mutate } = useSWR<IResponse>(`/api/manager/agents/?${query.toString()}`);
  if (isValidating) {
    return (
      <GridSkeleton span={span} times={12}>
        <div className='h-[125px]' />
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
          description='Не вдалось завантажити список контрагентів'
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
          title='Немає контрагентів'
          description='Не знадено жодного контрагента за вказаними параметрами'
        />
      </Center>
    );
  }

  return (
    <Grid>
      {map(data.data, (agent) => (
        <Grid.Col span={span} key={agent.id}>
          <AgentItem agent={agent} />
        </Grid.Col>
      ))}
      <Center w='100%'>
        <Pagination total={Math.ceil(data.total / 48)} query={query} />
      </Center>
    </Grid>
  );
}
