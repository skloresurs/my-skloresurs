import { Card, Drawer, Flex, Tabs, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { CalendarClock, MapPin, Truck } from 'lucide-react';
import React, { memo } from 'react';

import MainTab from './Tabs/MainTab';
import OrdersTab from './Tabs/OrdersTab';

function Route() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Card
        shadow='sm'
        padding='lg'
        radius='md'
        withBorder
        className='cursor-pointer duration-300 hover:bg-[var(--mantine-color-dark-5)]'
        onClick={() => {
          open();
        }}
      >
        <Title order={2} c='blue'>
          000077108
        </Title>
        <Text size='xs' c='dimmed'>
          {dayjs().format('DD.MM.YYYY HH:mm:ss')}
        </Text>
        <Flex gap='xs' mt='md' direction='column'>
          <Flex gap='xs' align='center'>
            <CalendarClock size={18} />
            <Text>{dayjs().format('HH:mm:ss')}</Text>
          </Flex>
          <Flex gap='xs' align='center'>
            <MapPin size={18} />
            <Text>Харків</Text>
          </Flex>
          <Flex gap='xs' align='center'>
            <Truck size={18} />
            <Text>SCANIA P-410 ВК9782ІА</Text>
          </Flex>
        </Flex>
      </Card>

      <Drawer opened={opened} onClose={close} title='Маршрут' position='right' size='lg'>
        <Tabs defaultValue='main'>
          <Tabs.List>
            <Tabs.Tab value='main'>Основна інформація</Tabs.Tab>
            <Tabs.Tab value='orders'>Інформація про замовлення</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value='main'>
            <MainTab />
          </Tabs.Panel>
          <Tabs.Panel value='orders'>
            <OrdersTab />
          </Tabs.Panel>
        </Tabs>
      </Drawer>
    </>
  );
}

export default memo(Route);
