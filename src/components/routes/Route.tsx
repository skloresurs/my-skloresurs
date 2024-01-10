import { Card, Drawer, Flex, Tabs, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { CalendarClock, MapPin, Truck } from 'lucide-react';
import React, { memo } from 'react';
import { twMerge } from 'tailwind-merge';

import IRoute from '@/types/Route';

import MainTab from './Tabs/MainTab';
import PyramidsTab from './Tabs/PyramidsTab';
import StationsTab from './Tabs/StationsTab';
import TasksTab from './Tabs/TasksTab';

interface IProps {
  route: IRoute;
}

function Route({ route }: IProps) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Card
        shadow='sm'
        padding='lg'
        radius='md'
        withBorder
        className={twMerge(
          'cursor-pointer duration-300 hover:bg-[var(--mantine-color-dark-5)]',
          route.completed ? 'border-[var(--mantine-color-green-9)]' : ''
        )}
        h='100%'
        onClick={() => {
          open();
        }}
      >
        <Title order={2} c='blue'>
          {route.id}
        </Title>
        <Text size='xs' c='dimmed'>
          {dayjs(route.date).format('DD.MM.YYYY HH:mm:ss')}
        </Text>
        <Flex gap='xs' mt='md' direction='column'>
          <Flex gap='xs' align='center'>
            <CalendarClock size={18} />
            <Text>{dayjs(route.departure).format('HH:mm:ss')}</Text>
          </Flex>
          <Flex gap='xs' align='center'>
            <MapPin size={18} />
            <Text>{route.route}</Text>
          </Flex>
          <Flex gap='xs' align='center'>
            <Truck size={18} />
            <Text>{route.transport}</Text>
          </Flex>
        </Flex>
      </Card>

      <Drawer opened={opened} onClose={close} title='Маршрут' position='right' size='lg'>
        <Tabs defaultValue='main'>
          <Tabs.List>
            <Tabs.Tab value='main'>Основна інформація</Tabs.Tab>
            <Tabs.Tab value='points'>Шляхи</Tabs.Tab>
            <Tabs.Tab value='pyramids'>Піраміди</Tabs.Tab>
            <Tabs.Tab value='tasks'>Завдання</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value='main'>
            <MainTab route={route} />
          </Tabs.Panel>
          <Tabs.Panel value='points'>
            <StationsTab route={route} />
          </Tabs.Panel>
          <Tabs.Panel value='pyramids'>
            <PyramidsTab route={route} />
          </Tabs.Panel>
          <Tabs.Panel value='tasks'>
            <TasksTab route={route} />
          </Tabs.Panel>
        </Tabs>
      </Drawer>
    </>
  );
}

export default memo(Route);