import { Space, Stack } from '@mantine/core';
import dayjs from 'dayjs';
import React from 'react';

import DrawerItem from '@/components/ui/DrawerItem';

export default function MainTab() {
  return (
    <Stack gap='xs' mt='sm'>
      <DrawerItem label='ID' value='000000' />
      <DrawerItem label='Дата' value={dayjs().format('DD.MM.YYYY HH:mm:ss')} />
      <DrawerItem label='Транспорт' value='SCANIA P-410 ВК9782ІА' />
      <DrawerItem label='Виїзд' value={dayjs().format('HH:mm:ss')} />
      <Space />
      <DrawerItem label='Водій' value='Порядін Олександр Сергійович' />
      <DrawerItem label='Відповідальний' value='Дмитрів Владислав' />
    </Stack>
  );
}
