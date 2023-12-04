'use client';

import { Button, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { XCircle } from 'lucide-react';
import React, { useState } from 'react';

const NotificationTitle = 'Підтримка';

export default function Support() {
  const [message, setMessage] = useState('');
  const onSubmit = async () => {
    if (message.length === 0) return null;

    const notification = notifications.show({
      autoClose: false,
      loading: true,
      message: 'Відправка повідомлення...',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const response = await axios
      .post('/api/support', { message })
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

    if (!response || response.status !== 200) return null;

    notifications.update({
      autoClose: 3000,
      color: 'green',
      icon: <XCircle />,
      id: notification,
      loading: false,
      message: 'Ваше повідомлення надіслано',
      title: NotificationTitle,
      withCloseButton: true,
    });

    return setMessage('');
  };

  return (
    <div className="max-w-3xl space-y-4">
      <Textarea
        label="Ваше повідомлення"
        withAsterisk
        autosize
        minRows={2}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={onSubmit} disabled={message.length === 0}>
        Відправити
      </Button>
      <div />
    </div>
  );
}
