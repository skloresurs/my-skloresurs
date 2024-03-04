'use client';

import { AppShell as MantineAppShell, Burger, Divider, Flex, ScrollArea, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { constant } from 'lodash';
import { Boxes, Database, GanttChartSquare, LogOut, Shield, Truck, UserRound } from 'lucide-react';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import verifyPermission from '@/libs/verify-permission';
import { IUserMeRequest } from '@/types/User';

import NavBarItem from './navbar/NavBarItem';
import NavBarItemAdminUsers from './navbar/NavBarItemAdminUsers';
import { errorNotificationProps, loadingNotificationProps, successNotificationProps } from './Notification';

const NotificationTitle = 'Вихід';

export default function AppShell({ children }: { children: ReactNode }) {
  const { data: user } = useSWR<IUserMeRequest>(`/api/user`);
  const { mutate } = useSWRConfig();
  const [opened, { toggle }] = useDisclosure();

  const logout = async () => {
    const notification = notifications.show({
      title: NotificationTitle,
      message: 'Вихід з системи...',
      ...loadingNotificationProps,
    });

    const response = await axios.post('/api/auth/logout').catch((error) => {
      notifications.update({
        id: notification,
        title: NotificationTitle,
        message: error.response?.data.error ?? error.message ?? 'Невідома помилка',
        ...errorNotificationProps,
      });
    });

    if (!response || response.status !== 200) return;
    await mutate(constant(true), undefined, { revalidate: false });
    mutate('/api/user');

    notifications.update({
      id: notification,
      message: 'Ви успішно вийшли',
      title: NotificationTitle,
      ...successNotificationProps,
    });
  };

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{ breakpoint: 'sm', collapsed: { mobile: !opened }, width: 250 }}
      padding='md'
    >
      <MantineAppShell.Header>
        <Flex gap='sm' px='md' align='center' h='100%'>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
          <Image src='/logo.webp' height={40} width={40} alt='Skloresurs' />
          <Title order={1} size='h2'>
            My Skloresurs
          </Title>
        </Flex>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p='md'>
        <MantineAppShell.Section>
          <Text ta='center'>Вітаємо, {user?.fullname}</Text>
        </MantineAppShell.Section>
        <MantineAppShell.Section grow my='md' component={ScrollArea}>
          <NavBarItem label='Замовлення' href='/' icon={<Boxes />} />
          <NavBarItem
            label='Менеджер'
            href='/manager'
            icon={<GanttChartSquare />}
            hide={!verifyPermission(user?.permissions ?? [], 'Manager')}
          />
          <NavBarItem
            label='Маршрути'
            href='/routes'
            icon={<Truck />}
            hide={!verifyPermission(user?.permissions ?? [], 'Driver')}
          />
          <NavBarItem label='Адмін-панель' icon={<Shield />} hide={!verifyPermission(user?.permissions ?? [], 'Admin')}>
            <NavBarItemAdminUsers user={user} />
            <NavBarItem
              label='Користувачі 1C'
              href='/admin/users-1c'
              icon={<Database />}
              hide={!verifyPermission(user?.permissions ?? [], 'Admin')}
            />
          </NavBarItem>
        </MantineAppShell.Section>
        <MantineAppShell.Section>
          <Divider my='md' />
          <NavBarItem label='Профіль' href='/profile' icon={<UserRound />} />
          <NavBarItem label='Вийти' icon={<LogOut />} onClick={logout} />
        </MantineAppShell.Section>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
