import { Card, Drawer, Flex, Group, NumberFormatter, Tabs, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { trim } from 'lodash';
import { CircleUserRound, Lock, MapPin, Receipt } from 'lucide-react';
import React, { memo, useMemo } from 'react';

import IManaderOrder from '@/types/ManagerOrder';

import StatusBadge from './StatusBadge';
import MainTabOrder from './tabs/MainTabOrder';
import SpecificationTabOrder from './tabs/SpecificationTabOrder';

interface IProps {
  order: IManaderOrder;
}

function OrderItem({ order }: IProps) {
  const createdAt = useMemo(() => dayjs(order.createdAt), [order.createdAt]);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Card
        shadow='sm'
        radius='md'
        p='md'
        h='100%'
        withBorder={order.locked}
        onClick={open}
        className='cursor-pointer select-none border-[var(--mantine-color-red-5)] duration-300 hover:bg-[var(--mantine-color-dark-5)]'
      >
        <Flex justify='space-between' gap='sm'>
          <Title order={2}>{order.id}</Title>
          <Flex direction='column' align='end' c='dimmed'>
            <Text size='sm'>{createdAt.format('DD.MM.YYYY')}</Text>
            <Text size='sm'>{createdAt.format('HH:mm:ss')}</Text>
          </Flex>
        </Flex>
        {order.locked && (
          <Group c='red' gap='4px' mb='4px'>
            <Lock size={16} />
            <Text>Заблоковано</Text>
          </Group>
        )}
        <StatusBadge status={order.status} />
        <Flex mt='xs' direction='column' c='dimmed' gap='4px'>
          <Flex gap='4px'>
            <CircleUserRound />
            <Text className='line-clamp-1'>{trim(order.agent)}</Text>
          </Flex>
          <Flex gap='4px'>
            <MapPin />
            <Text className='line-clamp-1 w-full text-left'>{trim(order.location)}</Text>
          </Flex>
          {order.finance && (
            <Flex gap='4px'>
              <Receipt />
              <Text c={order.finance.final < 0 ? 'red' : 'dimmed'}>
                <NumberFormatter
                  value={order.finance.final}
                  suffix={` ${order.finance.currency}`}
                  decimalScale={2}
                  thousandSeparator=' '
                  fixedDecimalScale
                />
              </Text>
            </Flex>
          )}
        </Flex>
        <div className='flex-1' />
        {order.finance && (
          <div className='flex flex-row justify-end'>
            <NumberFormatter
              className='text-lg'
              value={order.finance.total}
              suffix={` ${order.finance.currency}`}
              decimalScale={2}
              thousandSeparator=' '
              fixedDecimalScale
            />
          </div>
        )}
      </Card>

      <Drawer opened={opened} onClose={close} position='right' title='Замовлення' size='xl'>
        <Tabs variant='outline' defaultValue='main'>
          <Tabs.List>
            <Tabs.Tab value='main'>Інформація</Tabs.Tab>
            <Tabs.Tab value='specification'>Специфікація</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='main'>
            <MainTabOrder order={order} />
          </Tabs.Panel>
          <Tabs.Panel value='specification'>
            <SpecificationTabOrder order={order} />
          </Tabs.Panel>
        </Tabs>
      </Drawer>
    </>
  );
}

export default memo(OrderItem);
