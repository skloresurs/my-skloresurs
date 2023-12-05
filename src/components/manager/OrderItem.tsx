'use client';

import 'moment/locale/uk';

import { Drawer, NumberFormatter, Paper, Tabs, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CircleUserRound, MapPin } from 'lucide-react';
import moment from 'moment';
import React from 'react';
import Moment from 'react-moment';
import useSWR from 'swr';

import IManaderOrder from '@/types/ManagerOrder';
import IUser from '@/types/User';

import MainTabOrder from './tabs/MainTabOrder';
import SpecificationTabOrder from './tabs/SpecificationTabOrder';

interface IProps {
  order: IManaderOrder;
}

export default function OrderItem({ order }: IProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: user } = useSWR<IUser>('/api/user');
  const createdAt = moment(order.createdAt, 'DD.MM.YYYY HH:mm:ss').toDate();

  return (
    <>
      <Paper
        radius="lg"
        p="md"
        shadow="sm"
        component="button"
        onClick={open}
        withBorder={order.locked}
        className="relative h-full w-full cursor-pointer justify-start border-[var(--mantine-color-red-5)] bg-[var(--mantine-color-dark-8)] duration-300 hover:bg-[var(--mantine-color-dark-9)]"
      >
        <div className="flex flex-row items-center justify-between">
          <Title order={2}>{order.id}</Title>
          <div className="flex flex-col text-right text-sm text-[var(--mantine-color-gray-5)]">
            <Moment date={createdAt} format="ll" locale="uk" />
            <Moment date={createdAt} format="LTS" locale="uk" />
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col gap-1 text-[var(--mantine-color-gray-5)]">
          <div className="flex flex-row items-center gap-1">
            <CircleUserRound />
            <span>{order.agent.trim()}</span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <MapPin />
            <span className="line-clamp-2 w-full text-left">
              {order.location.trim()}
            </span>
          </div>
        </div>
        {user?.permissions.includes('ManagerFinance') && (
          <div className="flex flex-row justify-end">
            <NumberFormatter
              className="text-lg"
              value={order.total}
              suffix={` ${order.currency}`}
              decimalScale={2}
            />
          </div>
        )}
      </Paper>
      <Drawer
        offset={8}
        radius="md"
        opened={opened}
        onClose={close}
        position="right"
        title="Замовлення"
        size="xl"
      >
        <Tabs variant="outline" defaultValue="main">
          <Tabs.List>
            <Tabs.Tab value="main">Інформація</Tabs.Tab>
            <Tabs.Tab value="specification">Специфікація</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="main">
            <MainTabOrder order={order} />
          </Tabs.Panel>
          <Tabs.Panel value="specification">
            <SpecificationTabOrder order={order} />
          </Tabs.Panel>
        </Tabs>
      </Drawer>
    </>
  );
}
