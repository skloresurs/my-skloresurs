'use client';

import React from 'react';
import useSWR from 'swr';

import AppShell from '@/components/AppShell';
import ErrorPage from '@/components/ErrorPage';
import verifyPermission from '@/libs/verify-permission';
import IUser from '@/types/User';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useSWR<IUser>(`/api/user`);

  if (!user || !verifyPermission(user.permissions, 'Admin'))
    return (
      <ErrorPage
        code={403}
        title="Доступ заборонено"
        description="У вас недостатньо прав для відображення цієї сторінки"
        buttonLabel="На головну"
        buttonLink="/"
      />
    );

  return <AppShell>{children}</AppShell>;
}
