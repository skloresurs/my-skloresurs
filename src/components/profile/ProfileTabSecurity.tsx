'use client';

import { Button, Center, Divider, Flex, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { map } from 'lodash';
import { CheckCircle, Pencil, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import useSWR from 'swr';

import { IUserMeRequest } from '@/types/User';

const NotificationTitle = 'Оновлення профілю';

export default function ProfileTabSecurity() {
  const { data: user, mutate } = useSWR<IUserMeRequest>('/api/user');
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
          message: error.response?.data.error ?? error.message ?? 'Невідома помилка',
          title: NotificationTitle,
          withCloseButton: true,
        });
      });

    if (!response || response.status !== 200) return null;
    await mutate();
    return notifications.update({
      autoClose: 3000,
      color: 'green',
      icon: <CheckCircle />,
      id: notification,
      loading: false,
      message: 'Пароль оновлено',
      title: NotificationTitle,
      withCloseButton: true,
    });
  };

  return (
    <Flex direction='column' gap='md' maw='576px'>
      <Paper withBorder shadow='md' radius='md' p='md'>
        <Title order={2} size='h3'>
          Зміна пароля
        </Title>
        <Text size='sm'>Після зміни пароля, ви вийдете зі всіх своїх девайсів</Text>
        <PasswordInput
          mt='sm'
          value={password.new}
          onChange={(e) => setPassword({ ...password, new: e.target.value })}
        />
        <PasswordInput
          mt='sm'
          value={password.confirm}
          onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
        />
        <Divider mt='md' />
        <Flex direction='row-reverse' gap='sm' mt='sm'>
          <Button onClick={changePassword} leftSection={<Pencil size={20} />} color='orange'>
            Змінити
          </Button>
        </Flex>
      </Paper>
      <Paper withBorder shadow='md' radius='md' p='md'>
        <Title order={2} size='h3'>
          Дозволені IP адреси
        </Title>
        <Text size='sm' my='sm'>
          Список дозволених IP адрес для використання вашого аккаунту
        </Text>
        {user?.ip.length === 0 && (
          <Center>
            <Title order={3} size='h5'>
              Не вказано жодної ip адреси. Вхід дозволено з будь-якого IP
            </Title>
          </Center>
        )}
        <Stack gap='xs' my='sm'>
          {map(user?.ip, (ip) => (
            <TextInput key={ip} value={ip} readOnly w='100%' />
          ))}
        </Stack>
        <Divider mt='md' />
        <Text size='sm' c='dimmed'>
          Зазвичай не вказано жодної ip адреси
        </Text>
      </Paper>
    </Flex>
  );
}
