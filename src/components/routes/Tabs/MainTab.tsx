'use client';

import { Space, Stack } from '@mantine/core';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import DrawerItem from '@/components/ui/DrawerItem';
import TelephoneLink from '@/components/ui/TelephoneLink';
import IRoute from '@/types/Route';

import StatusBadge from '../StatusBadge';

interface IProps {
  route: IRoute;
}

function MainTab({ route }: IProps) {
  return (
    <Stack gap='4px' mt='sm'>
      <DrawerItem label='ID' value={route.id} />
      <DrawerItem label='Статус' value={<StatusBadge route={route} />} />
      <Space />
      <DrawerItem label='Дата' value={dayjs(route.date).format('DD.MM.YYYY HH:mm:ss')} />
      <DrawerItem label='Виїзд' value={dayjs(route.departure).format('HH:mm:ss')} />
      <DrawerItem label='Транспорт' value={route.transport} />
      <Space />
      <DrawerItem label='Водій' value={<TelephoneLink label={route.driver?.name ?? ''} tel={route.driver?.tel} />} />
      <DrawerItem label='Відповідальний' value={route.responsible} />
    </Stack>
  );
}

export default memo(MainTab);
