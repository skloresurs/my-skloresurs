'use client';

import { ActionIcon, Button, Divider, Flex, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { map, startsWith } from 'lodash';
import { CheckCircle, PlusCircle, Save, XCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { z } from 'zod';

import { IUserMeRequest, IUserRequest } from '@/types/User';

const NotificationTitle = 'Керування користувачем';

const formSchema = z
  .object({
    ips: z
      .object({
        ip: z
          .string({ required_error: '' })
          .min(1, 'Обов`язкове поле')
          .ip({ message: 'Некоректний IP-адрес', version: 'v4' }),
        key: z.string({ required_error: '' }),
      })
      .strict()
      .array(),
  })
  .strict();

export default function UserSecurityTab({ user }: { user?: IUserRequest }) {
  const { mutate } = useSWRConfig();
  const { data: activeUser } = useSWR<IUserMeRequest>(`/api/user`);
  const [loading, { open: enableLoading, close: disableLoading }] = useDisclosure();
  const form = useForm({
    initialValues: {
      ips: map(user?.allowed_ips, (e) => ({ ip: e, key: nanoid() })) ?? [],
    },
    validate: zodResolver(formSchema),
  });

  const updateIps = async () => {
    if (form.validate().hasErrors) {
      return null;
    }
    enableLoading();

    const notification = notifications.show({
      autoClose: false,
      loading: true,
      message: 'Оновлення IP-адрес',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const response = await axios
      .post(`/api/user/${user?.id}/ip`, {
        ip: map(form.values.ips, 'ip'),
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

    if (!response || response.status !== 200) return disableLoading();
    await mutate(`/api/user/${user?.id}`);

    await mutate((key: string) => startsWith(key, '/api/admin/users'), undefined, {
      revalidate: false,
    });

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
    <form onSubmit={form.onSubmit(updateIps)}>
      <Stack maw={576}>
        <Paper withBorder shadow='md' radius='md' p='md'>
          <Stack gap='xs'>
            <Title order={2} size='h3'>
              Дозволені IP адреси
            </Title>
            <Text size='sm'>Список дозволених IP адрес для входу в систему</Text>
            {form.values.ips.length === 0 && (
              <Text ta='center' fw={500}>
                Не вказано жодної ip адреси. Вхід дозволено з будь-якого IP
              </Text>
            )}
            <Stack gap='4px'>
              {map(form.values.ips, (_, i) => (
                <Group key={nanoid(i)} gap='xs'>
                  <TextInput {...form.getInputProps(`ips.${i}.ip`)} placeholder='127.0.0.1' className='flex-1' />
                  <ActionIcon color='red' variant='subtle' onClick={() => form.removeListItem('ips', i)}>
                    <XCircle />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
            {form.errors.ips && (
              <Text c='red' size='sm' ta='center'>
                {form.errors.ips}
              </Text>
            )}
            <Flex justify='end'>
              <Button
                onClick={() => form.insertListItem('ips', { ip: '', key: nanoid() })}
                color='green'
                leftSection={<PlusCircle size={20} />}
              >
                Додати
              </Button>
            </Flex>
            <Divider />
            <Flex justify='end' align='center' gap='xs'>
              <Button onClick={updateIps} loading={loading} leftSection={<Save size={20} />}>
                Зберегти
              </Button>
            </Flex>
          </Stack>
        </Paper>
      </Stack>
    </form>
  );
}
