'use client';

import { redirect, useRouter } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import AppShell from '@/components/AppShell';
import ErrorPage from '@/components/ErrorPage';
import verifyPermission from '@/libs/verify-permission';
import { IUserMeRequest } from '@/types/User';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useSWR<IUserMeRequest>(`/api/user`);
  const router = useRouter();

  if (!user) {
    redirect('/login');
  }

  if (!verifyPermission(user.permissions, 'Driver'))
    return (
      <ErrorPage
        code={403}
        title='Доступ заборонено'
        description='У вас недостатньо прав для відображення цієї сторінки'
        buttonLabel='На головну'
        onClick={() => router.push('/')}
      />
    );

  return <AppShell>{children}</AppShell>;
}
