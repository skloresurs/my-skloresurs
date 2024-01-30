'use client';

import { Container, Stack, Text } from '@mantine/core';
import { reduce, sortBy } from 'lodash';
import { Sigma } from 'lucide-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import React, { memo, useMemo, useState } from 'react';
import { useWindowSize } from 'react-use';
import useSWR from 'swr';

import IManaderOrder, { IGoods } from '@/types/ManagerOrder';

interface IProps {
  order: IManaderOrder;
}

function SpecificationTabOrder({ order }: IProps) {
  const { data: goods, isValidating } = useSWR<IGoods[]>(`/api/manager/order/${order.id}`);
  const { height } = useWindowSize();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IGoods>>({
    columnAccessor: 'position',
    direction: 'asc',
  });

  const records = useMemo(
    () =>
      sortStatus.direction === 'desc'
        ? sortBy(goods, sortStatus.columnAccessor).toReversed()
        : sortBy(goods, sortStatus.columnAccessor),
    [goods, sortStatus]
  );

  const groups = useMemo(
    () => [
      {
        columns: [
          {
            accessor: 'position',
            footer: (
              <div className='flex items-center'>
                <Sigma size={20} />
              </div>
            ),
            footerClassName: 'bg-dark-6',
            sortable: true,
            title: '#',
          },
        ],
        id: 'base',
        title: '',
      },
      {
        columns: [
          {
            accessor: 'amount',
            footer: <span>{Math.round(reduce(goods, (a, b) => a + b.amount, 0) * 1000) / 1000}</span>,
            footerClassName: 'bg-dark-6',
            sortable: true,
            title: 'S m²',
          },
          {
            accessor: 'pieces',
            footer: <span>{Math.round(reduce(goods, (a, b) => a + b.pieces, 0) * 1000) / 1000}</span>,
            footerClassName: 'bg-dark-6',
            sortable: true,
            title: 'Шт.',
          },
        ],
        id: 'count',
        title: 'Замовлення',
      },
      {
        columns: [
          {
            accessor: 'in',
            footer: <span>{Math.round(reduce(goods, (a, b) => a + b.in, 0) * 1000) / 1000}</span>,
            footerClassName: 'bg-dark-6',
            render: (record: IGoods) => <span>{record.in === 0 ? '' : record.in}</span>,
            sortable: true,
            title: 'Шт.',
          },
        ],
        id: 'movements',
        title: 'Склад',
      },
      {
        columns: [
          {
            accessor: 'out',
            footer: <span>{Math.round(reduce(goods, (a, b) => a + b.out, 0) * 1000) / 1000}</span>,
            footerClassName: 'bg-dark-6',
            render: (record: IGoods) => <span>{record.out === 0 ? '' : record.out}</span>,
            sortable: true,
            title: 'Шт.',
          },
        ],
        id: 'client',
        title: 'Клієнт',
      },
    ],
    [goods]
  );

  return (
    <Container mt='sm' fluid p='0' h={height - 200}>
      <DataTable
        withTableBorder
        withColumnBorders
        highlightOnHover
        groups={groups}
        records={records}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        minHeight='100%'
        fetching={isValidating}
        noRecordsText='Немає даних'
        idAccessor='position'
        rowExpansion={{
          content: ({ record }) => (
            <Stack w='100%' p='md' gap='md'>
              <Stack gap='0'>
                <Text span fw={600}>
                  Номенклатура:
                </Text>
                {record.name}
              </Stack>
              <Stack gap='0'>
                <Text span fw={600}>
                  Розміри:
                </Text>
                {`${record.width} x ${record.height} m²`}
              </Stack>
            </Stack>
          ),
        }}
      />
    </Container>
  );
}

export default memo(SpecificationTabOrder);
