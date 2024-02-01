import { Card, Drawer, Flex, ScrollArea, Tabs, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { CalendarClock, MapPin, Truck } from 'lucide-react';
import React, { memo } from 'react';
import useSWR from 'swr';

import IRoute, { IPyramid, IStation, ITask } from '@/types/Route';

import StatusBadge from './StatusBadge';
import TabCountBadge from './TabCountBadge';
import MainTab from './Tabs/MainTab';
import PyramidsTab from './Tabs/PyramidsTab';
import StationsTab from './Tabs/StationsTab';
import TasksTab from './Tabs/TasksTab';

interface IProps {
  route: IRoute;
}

function Route({ route }: IProps) {
  const {
    data: pyramids,
    isValidating: pyramidsLoading,
    error: pyramidsError,
  } = useSWR<IPyramid[]>(`/api/routes/${route.id}/pyramids`);

  const {
    data: stations,
    isValidating: stationsLoading,
    error: stationsError,
  } = useSWR<IStation[]>(`/api/routes/${route.id}/stations`);

  const {
    data: tasks,
    isValidating: tasksLoading,
    error: tasksError,
  } = useSWR<ITask[]>(`/api/routes/${route.id}/tasks`);

  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Card
        shadow='sm'
        padding='lg'
        radius='md'
        withBorder
        className='cursor-pointer duration-300 hover:bg-[var(--mantine-color-dark-5)]'
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
        <StatusBadge route={route} />
        <Flex gap='1px' mt='md' direction='column'>
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

      <Drawer
        opened={opened}
        onClose={close}
        title='Маршрут'
        position='right'
        size='lg'
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Tabs defaultValue='main'>
          <Tabs.List>
            <Tabs.Tab value='main'>Основна інформація</Tabs.Tab>
            <Tabs.Tab value='points'>
              Шляхи <TabCountBadge data={stations} isLoading={stationsLoading} error={stationsError} />
            </Tabs.Tab>
            <Tabs.Tab value='pyramids'>
              Піраміди <TabCountBadge data={pyramids} isLoading={pyramidsLoading} error={pyramidsError} />
            </Tabs.Tab>
            <Tabs.Tab value='tasks'>
              Завдання <TabCountBadge data={tasks} isLoading={tasksLoading} error={tasksError} />
            </Tabs.Tab>
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
