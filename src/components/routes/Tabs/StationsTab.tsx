'use client';

import { Container, NumberFormatter, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { reduce } from 'lodash';
import { DataTable } from 'mantine-datatable';
import React, { memo, useMemo } from 'react';
import { useWindowSize } from 'react-use';
import useSWR from 'swr';

import IRoute, { IStation } from '@/types/Route';

interface IProps {
  route: IRoute;
}

function StationsTab({ route }: IProps) {
  const { height } = useWindowSize();
  const { data, isValidating } = useSWR<IStation[]>(`/api/routes/${route.id}/stations`);
  const columns = useMemo(
    () => [
      {
        accessor: 'id',
        title: '#',
        footer: 'Σ',
      },
      {
        accessor: 'orderId',
        title: 'ID замовлення',
      },
      {
        accessor: 'order',
        title: 'Порядок',
      },
      {
        accessor: 'time',
        title: 'Час',
        render: (record: IStation) => dayjs(record.time).format('HH:mm'),
      },
      {
        accessor: 'pieces',
        title: 'Шт.',
        footer: reduce(data, (acc, record) => acc + record.pieces, 0),
      },
      {
        accessor: 'amount',
        title: 'К-ть (m²)',
        render: (record: IStation) => <NumberFormatter value={record.amount} decimalScale={2} fixedDecimalScale />,
        footer: (
          <NumberFormatter
            value={reduce(data, (acc, record) => acc + record.amount, 0)}
            decimalScale={2}
            fixedDecimalScale
          />
        ),
      },
      {
        accessor: 'weight',
        title: 'Вага',
        render: (record: IStation) => <NumberFormatter value={record.weight} decimalScale={3} fixedDecimalScale />,
        footer: (
          <NumberFormatter
            value={reduce(data, (acc, record) => acc + record.weight, 0)}
            decimalScale={3}
            fixedDecimalScale
          />
        ),
      },
    ],
    [data]
  );

  return (
    <Container mt='sm' fluid p='0' h={height - 250}>
      <DataTable
        withTableBorder
        borderRadius='md'
        withColumnBorders
        columns={columns}
        records={data ?? []}
        minHeight='100%'
        noRecordsText='Не знайдено жодного шляху'
        fetching={isValidating}
        rowExpansion={{
          content: ({ record }) => (
            <Stack w='100%' p='md' gap='md'>
              <Stack gap='0'>
                <Text fw={600} span>
                  Адреса доставки:
                </Text>
                {record.address}
              </Stack>
              <Stack gap='0'>
                <Text fw={600}>Контрагент:</Text>
                {record.agent}
              </Stack>
              <Stack gap='0'>
                <Text fw={600}>Менеджер:</Text>
                {record.manager}
              </Stack>
              {record.comments.main && (
                <Stack gap='0'>
                  <Text fw={600}>Коментар:</Text>
                  {record.comments.main}
                </Stack>
              )}
              {record.comments.logist && (
                <Stack gap='0'>
                  <Text fw={600}>Коментар логіста:</Text>
                  {record.comments.logist}
                </Stack>
              )}
              {record.comments.delivery && (
                <Stack gap='0'>
                  <Text fw={600}>Коментар по доставці:</Text>
                  {record.comments.delivery}
                </Stack>
              )}
              {record.comments.packer && (
                <Stack gap='0'>
                  <Text fw={600}>Коментар для пакувальника:</Text>
                  {record.comments.packer}
                </Stack>
              )}
            </Stack>
          ),
        }}
      />
    </Container>
  );
}

export default memo(StationsTab);
