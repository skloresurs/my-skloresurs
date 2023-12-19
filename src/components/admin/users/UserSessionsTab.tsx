'use client';

import { ActionIcon, Paper, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { Trash, XCircle } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { IUserMeRequest, IUserRequest } from '@/types/User';

const NotificationTitle = 'Сесії';

export default function UserSessionsTab({ user }: { user?: IUserRequest }) {
  const { mutate } = useSWRConfig();
  const { data: activeUser } = useSWR<IUserMeRequest>(`/api/user`);

  const removeSession = async (id: string) => {
    const notification = notifications.show({
      autoClose: false,
      loading: true,
      message: 'Видалення сесій...',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const response = await axios.delete(`/api/sessions/${id}`).catch((error) => {
      notifications.update({
        autoClose: 3000,
        color: 'red',
        icon: <XCircle />,
        id: notification,
        loading: false,
        message: error.response?.data.error ?? error.message ?? 'Невідома помилка',
        title: NotificationTitle,
        withCloseButton: true,
      });
    });

    if (activeUser?.id === user?.id) await mutate('/api/user');
    await mutate(`/api/user/${user?.id}`);

    if (!response || response.status !== 200) return;
    notifications.update({
      autoClose: 3000,
      color: 'green',
      icon: <XCircle />,
      id: notification,
      loading: false,
      message: 'Сесія видалена',
      title: NotificationTitle,
      withCloseButton: true,
    });
  };

  if (user?.sessions?.length === 0) {
    return (
      <Title order={2} className='mt-3 text-center'>
        Не знайдено жодної сесії
      </Title>
    );
  }
  return (
    <div className='flex max-w-xl flex-col gap-3'>
      {user?.sessions?.map((e) => (
        <Paper key={e.id} withBorder className='flex w-full flex-row items-center gap-3' p='md' radius='md'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[var(--mantine-color-dark-6)] p-2'>
            <Image width={24} height={24} src={`https://cdn.simpleicons.org/${e.os}`} alt={e.os} />
          </div>
          <div className='flex flex-col'>
            <Title order={2} size='h5'>
              {e.browser}
            </Title>
            <span className='text-sm text-[var(--mantine-color-gray-5)] '>
              {moment(e.created_at).format('DD.MM.YYYY HH:mm')}
            </span>
          </div>
          <div className='flex-1' />
          <ActionIcon variant='transparent' aria-label='Remove session' color='red' onClick={() => removeSession(e.id)}>
            <Trash />
          </ActionIcon>
        </Paper>
      ))}
    </div>
  );
}
