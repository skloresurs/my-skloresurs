'use client';

import { Divider, NumberFormatter, Space, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { trim } from 'lodash';
import React, { memo } from 'react';

import DrawerItem from '@/components/ui/DrawerItem';
import IManaderOrder from '@/types/ManagerOrder';

import StatusBadge from '../StatusBadge';

const NotFoundData = 'Не вказано';

function MainTabOrder({ order }: { order: IManaderOrder }) {
  const moneyFormatProps = {
    suffix: ` ${order.finance?.currency}`,
    decimalScale: 2,
    thousandSeparator: ' ',
    fixedDecimalScale: true,
  };
  return (
    <Stack gap='4px' mt='sm'>
      <DrawerItem label='ID' value={trim(order.id)} />
      <Space h='8px' />
      <DrawerItem label='Дата створення' value={dayjs(trim(order.createdAt)).format('DD.MM.YYYY HH:mm:ss')} />
      <DrawerItem
        label='Дата відправлення'
        value={order.shipmentAt ? dayjs(trim(order.shipmentAt)).format('DD.MM.YYYY') : NotFoundData}
      />
      <Space h='8px' />
      <DrawerItem label='Статус' value={<StatusBadge status={order.status} />} />
      <Space h='8px' />
      <DrawerItem label='Контрагент' value={trim(order.agent) ?? NotFoundData} />
      <DrawerItem label='Менеджер' value={trim(order.manager) ?? NotFoundData} />
      <DrawerItem label='Відповідальний' value={trim(order.responsible) ?? NotFoundData} />
      <Space h='8px' />
      {order.finance && <DrawerItem label='Номер рахунку' value={trim(order.finance.bill) ?? NotFoundData} />}
      <DrawerItem label='Заблоковано для виробництва' value={order.locked ? 'Так' : 'Ні'} />
      <Divider my='sm' />
      {order.finance && (
        <>
          <DrawerItem
            label='Сума замовлення'
            value={<NumberFormatter value={order.finance.total} {...moneyFormatProps} />}
          />
          <DrawerItem label='Оплачено' value={<NumberFormatter value={order.finance.pay} {...moneyFormatProps} />} />
          <DrawerItem
            label='Кінцевий залишок'
            value={
              <Text c={order.finance.final < 0 ? 'red' : ''}>
                <NumberFormatter value={order.finance.final} {...moneyFormatProps} />
              </Text>
            }
          />
          <DrawerItem
            label='Борг до відвантаження'
            value={<NumberFormatter value={order.finance.total - order.finance.pay} {...moneyFormatProps} />}
          />
          <Divider my='sm' />
        </>
      )}
      <DrawerItem label='Адреса' value={trim(order.location)} />
    </Stack>
  );
}

export default memo(MainTabOrder);
