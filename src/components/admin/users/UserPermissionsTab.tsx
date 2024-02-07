'use client';

import { Divider, Stack, Switch } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { includes, map } from 'lodash';
import { nanoid } from 'nanoid';
import React, { memo, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { errorNotificationProps, loadingNotificationProps, successNotificationProps } from '@/components/Notification';
import { mutateAdminUsersList } from '@/libs/mutate';
import verifyPermission from '@/libs/verify-permission';
import { IUserMeRequest, IUserRequest, Permission } from '@/types/User';

interface IPermission {
  id: Permission;
  title: string;
  description: string;
  disabled: boolean;
}

const NotificationTitle = 'Керування користувачем';

function UserPermissionsTab({ user }: { user?: IUserRequest }) {
  const { mutate } = useSWRConfig();
  const { data: activeUser } = useSWR<IUserMeRequest>(`/api/user`);

  const permissionsData: (IPermission | null)[] = useMemo(
    () => [
      {
        id: 'SuperAdmin',
        title: 'Супер-адмін',
        description: 'Повні права',
        disabled: true,
      },
      {
        id: 'Admin',
        title: 'Адмін',
        description: 'Доступ до адмін-панелі',
        disabled: !verifyPermission(activeUser?.permissions ?? [], 'SuperAdmin'),
      },
      null,
      {
        id: 'Manager',
        title: 'Менеджер',
        description: 'Доступ до замовлень менеджера',
        disabled: false,
      },
      {
        id: 'Driver',
        title: 'Водій',
        description: 'Доступ до меню водія',
        disabled: false,
      },
    ],
    [activeUser]
  );

  const updatePermission = async (permissionKey: string, value: boolean) => {
    const notification = notifications.show({
      message: 'Оновлення прав...',
      title: NotificationTitle,
      ...loadingNotificationProps,
    });

    const response = await axios
      .post(`/api/user/${user?.id}/permissions`, {
        key: permissionKey,
        value,
      })
      .catch((error) => {
        notifications.update({
          id: notification,
          message: error.response?.data.error ?? error.message ?? 'Невідома помилка',
          title: NotificationTitle,
          ...errorNotificationProps,
        });
      });

    if (!response || response.status !== 200) return null;

    await mutate(`/api/user/${user?.id}`);

    if (activeUser?.id === user?.id) {
      await mutate('/api/user');
    }

    await mutateAdminUsersList();

    return notifications.update({
      id: notification,
      message: 'Оновлено',
      title: NotificationTitle,
      ...successNotificationProps,
    });
  };

  return (
    <Stack gap='md' maw='576'>
      {map(permissionsData, (e) => (
        <div key={e?.id ?? nanoid()}>
          {e ? (
            <Switch
              key={e.id}
              label={e.title}
              description={e.description}
              disabled={e.disabled}
              defaultChecked={includes(user?.permissions, e.id)}
              onChange={(event) => updatePermission(e.id, event.currentTarget.checked)}
              size='md'
            />
          ) : (
            <Divider />
          )}
        </div>
      ))}
    </Stack>
  );
}

export default memo(UserPermissionsTab);
