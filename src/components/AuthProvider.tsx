'use client';

import React from 'react';
import useSWR from 'swr';

import LoadingOverlay from '@/components/LoadingOverlay';
import IUser from '@/types/User';

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isLoading, isValidating } = useSWR<IUser>(`/api/user`);

  if (isLoading || isValidating) return <LoadingOverlay />;

  return children;
}
