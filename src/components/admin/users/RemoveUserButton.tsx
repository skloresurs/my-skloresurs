'use client';

import { ActionIcon, Button, Flex, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { Trash } from 'lucide-react';
import React, { memo, useCallback } from 'react';
import useSWR, { mutate } from 'swr';

import { errorNotificationProps, loadingNotificationProps, successNotificationProps } from '@/components/Notification';
import { mutateAdminUsersList } from '@/libs/mutate';
import { IUserMeRequest, IUserRequest } from '@/types/User';

const NotificationTitle = 'Керування користувачами';

interface IProps {
  user: IUserRequest;
  params: string;
}

function RemoveUserButton({ user, params }: IProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: me } = useSWR<IUserMeRequest>(`/api/user`);
  const DeleteUser = useCallback(async () => {
    close();
    const notification = notifications.show({
      message: 'Видалення користувача...',
      title: NotificationTitle,
      ...loadingNotificationProps,
    });
    const response = await axios.delete(`/api/user/${user.id}`).catch((error) => {
      notifications.update({
        id: notification,
        message: error.response?.data.error ?? error.message ?? 'Невідома помилка',
        title: NotificationTitle,
        ...errorNotificationProps,
      });
    });

    if (!response || response.status !== 200) return null;
    await mutateAdminUsersList();
    mutate(`/api/users?${params}`);

    return notifications.update({
      id: notification,
      message: 'Оновлено',
      title: NotificationTitle,
      ...successNotificationProps,
    });
  }, [params, close, user]);
  return (
    <>
      <Modal opened={opened} onClose={close} size='auto' title='Видалення аккаунта' centered>
        <Text>Ви дійсно хочете видалити аккаунт {user.fullname}?</Text>
        <Flex gap='sm' justify='space-between' align='center' mt='md'>
          <Button onClick={close}>Скасувати</Button>
          <Button color='red' onClick={DeleteUser}>
            Видалити
          </Button>
        </Flex>
      </Modal>
      <ActionIcon variant='subtle' color='red' disabled={me?.id === user.id} onClick={open}>
        <Trash />
      </ActionIcon>
    </>
  );
}

export default memo(RemoveUserButton);
