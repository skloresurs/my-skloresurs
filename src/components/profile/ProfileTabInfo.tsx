'use client';

import { Button, Divider, Flex, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

import { IUserMeRequest } from '@/types/User';

import { errorNotificationProps, loadingNotificationProps, successNotificationProps } from '../Notification';

const NotificationTitle = 'Оновлення профілю';

export default function ProfileTabInfo() {
  const { data: user, mutate } = useSWR<IUserMeRequest>(`/api/user`);
  const [fullname, setFullName] = useState('');
  const [loading, { open: enableLoading, close: disableLoading }] = useDisclosure();

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
        message: "Ви не вказали своє повне ім'я",
        title: NotificationTitle,
        ...errorNotificationProps,
      });
    }
    const notification = notifications.show({
      message: 'Оновлення повного імені...',
      title: NotificationTitle,
      ...loadingNotificationProps,
    });

    const response = await axios
      .post('/api/profile/fullname', {
        fullname,
      })
      .catch((error) => {
        notifications.update({
          id: notification,
          message: error.response?.data.error ?? error.message ?? 'Невідома помилка',
          title: NotificationTitle,
          ...errorNotificationProps,
        });
      });

    if (!response || response.status !== 200) return disableLoading();
    mutate();

    disableLoading();
    return notifications.update({
      id: notification,
      message: 'Оновлено',
      title: NotificationTitle,
      ...successNotificationProps,
    });
  };

  return (
    <Stack gap='sm' maw='576'>
      <Paper withBorder shadow='md' radius='md' p='md'>
        <Title order={2} size='h3'>
          ID
        </Title>
        <Text size='sm'>Ваш ID</Text>
        <TextInput mt='sm' value={user?.id} readOnly />
        <Divider my='md' />
        <Text size='sm' c='dimmed'>
          ID не може бути змінено
        </Text>
      </Paper>
      <Paper withBorder shadow='md' radius='md' p='md'>
        <Title order={2} size='h3'>
          E-mail
        </Title>
        <Text size='sm'>Ваш E-mail. Використовується для входу та оформлення замовлень</Text>
        <TextInput mt='sm' value={user?.email} readOnly />
        <Divider my='md' />
        <Text size='sm' c='dimmed'>
          E-mail не може бути змінено
        </Text>
      </Paper>
      <Paper withBorder shadow='md' radius='md' p='md'>
        <Title order={2} size='h3'>
          Повне ім&apos;я
        </Title>
        <Text size='sm'>Ваше повне ім&apos;я. Використовується для оформлення замовлень</Text>
        <TextInput
          className='mt-3'
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateFullname();
          }}
          maxLength={100}
        />
        <Text size='xs' c='dimmed' ta='right'>
          {fullname.length}/100
        </Text>
        <Divider my='md' />
        <Flex justify='space-between' align='center'>
          <Text size='sm' c='dimmed'>
            Максимум 100 символів
          </Text>
          <Button onClick={updateFullname} loading={loading} leftSection={<Save size={20} />}>
            Зберегти
          </Button>
        </Flex>
      </Paper>
    </Stack>
  );
}
