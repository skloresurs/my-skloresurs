'use client';

import { notifications } from '@mantine/notifications';
import { TawkAPI } from '@tawk.to/tawk-messenger-react';
import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { HmacSHA256 } from 'crypto-js';
import { constant, includes, noop } from 'lodash';
import { CheckCircle, XCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import React, { RefObject, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import ErrorPage from '@/components/ErrorPage';
import { env } from '@/env.mjs';
import useSupportStore from '@/stores/support';
import { IUserMeRequest } from '@/types/User';

const NotificationTitle = 'Вихід';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const { data: user } = useSWR<IUserMeRequest>(`/api/user`);
  const { data: ip } = useSWR('https://geolocation-db.com/json/');
  const supportRef = useSupportStore((state) => state.supportRef);

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

  useEffect(() => {
    if ((supportRef as RefObject<TawkAPI>) && supportRef && user) {
      try {
        const hash = HmacSHA256(user.email, env.NEXT_PUBLIC_TAWK_API_KEY).toString();
        supportRef.current?.setAttributes(
          {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            hash,
            userId: user.id,
          },
          noop
        );
      } catch (error) {
        noop();
      }
    }
  }, [supportRef, user]);

  const logout = async () => {
    const notification = notifications.show({
      autoClose: false,
      loading: true,
      message: 'Вихід...',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const response = await axios.post('/api/auth/logout').catch((error) => {
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

    if (!response || response.status !== 200) return;
    await mutate(constant(true), undefined, { revalidate: false });
    mutate('/api/user');

    notifications.update({
      autoClose: 3000,
      color: 'green',
      icon: <CheckCircle />,
      id: notification,
      loading: false,
      message: 'Ви успішно вийшли',
      title: NotificationTitle,
      withCloseButton: true,
    });
  };

  if (!user) {
    redirect('/login');
  }

  if (user.allowed_ips.length > 0 && !includes(user.allowed_ips, ip.IPv4)) {
    return (
      <ErrorPage
        code={403}
        title='Доступ заборонено'
        description='Доступ з цієї IP-адреси заборонено'
        buttonLabel='Вийти'
        onClick={logout}
      />
    );
  }

  return children;
}
