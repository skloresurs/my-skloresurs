'use client';

import { ActionIcon, Avatar, Center, Flex, Paper, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import dayjs from 'dayjs';
import { map } from 'lodash';
import { Trash } from 'lucide-react';
import React from 'react';
import useSWR from 'swr';

import { IUserMeRequest } from '@/types/User';

import { errorNotificationProps, loadingNotificationProps, successNotificationProps } from '../Notification';

const NotificationTitle = 'Сесії';

export default function ProfileTabSessions() {
  const { data: user, mutate } = useSWR<IUserMeRequest>(`/api/user`);

  const removeSession = async (id: string) => {
    const notification = notifications.show({
      message: 'Видалення сесій...',
      title: NotificationTitle,
      ...loadingNotificationProps,
    });

    const response = await axios.delete(`/api/sessions/${id}`).catch((error) => {
      notifications.update({
        id: notification,
        message: error.response?.data.error ?? error.message ?? 'Невідома помилка',
        title: NotificationTitle,
        ...errorNotificationProps,
      });
    });

    await mutate();

    if (!response || response.status !== 200) return;
    notifications.update({
      id: notification,
      message: 'Сесія видалена',
      title: NotificationTitle,
      ...successNotificationProps,
    });
  };
  return (
    <Stack gap='md' maw='576px'>
      {map(user?.sessions, (e) => (
        <Paper key={e.id} withBorder p='md' radius='md' c={e.id === user?.thisSession ? 'green' : ''}>
          <Flex gap='sm' align='center'>
            <Center p='xs' bg='dark.6' maw='48px' mah='48px' className='rounded-full'>
              <Avatar radius='xs' size='sm' src={`https://cdn.simpleicons.org/${e.os}`} />
            </Center>
            <Flex justify='center' align='flex-start' direction='column'>
              <Title order={2} size='h5'>
                {e.browser} <span className={e.id === user?.thisSession ? '' : 'hidden'}>(ця сесія)</span>
              </Title>
              <Text size='sm' c='dimmed'>
                {dayjs(e.created_at).format('DD.MM.YYYY HH:mm')}
              </Text>
            </Flex>
            <div className='flex-1' />
            <ActionIcon
              variant='transparent'
              aria-label='Remove session'
              color='red'
              onClick={() => removeSession(e.id)}
            >
              <Trash />
            </ActionIcon>
          </Flex>
        </Paper>
      ))}
    </Stack>
  );
}
