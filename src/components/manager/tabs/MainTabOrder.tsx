'use client';

import { Badge, Divider, NumberFormatter } from '@mantine/core';
import React from 'react';
import useSWR from 'swr';

import getStatusConfig from '@/libs/status';
import IManaderOrder from '@/types/ManagerOrder';
import { IUserMeRequest } from '@/types/User';

import DrawerItem from '../DrawerItem';
import DrawerItemMultiLine from '../DrawerItemMultiLine';

const NotFoundData = 'Не вказано';

export default function MainTabOrder({ order }: { order: IManaderOrder }) {
  const { data: user } = useSWR<IUserMeRequest>(`/api/user`);
  return (
    <div className='mt-2'>
      <div className='flex flex-col gap-1'>
        <DrawerItem title='ID' data={order.id?.trim()} enableCopy />
        <div className='my-0.5' />
        <DrawerItem title='Дата створення' data={order.createdAt?.trim()} />
        <DrawerItem title='Дата відправлення' data={order.shipmentAt?.trim() ?? NotFoundData} />
        <div className='my-0.5' />
        <DrawerItem
          title='Статус'
          data={
            <Badge className='cursor-default select-none' variant='light' color={getStatusConfig(order.status).color}>
              {getStatusConfig(order.status).name}
            </Badge>
          }
        />
        <div className='my-0.5' />
        <DrawerItem title='Контрагент' data={order.agent?.trim() ?? NotFoundData} />
        <DrawerItem title='Менеджер' data={order.manadger?.trim() ?? NotFoundData} />
        <DrawerItem title='Відповідальний' data={order.responsible?.trim() ?? NotFoundData} />
        <div className='my-0.5' />
        {user?.permissions.includes('ManagerFinance') && (
          <DrawerItem title='Номер рахунку' data={order.bill?.trim() ?? NotFoundData} />
        )}
        <DrawerItem title='Заблоковано для виробництва' data={order.locked ? 'Так' : 'Ні'} />
      </div>
      <Divider my='sm' />
      {user?.permissions.includes('ManagerFinance') && (
        <>
          <div className='flex flex-col'>
            <DrawerItem
              title='Сума замовлення'
              data={
                <NumberFormatter
                  value={order.total}
                  suffix={` ${order.currency}`}
                  decimalScale={2}
                  thousandSeparator=' '
                  fixedDecimalScale
                />
              }
            />
            <DrawerItem
              title='Оплачено'
              data={
                <NumberFormatter
                  value={order.pay}
                  suffix={` ${order.currency}`}
                  decimalScale={2}
                  thousandSeparator=' '
                  fixedDecimalScale
                />
              }
            />
            <DrawerItem
              title='Кінцевий залишок'
              data={
                <NumberFormatter
                  value={order.final}
                  suffix={` ${order.currency}`}
                  decimalScale={2}
                  thousandSeparator=' '
                  fixedDecimalScale
                />
              }
            />
            <DrawerItem
              title='Борг до відвантаження'
              className='mt-1'
              data={
                <NumberFormatter
                  value={order.total - order.pay}
                  suffix={` ${order.currency}`}
                  decimalScale={2}
                  thousandSeparator=' '
                  fixedDecimalScale
                />
              }
            />
          </div>
          <Divider my='sm' />
        </>
      )}
      <DrawerItemMultiLine title='Адреса' data={order.location?.trim()} enableCopy />
    </div>
  );
}
