'use client';

import {
  Button,
  Divider,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { XCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import useSWR from 'swr';

import IUser from '@/types/User';

const NotificationTitle = 'Оновлення профілю';

export default function ProfileTabSecurity() {
  const { data: user, mutate } = useSWR<IUser>('/api/user');
  const [password, setPassword] = useState<{ new: string; confirm: string }>({
    confirm: '',
    new: '',
  });

  const changePassword = async () => {
    if (password.new !== password.confirm) {
      return notifications.show({
        autoClose: 3000,
        color: 'red',
        icon: <XCircle />,
        message: 'Паролі не співпадають',
        title: NotificationTitle,
        withCloseButton: true,
      });
    }

    const notification = notifications.show({
      autoClose: false,
      loading: true,
      message: 'Оновлення пароля...',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const response = await axios
      .post('/api/profile/password', {
        password: password.new,
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
    mutate();
    return notifications.update({
      autoClose: 3000,
      color: 'green',
      icon: <XCircle />,
      id: notification,
      loading: false,
      message: 'Пароль оновлено',
      title: NotificationTitle,
      withCloseButton: true,
    });
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <Paper withBorder shadow="md" radius="md" className="py-3">
        <div className="px-4">
          <Title order={2} size="h3">
            Зміна пароля
          </Title>
          <span className="text-sm">
            Після зміни пароля, ви вийдете зі всіх своїх девайсів
          </span>
          <PasswordInput
            className="mt-3"
            value={password.new}
            onChange={(e) => setPassword({ ...password, new: e.target.value })}
            disabled={user?.account_type !== 'Default'}
          />
          <PasswordInput
            className="mt-3"
            value={password.confirm}
            onChange={(e) =>
              setPassword({ ...password, confirm: e.target.value })
            }
            disabled={user?.account_type !== 'Default'}
          />
        </div>
        <Divider className="my-3" />
        <div className="flex flex-row items-center justify-between px-4">
          <span className="text-sm text-[var(--mantine-color-gray-5)]">
            {user?.account_type === 'Default'
              ? ''
              : 'Недоступно для oAuth аккаунтів'}
          </span>
          <Button
            onClick={changePassword}
            disabled={user?.account_type !== 'Default'}
          >
            Змінити
          </Button>
        </div>
      </Paper>
      <Paper withBorder shadow="md" radius="md" className="py-3">
        <div className="px-4">
          <Title order={2} size="h3">
            Дозволені IP адреси
          </Title>
          <span className="text-sm">
            Список дозволених IP адрес для використання вашого аккаунту
          </span>
          {user?.ip.length === 0 && (
            <Title order={3} size="h5" className="text-center">
              Не вказано жодної ip адреси. Вхід дозволено з будь-якого IP
            </Title>
          )}
          <div className="flex flex-col gap-1">
            {user?.ip.map((ip) => (
              <div key={nanoid()} className="flex flex-row items-center gap-2">
                <TextInput value={ip} readOnly className="w-full" />
              </div>
            ))}
          </div>
        </div>
        <Divider className="my-3" />
        <div className="flex flex-row items-center justify-between px-4">
          <span className="text-sm text-[var(--mantine-color-gray-5)]">
            Зазвичай не вказано жодної ip адреси
          </span>
        </div>
      </Paper>
    </div>
  );
}
