import { NumberFormatter, Paper, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { trim } from 'lodash';
import { CircleUserRound, Lock, MapPin, Receipt } from 'lucide-react';
import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import IManaderOrder from '@/types/ManagerOrder';

import StatusBadge from './StatusBadge';

interface IProps {
  order: IManaderOrder;
}

export default function OrderItem({ order }: IProps) {
  const createdAt = useMemo(() => dayjs(order.createdAt), [order.createdAt]);

  return (
    <Paper
      radius='lg'
      p='md'
      shadow='sm'
      withBorder={order.locked}
      className='relative h-full w-full cursor-pointer justify-start border-[var(--mantine-color-red-5)] bg-[var(--mantine-color-dark-8)] duration-300 group-hover:bg-[var(--mantine-color-dark-9)]'
    >
      <div className='flex flex-row items-center justify-between'>
        <Title order={2}>{order.id}</Title>
        <div className='flex flex-col text-right text-sm text-[var(--mantine-color-dimmed)]'>
          <span>{createdAt.format('DD.MM.YYYY')}</span>
          <span>{createdAt.format('HH:mm:ss')}</span>
        </div>
      </div>
      {order.locked && (
        <div className='flex flex-row items-center gap-1 text-sm text-[var(--mantine-color-red-5)]'>
          <Lock size={16} />
          <span className=''>Заблоковано</span>
        </div>
      )}
      <div className='mt-1 flex'>
        <StatusBadge status={order.status} />
      </div>
      <div className='mt-3 flex w-full flex-col gap-1 text-[var(--mantine-color-gray-6)]'>
        <div className='flex flex-row items-center gap-1'>
          <CircleUserRound />
          <span className='line-clamp-1 w-full text-left'>{trim(order.agent)}</span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <MapPin />
          <span className='line-clamp-1 w-full text-left'>{trim(order.location)}</span>
        </div>
        {order.finance && (
          <div className='flex flex-row items-center gap-1'>
            <Receipt />
            <span
              className={twMerge(
                'line-clamp-1 w-full text-left',
                order.finance.final < 0 && 'text-[var(--mantine-color-red-5)] opacity-75'
              )}
            >
              <NumberFormatter
                value={order.finance.final}
                suffix={` ${order.finance.currency}`}
                decimalScale={2}
                thousandSeparator=' '
                fixedDecimalScale
              />
            </span>
          </div>
        )}
      </div>
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
    </Paper>
  );
}
