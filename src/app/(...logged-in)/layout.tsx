'use client';

import { redirect } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import AppShell from '@/components/AppShell';
import IUser from '@/interfaces/User';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useSWR<IUser>(`/api/user`);

  if (!user) {
    redirect('/login');
  }

  return <AppShell>{children}</AppShell>;
}
