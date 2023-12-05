'use client';

import {
  AppShell as MantineAppShell,
  Burger,
  Divider,
  ScrollArea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import React, { ReactNode } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import navbar, { footer } from '@/components/NavBar';
import NavBarItemCompnent from '@/components/NavBarItem';
import verifyPermission from '@/libs/verify-permission';
import IUser from '@/types/User';

const NotificationTitle = 'Вихід';

export default function AppShell({ children }: { children: ReactNode }) {
  const { data: user } = useSWR<IUser | null>(`/api/user`);
  const { mutate } = useSWRConfig();
  const [opened, { toggle }] = useDisclosure();

  const logout = async () => {
    const notification = notifications.show({
      autoClose: false,
      loading: true,
      message: 'Вихід...',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const response = await axios.post('/api/auth/logout').catch((error) => {
      notifications.update({
        autoClose: 3000,
        color: 'red',
        icon: <XCircle />,
        id: notification,
        loading: false,
        message:
          error.response?.data.error ?? error.message ?? 'Невідома помилка',
        title: NotificationTitle,
        withCloseButton: true,
      });
    });

    if (!response || response.status !== 200) return;
    await mutate(() => true, undefined, { revalidate: false });
    mutate('/api/user');

    notifications.update({
      autoClose: 3000,
      color: 'green',
      icon: <CheckCircle />,
      id: notification,
      loading: false,
      message: 'Ви успішно вийшли',
      title: NotificationTitle,
      withCloseButton: true,
    });
  };

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{ breakpoint: 'sm', collapsed: { mobile: !opened }, width: 250 }}
      padding="md"
    >
      <MantineAppShell.Header className="flex flex-row items-center justify-between gap-2 px-5">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        Logo
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="md">
        <MantineAppShell.Section className="text-center text-lg">
          Вітаємо, {user?.fullname}
        </MantineAppShell.Section>
        <MantineAppShell.Section grow my="md" component={ScrollArea}>
          {navbar.map((e) => (
            <NavBarItemCompnent
              key={e.id}
              item={e}
              hide={
                !verifyPermission(user?.permissions ?? [], e.permission, true)
              }
            />
          ))}
        </MantineAppShell.Section>
        <MantineAppShell.Section>
          <Divider className="my-4" />
          {footer(() => logout()).map((e) => (
            <NavBarItemCompnent key={e.id} item={e} hide={false} />
          ))}
        </MantineAppShell.Section>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
