'use client';

import { Divider, Switch } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import IUser, { Permission } from '@/interfaces/User';
import verifyPermission from '@/libs/verify-permission';

interface IPermission {
  id: Permission;
  title: string;
  description: string;
  disabled: boolean;
}

const NotificationTitle = 'Керування користувачем';

export default function UserPermissionsTab({ user }: { user?: IUser }) {
  const { mutate } = useSWRConfig();
  const { data: activeUser } = useSWR<IUser>(`/api/user`);

  const permissionsData: (IPermission | null)[] = useMemo(
    () => [
      {
        description: 'Повні права',
        disabled: true,
        id: 'SuperAdmin',
        title: 'Супер-адмін',
      },
      {
        description: 'Доступ до адмін-панелі',
        disabled: !verifyPermission(user?.permissions ?? [], 'SuperAdmin'),
        id: 'Admin',
        title: 'Адмін',
      },
      null,
      {
        description: 'Доступ до замовлень менеджера',
        disabled: false,
        id: 'Manager',
        title: 'Менеджер',
      },
      {
        description: 'Доступ до замовлень всіх менеджерів',
        disabled: false,
        id: 'ManagerAllOrders',
        title: 'Всі замовлення менеджерів',
      },
      {
        description: 'Доступ до фінансових показників',
        disabled: false,
        id: 'ManagerFinance',
        title: 'Фінансові показники менеджера',
      },
    ],
    [user]
  );

  const updatePermission = async (permissionKey: string, value: boolean) => {
    const notification = notifications.show({
      autoClose: false,
      loading: true,
      message: 'Оновлення прав...',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const response = await axios
      .post(`/api/user/${user?.id}/permissions`, {
        key: permissionKey,
        value,
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
    await mutate(`/api/user/${user?.id}`);

    if (!response || response.status !== 200) return null;

    if (activeUser?.id === user?.id) {
      await mutate('/api/user');
    }

    await mutate(
      (key: string) => key.startsWith('/api/admin/users'),
      undefined,
      {
        revalidate: false,
      }
    );

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
      {permissionsData.map((e) => (
        <div key={e?.id ?? nanoid()}>
          {e ? (
            <Switch
              key={e.id}
              label={e.title}
              description={e.description}
              disabled={e.disabled}
              defaultChecked={user?.permissions.includes(e.id)}
              onChange={(event) =>
                updatePermission(e.id, event.currentTarget.checked)
              }
              size="md"
            />
          ) : (
            <Divider />
          )}
        </div>
      ))}
    </div>
  );
}
