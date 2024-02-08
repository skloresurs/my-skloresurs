'use client';

import { AppShell as MantineAppShell, Burger, Divider, Flex, ScrollArea, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { constant, map } from 'lodash';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import navbar, { footer } from '@/components/navbar/NavBar';
import NavBarItemCompnent from '@/components/navbar/NavBarItem';
import verifyPermission from '@/libs/verify-permission';
import { IUserMeRequest } from '@/types/User';

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
          {map(navbar, (e) => (
            <NavBarItemCompnent
              toogle={toggle}
              key={e.id}
              item={e}
              hide={!verifyPermission(user?.permissions ?? [], e.permission, true)}
            />
          ))}
        </MantineAppShell.Section>
        <MantineAppShell.Section>
          <Divider my='md' />
          {map(
            footer(() => logout()),
            (e) => (
              <NavBarItemCompnent key={e.id} toogle={toggle} item={e} hide={false} />
            )
          )}
        </MantineAppShell.Section>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main pb='135px'>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
