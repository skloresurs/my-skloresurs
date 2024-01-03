'use client';

import { Divider, NumberFormatter } from '@mantine/core';
import dayjs from 'dayjs';
import { trim } from 'lodash';
import React from 'react';

import IManaderOrder from '@/types/ManagerOrder';

import DrawerItem from '../DrawerItem';
import DrawerItemMultiLine from '../DrawerItemMultiLine';
import StatusBadge from '../StatusBadge';

const NotFoundData = 'Не вказано';

export default function MainTabOrder({ order }: { order: IManaderOrder }) {
  const moneyFormatProps = {
    suffix: ` ${order.finance?.currency}`,
    decimalScale: 2,
    thousandSeparator: ' ',
    fixedDecimalScale: true,
  };
  return (
    <div className='mt-2'>
      <div className='flex flex-col gap-1'>
        <DrawerItem title='ID' data={trim(order.id)} enableCopy />
        <div className='my-0.5' />
        <DrawerItem title='Дата створення' data={dayjs(trim(order.createdAt)).format('DD.MM.YYYY HH:mm:ss')} />
        <DrawerItem
          title='Дата відправлення'
          data={order.shipmentAt ? dayjs(trim(order.shipmentAt)).format('DD.MM.YYYY') : NotFoundData}
        />
        <div className='my-0.5' />
        <DrawerItem title='Статус' data={<StatusBadge status={order.status} />} />
        <div className='my-0.5' />
        <DrawerItem title='Контрагент' data={trim(order.agent) ?? NotFoundData} />
        <DrawerItem title='Менеджер' data={trim(order.manadger) ?? NotFoundData} />
        <DrawerItem title='Відповідальний' data={trim(order.responsible) ?? NotFoundData} />
        <div className='my-0.5' />
        {order.finance && <DrawerItem title='Номер рахунку' data={trim(order.finance.bill) ?? NotFoundData} />}
        <DrawerItem title='Заблоковано для виробництва' data={order.locked ? 'Так' : 'Ні'} />
      </div>
      <Divider my='sm' />
      {order.finance && (
        <>
          <div className='flex flex-col'>
            <DrawerItem
              title='Сума замовлення'
              data={<NumberFormatter value={order.finance.total} {...moneyFormatProps} />}
            />
            <DrawerItem title='Оплачено' data={<NumberFormatter value={order.finance.pay} {...moneyFormatProps} />} />
            <DrawerItem
              title='Кінцевий залишок'
              textColor={order.finance.final < 0 ? 'red' : ''}
              data={<NumberFormatter value={order.finance.final} {...moneyFormatProps} />}
            />
            <DrawerItem
              title='Борг до відвантаження'
              className='mt-1'
              data={<NumberFormatter value={order.finance.total - order.finance.pay} {...moneyFormatProps} />}
            />
          </div>
          <Divider my='sm' />
        </>
      )}
      <DrawerItemMultiLine title='Адреса' data={trim(order.location)} enableCopy />
    </div>
  );
}
