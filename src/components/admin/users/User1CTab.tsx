'use client';

import { Button, Divider, Paper, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { z } from 'zod';

import IUser from '@/interfaces/User';

const NotificationTitle = 'Керування користувачем';

const idSchema = z.string().uuid();

export default function User1CTab({ user }: { user?: IUser }) {
  const { mutate } = useSWRConfig();
  const { data: activeUser } = useSWR<IUser>(`/api/user`);
  const [data, setData] = useState({
    main: '',
    secondary: '',
  });

  useEffect(() => {
    setData({
      main: user?.id_1c_main ?? '',
      secondary: user?.id_1c_secondary ?? '',
    });
  }, [user]);

  const updateID = async (route: string, id: string) => {
    const verify = idSchema.safeParse(id);
    if (!verify.success && id !== '') {
      return notifications.show({
        autoClose: 3000,
        color: 'red',
        icon: <XCircle />,
        message: 'Некоректний формат ID',
        title: NotificationTitle,
        withCloseButton: true,
      });
    }
    const notification = notifications.show({
      autoClose: false,
      loading: true,
      message: 'Оновлення ID...',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const response = await axios
      .post(`/api/user/${user?.id}/1c/${route}`, {
        id,
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

    if (!response || response.status !== 200) return null;
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
  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <Paper withBorder shadow="md" radius="md" className="py-3">
        <div className="px-4">
          <Title order={2} size="h3">
            ID користувача 1С (main)
          </Title>
          <span className="text-sm">ID користувача в основній системі 1С</span>
          <TextInput
            className="mt-3"
            value={data.main}
            placeholder={user?.id_1c_main ? '' : 'Не вказано'}
            onChange={(e) => setData({ ...data, main: e.target.value })}
          />
        </div>
        <Divider className="my-3" />
        <div className="flex flex-row items-center justify-between px-4">
          <span className="text-sm text-[var(--mantine-color-dark-2)]">
            ID повинен бути типу UUID
          </span>
          <Button onClick={() => updateID('main', data.main)}>Оновити</Button>
        </div>
      </Paper>
      <Paper withBorder shadow="md" radius="md" className="py-3">
        <div className="px-4">
          <Title order={2} size="h3">
            ID користувача 1С (secondary)
          </Title>
          <span className="text-sm">
            ID користувача в додатковій системі 1С (тимчасово вимкнено)
          </span>
          <TextInput
            className="mt-3"
            value={data.secondary}
            placeholder={user?.id_1c_secondary ? '' : 'Не вказано'}
            onChange={(e) => setData({ ...data, secondary: e.target.value })}
            readOnly
          />
        </div>
        <Divider className="my-3" />
        <div className="flex flex-row items-center justify-between px-4">
          <span className="text-sm text-[var(--mantine-color-dark-2)]">
            ID повинен бути типу UUID
          </span>
          <Button
            onClick={() => updateID('secondary', data.secondary)}
            disabled
          >
            Оновити
          </Button>
        </div>
      </Paper>
    </div>
  );
}
