'use client';

import { ActionIcon, Divider, NumberFormatter, Space, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { trim } from 'lodash';
import { Filter } from 'lucide-react';
import Link from 'next/link';
import React, { memo } from 'react';

import DrawerItem from '@/components/ui/DrawerItem';
import TelephoneButton from '@/components/ui/TelephoneButton';
import IManaderOrder from '@/types/ManagerOrder';

import StatusBadge from '../../StatusBadge';

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
      <DrawerItem label='Статус'>
        <StatusBadge status={order.status} />
      </DrawerItem>
      <Space h='8px' />
      <DrawerItem label='Контрагент' value={order.agent?.name ?? NotFoundData}>
        <ActionIcon size='lg' component={Link} href={`/manager?agent=${order.agent?.id}`} variant='light'>
          <Filter size={18} />
        </ActionIcon>
      </DrawerItem>
      <DrawerItem label='Контактна особа' value={order.contact?.name ?? NotFoundData}>
        <TelephoneButton tel={order.contact?.tel} />
      </DrawerItem>
      <DrawerItem label='Менеджер' value={trim(order.manager?.name) ?? NotFoundData}>
        <TelephoneButton tel={order.manager?.tel} />
      </DrawerItem>
      <DrawerItem label='Інженер' value={trim(order.responsible?.name) ?? NotFoundData}>
        <TelephoneButton tel={order.responsible?.tel} />
      </DrawerItem>
      <Space h='8px' />
      {order.finance && (
        <DrawerItem
          label='Номер рахунку'
          value={order.finance.bill.length > 0 ? trim(order.finance.bill) : NotFoundData}
        >
          {order.finance.bill.length > 0 && (
            <ActionIcon size='lg' component={Link} href={`/manager?bill=${order.finance.bill}`} variant='light'>
              <Filter size={18} />
            </ActionIcon>
          )}
        </DrawerItem>
      )}
      <DrawerItem label='Заблоковано для виробництва' value={order.locked || order.lockedComment ? 'Так' : 'Ні'} />
      {order.lockedComment && <DrawerItem label='Коментар блокування' value={order.lockedComment} />}
      <Divider my='sm' />
      {order.finance && (
        <>
          <DrawerItem label='Сума замовлення'>
            <NumberFormatter value={order.finance.total} {...moneyFormatProps} />
          </DrawerItem>
          <DrawerItem label='Оплачено'>
            <NumberFormatter value={order.finance.pay} {...moneyFormatProps} />
          </DrawerItem>
          <DrawerItem label='Кінцевий залишок'>
            <Text c={order.finance.final < 0 ? 'red' : ''}>
              <NumberFormatter value={order.finance.final} {...moneyFormatProps} />
            </Text>
          </DrawerItem>
          <DrawerItem label='Борг до відвантаження'>
            <NumberFormatter value={order.finance.total - order.finance.pay} {...moneyFormatProps} />
          </DrawerItem>
          <Divider my='sm' />
        </>
      )}
      <DrawerItem label='Адреса' value={trim(order.location)} />
    </Stack>
  );
}

export default memo(MainTabOrder);
