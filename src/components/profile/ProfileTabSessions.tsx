'use client';

import { ActionIcon, Paper, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { CheckCircle, Trash, XCircle } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React from 'react';
import useSWR, { useSWRConfig } from 'swr';

import ISession from '@/types/Session';

import LoadingOverlay from '../LoadingOverlay';

const NotificationTitle = 'Сесії';

interface Response {
  sessions: ISession[];
  thisSession: string;
}

export default function ProfileTabSessions() {
  const { mutate } = useSWRConfig();
  const { data, isValidating } = useSWR<Response>('/api/sessions');
  if (isValidating) {
    return (
      <div className="relative mt-3 h-[400px] w-full">
        <LoadingOverlay />
      </div>
    );
  }

  const removeSession = async (id: string) => {
    const notification = notifications.show({
      autoClose: false,
      loading: true,
      message: 'Видалення сесій...',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const response = await axios
      .delete(`/api/sessions/${id}`)
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

    await mutate('/api/user');
    await mutate('/api/sessions');

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
    <div className="flex max-w-xl flex-col gap-3">
      {data?.sessions.map((e) => (
        <Paper
          key={e.id}
          withBorder
          className="flex w-full flex-row items-center gap-3"
          p="md"
          radius="md"
          c={e.id === data.thisSession ? 'green' : ''}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--mantine-color-dark-6)] p-2">
            <Image
              width={24}
              height={24}
              src={`https://cdn.simpleicons.org/${e.os}`}
              alt={e.os}
            />
          </div>
          <div className="flex flex-col">
            <Title order={2} size="h5">
              {e.browser}{' '}
              <span className={e.id === data.thisSession ? '' : 'hidden'}>
                (ця сесія)
              </span>
            </Title>
            <span className="text-sm text-[var(--mantine-color-gray-5)] ">
              {moment(e.created_at).format('DD.MM.YYYY HH:mm')}
            </span>
          </div>
          <div className="flex-1" />
          <ActionIcon
            variant="transparent"
            aria-label="Remove session"
            color="red"
            onClick={() => removeSession(e.id)}
          >
            <Trash />
          </ActionIcon>
        </Paper>
      ))}
    </div>
  );
}
