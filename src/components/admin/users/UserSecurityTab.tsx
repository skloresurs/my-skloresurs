'use client';

import { ActionIcon, Button, Divider, Paper, Text, TextInput, Title } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { CheckCircle, PlusCircle, Save, XCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { z } from 'zod';

import { IUserMeRequest, IUserRequest } from '@/types/User';

const NotificationTitle = 'Керування користувачем';

const formSchema = z.object({
  ips: z
    .object({
      ip: z
        .string({ required_error: '' })
        .min(1, 'Обов`язкове поле')
        .ip({ message: 'Некоректний IP-адрес', version: 'v4' }),
      key: z.string({ required_error: '' }),
    })
    .array(),
});

export default function UserSecurityTab({ user }: { user?: IUserRequest }) {
  const { mutate } = useSWRConfig();
  const { data: activeUser } = useSWR<IUserMeRequest>(`/api/user`);
  const [loading, { open: enableLoading, close: disableLoading }] = useDisclosure();
  const form = useForm({
    initialValues: {
      ips: user?.ip?.map((e) => ({ ip: e, key: nanoid() })) ?? [],
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
        ip: form.values.ips.map((e) => e.ip),
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

    await mutate((key: string) => key.startsWith('/api/admin/users'), undefined, {
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
    <form onSubmit={form.onSubmit(updateIps)} className='flex w-full max-w-xl flex-col gap-5'>
      <Paper withBorder shadow='md' radius='md' className='py-3'>
        <div className='px-4'>
          <Title order={2} size='h3'>
            Дозволені IP адреси
          </Title>
          <span className='text-sm'>Список дозволених IP адрес для входу в систему</span>
          {form.values.ips.length === 0 && (
            <Title order={3} size='h5' className='text-center'>
              Не вказано жодної ip адреси. Вхід дозволено з будь-якого IP
            </Title>
          )}
          <div className='flex flex-col gap-1'>
            {form.values.ips.map((ip, i) => (
              <div key={ip.key} className='flex flex-row items-center gap-2'>
                <TextInput {...form.getInputProps(`ips.${i}.ip`)} className='w-full' />
                <ActionIcon color='red' variant='subtle' onClick={() => form.removeListItem('ips', i)}>
                  <XCircle />
                </ActionIcon>
              </div>
            ))}
          </div>
          {form.errors.ips && (
            <Text c='red' size='sm' className='mt-2 text-center'>
              {form.errors.ips}
            </Text>
          )}
          <div className='mt-2 flex flex-row items-center justify-end'>
            <Button
              onClick={() => form.insertListItem('ips', { ip: '', key: nanoid() })}
              color='green'
              leftSection={<PlusCircle size={20} />}
            >
              Додати
            </Button>
          </div>
        </div>
        <Divider className='my-3' />
        <div className='flex flex-row items-center justify-between px-4'>
          <span className='text-sm text-[var(--mantine-color-gray-5)]'>Це не вплине на активні сесії!</span>
          <Button onClick={updateIps} loading={loading} leftSection={<Save size={20} />}>
            Зберегти
          </Button>
        </div>
      </Paper>
    </form>
  );
}
