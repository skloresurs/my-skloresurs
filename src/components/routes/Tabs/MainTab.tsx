import { Space, Stack } from '@mantine/core';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import DrawerItem from '@/components/ui/DrawerItem';
import IRoute from '@/types/Route';

import RouteStatusBadge from '../RouteStatusBadge';

interface IProps {
  route: IRoute;
}

function MainTab({ route }: IProps) {
  return (
    <Stack gap='4px' mt='sm'>
      <DrawerItem label='ID' value={route.id} />
      <DrawerItem label='Статус' value={<RouteStatusBadge completed={route.completed} />} />
      <Space />
      <DrawerItem label='Дата' value={dayjs(route.date).format('DD.MM.YYYY HH:mm:ss')} />
      <DrawerItem label='Виїзд' value={dayjs(route.departure).format('HH:mm:ss')} />
      <DrawerItem label='Транспорт' value={route.transport} />
      <Space />
      <DrawerItem label='Водій' value={route.driver} />
      <DrawerItem label='Відповідальний' value={route.responsible} />
    </Stack>
  );
}

export default memo(MainTab);