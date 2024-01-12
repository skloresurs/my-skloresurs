'use client';

import { Container, NumberFormatter, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { groupBy, reduce } from 'lodash';
import { DataTable } from 'mantine-datatable';
import React, { memo, useMemo } from 'react';
import useSWR from 'swr';

import IRoute, { IStation } from '@/types/Route';

interface IProps {
  route: IRoute;
}

function StationsTab({ route }: IProps) {
  const { data, isValidating } = useSWR<IStation[]>(`/api/routes/${route.id}/stations`);

  const ordersList = useMemo(
    () =>
      reduce(
        groupBy(data, 'order'),
        (acc, value) => {
          acc.push({
            order: value[0].order,
            time: value[0].time,
            address: value[0].address,
            addressShort: value[0].addressShort,
            value,
          });
          return acc;
        },
        [] as { order: number; time: string; address: string; addressShort: string; value: IStation[] }[]
      ),
    [data]
  );

  return (
    <Container mt='sm' fluid p='0'>
      <DataTable
        withTableBorder
        borderRadius='md'
        withColumnBorders
        records={ordersList}
        minHeight={ordersList.length === 0 ? '150px' : 'auto'}
        noRecordsText='Не знайдено жодного шляху'
        fetching={isValidating}
        idAccessor='order'
        columns={[
          {
            accessor: 'order',
            title: 'Позиція',
            render: ({ order, addressShort }) => `${order}. ${addressShort}`,
          },
          {
            accessor: 'time',
            title: 'Час',
            render: ({ time }) => dayjs(time).format('HH:mm'),
          },
          {
            accessor: 'pieces',
            title: 'Шт.',
            render: ({ value }) => (
              <Text>
                <NumberFormatter value={reduce(value, (acc, item) => acc + item.pieces, 0)} />
              </Text>
            ),
          },
          {
            accessor: 'amount',
            title: 'К-сть (m²)',
            render: ({ value }) => (
              <Text>
                <NumberFormatter value={reduce(value, (acc, item) => acc + item.amount, 0)} decimalScale={2} />
              </Text>
            ),
          },
          {
            accessor: 'weight',
            title: 'Вага',
            render: ({ value }) => (
              <Text>
                <NumberFormatter value={reduce(value, (acc, item) => acc + item.weight, 0)} decimalScale={3} />
              </Text>
            ),
          },
        ]}
        rowExpansion={{
          content: ({ record: station }) => (
            <Stack gap='4px'>
              <Stack gap='0' w='100%' px='md' py='xs'>
                <Text fw={600} span>
                  Адреса доставки:
                </Text>
                {station.address}
              </Stack>
              <DataTable
                withTableBorder
                withColumnBorders
                records={station.value}
                columns={[
                  {
                    accessor: 'orderId',
                    title: 'Номер замовлення',
                  },
                  {
                    accessor: 'pieces',
                    title: 'Шт.',
                  },
                  {
                    accessor: 'amount',
                    title: 'К-сть (m²)',
                  },
                  {
                    accessor: 'weight',
                    title: 'Вага',
                  },
                ]}
                rowExpansion={{
                  content: ({ record: order }) => (
                    <Stack w='100%' p='md' gap='md'>
                      <Stack gap='0'>
                        <Text fw={600}>Контрагент:</Text>
                        {order.agent}
                      </Stack>
                      <Stack gap='0'>
                        <Text fw={600}>Менеджер:</Text>
                        {order.manager}
                      </Stack>
                      {order.comments.main && (
                        <Stack gap='0'>
                          <Text fw={600}>Коментар:</Text>
                          {order.comments.main}
                        </Stack>
                      )}
                      {order.comments.logist && (
                        <Stack gap='0'>
                          <Text fw={600}>Коментар логіста:</Text>
                          {order.comments.logist}
                        </Stack>
                      )}
                      {order.comments.delivery && (
                        <Stack gap='0'>
                          <Text fw={600}>Коментар по доставці:</Text>
                          {order.comments.delivery}
                        </Stack>
                      )}
                      {order.comments.packer && (
                        <Stack gap='0'>
                          <Text fw={600}>Коментар для пакувальника:</Text>
                          {order.comments.packer}
                        </Stack>
                      )}
                    </Stack>
                  ),
                }}
              />
            </Stack>
          ),
        }}
      />
    </Container>
  );
}

export default memo(StationsTab);
