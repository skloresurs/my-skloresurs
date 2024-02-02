'use client';

import { Center, Container, NumberFormatter, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { filter, groupBy, map, reduce, reject } from 'lodash';
import { Compass } from 'lucide-react';
import { DataTable } from 'mantine-datatable';
import { nanoid } from 'nanoid';
import React, { memo, useMemo } from 'react';
import useSWR from 'swr';

import DrawerItem from '@/components/ui/DrawerItem';
import OutsideLinkButton from '@/components/ui/OutsideLinkButton';
import TelephoneButton from '@/components/ui/TelephoneButton';
import { getGoogleMapsRouteUrl } from '@/libs/maps-api';
import IRoute, { IStation } from '@/types/Route';
import IUser1C from '@/types/User1CData';

interface IProps {
  route: IRoute;
}

function StationsTab({ route }: IProps) {
  const { data, isValidating } = useSWR<IStation[]>(`/api/routes/${route.id}/stations`);

  const ordersList = useMemo(() => {
    const orderWithoutOrder = reduce(
      groupBy(filter(data, ['order', 0]), 'addressShort'),
      (acc, value) => {
        const v = value[0];
        if (!v) return acc;

        acc.push({
          id: nanoid(),
          order: v.order,
          time: v.time,
          address: v.address,
          addressShort: v.addressShort,
          value,
        });
        return acc;
      },
      [] as {
        id: string;
        order: number;
        time: string;
        address: string;
        addressShort: string;
        value: IStation[];
      }[]
    );

    return reduce(
      groupBy(reject(data, ['order', 0]), 'order'),
      (acc, value) => {
        const v = value[0];
        if (!v) return acc;

        acc.push({
          id: nanoid(),
          order: v.order,
          time: v.time,
          address: v.address,
          addressShort: v.addressShort,
          contact: v.contact,
          value,
        });
        return acc;
      },
      [...orderWithoutOrder] as {
        id: string;
        order: number;
        time: string;
        address: string;
        addressShort: string;
        contact: IUser1C | null;
        value: IStation[];
      }[]
    );
  }, [data]);

  const googleMapFullRoute = useMemo(() => getGoogleMapsRouteUrl(map(ordersList, 'addressShort')) ?? '#', [ordersList]);

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
        idAccessor='id'
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
                <NumberFormatter value={reduce(value, (acc, item) => acc + item.weight, 0)} decimalScale={0} />
              </Text>
            ),
          },
        ]}
        rowExpansion={{
          content: ({ record: station }) => (
            <div className='bg-[var(--mantine-color-dark-9)]'>
              <Stack gap='8px' p='8px'>
                <DrawerItem label='Контактна особа' value={station.contact?.name}>
                  <TelephoneButton tel={station.contact?.tel} />
                </DrawerItem>
                <OutsideLinkButton
                  label='Прокласти маршрут'
                  icon={<Compass size={16} />}
                  target='_blank'
                  link={getGoogleMapsRouteUrl([station.addressShort])}
                  full
                />
                <DataTable
                  borderRadius='sm'
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
                      <div className='bg-[var(--mantine-color-dark-9)]'>
                        <Stack w='100%' p='md' gap='md'>
                          <Stack w='100%' gap='4px'>
                            <DrawerItem label='Контрагент' value={order.agent?.name}>
                              <TelephoneButton tel={order.agent?.tel} />
                            </DrawerItem>
                            <DrawerItem label='Менеджер' value={order.manager?.name}>
                              <TelephoneButton tel={order.manager?.tel} />
                            </DrawerItem>
                            <DrawerItem label='Інженер' value={order.engineer?.name}>
                              <TelephoneButton tel={order.engineer?.tel} />
                            </DrawerItem>
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
                      </div>
                    ),
                  }}
                />
              </Stack>
            </div>
          ),
        }}
      />

      <Center mt='xs'>
        <OutsideLinkButton
          label='Прокласти весь маршрут'
          full
          fullWidth
          icon={<Compass size={16} />}
          target='_blank'
          link={googleMapFullRoute}
        />
      </Center>
    </Container>
  );
}

export default memo(StationsTab);
