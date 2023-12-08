'use client';

import { Button, Divider, Paper, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { IUserMeRequest, IUserRequest } from '@/types/User';

const NotificationTitle = 'Керування користувачем';

export default function UserInfoTab({ user }: { user?: IUserRequest }) {
  const { mutate } = useSWRConfig();
  const { data: activeUser } = useSWR<IUserMeRequest>(`/api/user`);
  const [fullname, setFullName] = useState(user?.fullname ?? '');
  const [loading, { open: enableLoading, close: disableLoading }] =
    useDisclosure();

  const updateFullname = async () => {
    enableLoading();
    if (!fullname) {
      disableLoading();
      return notifications.show({
        autoClose: 3000,
        color: 'red',
        icon: <XCircle />,
        message: "Ви не вказали своє повне ім'я",
        title: NotificationTitle,
        withCloseButton: true,
      });
    }
    const notification = notifications.show({
      autoClose: false,
      loading: true,
      message: 'Оновлення повного імені...',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const response = await axios
      .post(`/api/user/${user?.id}/fullname`, {
        fullname,
      })
      .catch((error) => {
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

    if (!response || response.status !== 200) return disableLoading();
    await mutate(`/api/user/${user?.id}`);

    await mutate(
      (key: string) => key.startsWith('/api/admin/users'),
      undefined,
      {
        revalidate: false,
      }
    );

    if (activeUser?.id === user?.id) {
      await mutate('/api/user');
    }

    disableLoading();

    return notifications.update({
      autoClose: 3000,
      color: 'green',
      icon: <CheckCircle />,
      id: notification,
      loading: false,
      message: 'Оновлено',
      title: NotificationTitle,
      withCloseButton: true,
    });
  };
  if (!user) {
    return null;
  }
  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <Paper withBorder shadow="md" radius="md" className="py-3">
        <div className="px-4">
          <Title order={2} size="h3">
            ID
          </Title>
          <span className="text-sm">ID користувача</span>
          <TextInput className="mt-3" value={user?.id} readOnly />
        </div>
        <Divider className="my-3" />
        <div className="flex flex-row items-center justify-between px-4">
          <span className="text-sm text-[var(--mantine-color-gray-5)]">
            ID не може бути змінено
          </span>
        </div>
      </Paper>
      <Paper withBorder shadow="md" radius="md" className="py-3">
        <div className="px-4">
          <Title order={2} size="h3">
            E-mail
          </Title>
          <span className="text-sm">E-mail користувача</span>
          <TextInput className="mt-3" value={user?.email} readOnly />
        </div>
        <Divider className="my-3" />
        <div className="flex flex-row items-center justify-between px-4">
          <span className="text-sm text-[var(--mantine-color-gray-5)]">
            E-mail не може бути змінено
          </span>
        </div>
      </Paper>
      <Paper withBorder shadow="md" radius="md" className="py-3">
        <div className="px-4">
          <Title order={2} size="h3">
            Повне ім&apos;я
          </Title>
          <span className="text-sm">Повне ім&apos;я користувача</span>
          <TextInput
            className="mt-3"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateFullname();
            }}
            maxLength={100}
          />
          <span className="block text-right text-xs text-[var(--mantine-color-gray-5)]">
            {fullname.length}/100
          </span>
        </div>
        <Divider className="my-3" />
        <div className="flex flex-row items-center justify-between px-4">
          <span className="text-sm text-[var(--mantine-color-gray-5)]">
            Максимум 100 символів
          </span>
          <Button onClick={updateFullname} loading={loading}>
            Зберегти
          </Button>
        </div>
      </Paper>
    </div>
  );
}
