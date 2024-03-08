import { Card, Flex, Group, NumberFormatter, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { trim } from 'lodash';
import { CircleUserRound, Lock, MapPin, Receipt } from 'lucide-react';
import Link from 'next/link';
import React, { memo, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { Order } from '@/types/manager/Order';

import StatusBadge from '../StatusBadge';

interface IProps {
  order: Order;
}

function OrderItem({ order }: IProps) {
  const shipmentAt = useMemo(() => dayjs(order.shipmentAt), [order.shipmentAt]);

  return (
    <Card
      component={Link}
      href={`/manager/${order.id}`}
      shadow='sm'
      radius='md'
      p='md'
      h='100%'
      withBorder={order.locked}
      className={twMerge(
        'cursor-pointer select-none duration-300 hover:bg-[var(--mantine-color-dark-5)]',
        order.locked && 'bg-[#3d2f2f] hover:bg-[#4d3f3f]'
      )}
    >
      <Flex justify='space-between' gap='sm'>
        <Title order={2}>{order.id}</Title>
        <Flex direction='column' align='end' c='dimmed'>
          <Text size='sm'>{shipmentAt.format('DD.MM.YYYY')}</Text>
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
          <Text className='line-clamp-1'>{trim(order.agent?.name)}</Text>
        </Flex>
        <Flex gap='4px'>
          <MapPin />
          <Text className='line-clamp-1 w-full text-left'>{trim(order.region)}</Text>
        </Flex>
        {order.finance && (
          <Flex gap='4px'>
            <Receipt />
            <Text c={order.finance.total - order.finance.pay > 0 ? 'red' : 'dimmed'}>
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
        <Flex direction='row-reverse'>
          <NumberFormatter
            className='text-lg'
            value={order.finance.total}
            suffix={` ${order.finance.currency}`}
            decimalScale={2}
            thousandSeparator=' '
            fixedDecimalScale
          />
        </Flex>
      )}
    </Card>
  );
}

export default memo(OrderItem);
