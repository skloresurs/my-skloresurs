'use client';

import { redirect } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import { IUserMeRequest } from '@/types/User';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useSWR<IUserMeRequest>(`/api/user`);

  if (user) {
    redirect('/');
  }

  return children;
}
