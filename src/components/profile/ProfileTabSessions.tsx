'use client';

import { ActionIcon, Paper, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { map } from 'lodash';
import { CheckCircle, Trash, XCircle } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React from 'react';
import useSWR from 'swr';

import { IUserMeRequest } from '@/types/User';

const NotificationTitle = 'Сесії';

export default function ProfileTabSessions() {
  const { data: user, mutate } = useSWR<IUserMeRequest>(`/api/user`);

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

    await mutate();

    if (!response || response.status !== 200) return;
    notifications.update({
      autoClose: 3000,
      color: 'green',
      icon: <CheckCircle />,
      id: notification,
      loading: false,
      message: 'Сесія видалена',
      title: NotificationTitle,
      withCloseButton: true,
    });
  };
  return (
    <div className='flex max-w-xl flex-col gap-3'>
      {map(user?.sessions, (e) => (
        <Paper
          key={e.id}
          withBorder
          className='flex w-full flex-row items-center gap-3'
          p='md'
          radius='md'
          c={e.id === user?.thisSession ? 'green' : ''}
        >
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[var(--mantine-color-dark-6)] p-2'>
            <Image width={24} height={24} src={`https://cdn.simpleicons.org/${e.os}`} alt={e.os} />
          </div>
          <div className='flex flex-col'>
            <Title order={2} size='h5'>
              {e.browser} <span className={e.id === user?.thisSession ? '' : 'hidden'}>(ця сесія)</span>
            </Title>
            <span className='text-sm text-[var(--mantine-color-dimmed)] '>
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
