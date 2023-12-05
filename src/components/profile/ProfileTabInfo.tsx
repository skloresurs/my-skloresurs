'use client';

import { Button, Divider, Paper, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

import IUser from '@/types/User';

const NotificationTitle = 'Оновлення профілю';

export default function ProfileTabInfo() {
  const { data: user, mutate } = useSWR<IUser>(`/api/user`);
  const [fullname, setFullName] = useState('');
  const [loading, { open: enableLoading, close: disableLoading }] =
    useDisclosure();

  useEffect(() => {
    if (user) {
      setFullName(user?.fullname ?? '');
    }
  }, [user]);

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
      .post('/api/profile/fullname', {
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
    mutate();

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

  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <Paper withBorder shadow="md" radius="md" className="py-3">
        <div className="px-4">
          <Title order={2} size="h3">
            ID
          </Title>
          <span className="text-sm">Ваш ID</span>
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
          <span className="text-sm">
            Ваш E-mail. Використовується для входу та оформлення замовлень
          </span>
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
          <span className="text-sm">
            Ваше повне ім&apos;я. Використовується для оформлення замовлень
          </span>
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
