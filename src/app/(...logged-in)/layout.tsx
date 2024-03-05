'use client';

import { notifications } from '@mantine/notifications';
import { deleteCookie, getCookie } from 'cookies-next';
import { XCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import { IUserMeRequest } from '@/types/User';

const NotificationTitle = 'Вихід';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useSWR<IUserMeRequest>(`/api/user`);

  const errorCookie = getCookie('oauth_error');
  if (errorCookie) {
    notifications.show({
      autoClose: 3000,
      color: 'red',
      icon: <XCircle />,
      message: errorCookie,
      title: NotificationTitle,
      withCloseButton: true,
    });
    deleteCookie('oauth_error');
  }

  if (!user) {
    redirect('/login');
  }

  return children;
}
