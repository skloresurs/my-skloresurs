'use client';

import { ScrollArea, Tabs, Title } from '@mantine/core';
import { BookKey, Boxes, Fingerprint, Info, Key, Shield } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ReactNode, useMemo } from 'react';
import useSWR from 'swr';

import User1CTab from '@/components/admin/users/User1CTab';
import UserInfoTab from '@/components/admin/users/UserInfoTab';
import UserPermissionsTab from '@/components/admin/users/UserPermissionsTab';
import UserSecurityTab from '@/components/admin/users/UserSecurityTab';
import UserSessionsTab from '@/components/admin/users/UserSessionsTab';
import LoadingOverlay from '@/components/LoadingOverlay';
import TitleBar from '@/components/TitleBar';
import IUser from '@/types/User';

const defaultProps = {
  backHref: '/admin/users',
};

interface Tab {
  key: string;
  content: ReactNode;
}

export default function UserSettingsPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    data: user,
    error,
    isValidating,
  } = useSWR<IUser>(`/api/user/${params.id}`);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'info';

  const tabs: readonly Tab[] = useMemo(
    () =>
      [
        {
          content: <UserInfoTab user={user} />,
          key: 'info',
        },
        {
          content: <UserPermissionsTab user={user} />,
          key: 'permissions',
        },
        {
          content: <UserSessionsTab user={user} />,
          key: 'sessions',
        },
        {
          content: <User1CTab user={user} />,
          key: '1c',
        },
        {
          content: <div />,
          key: 'orders',
        },
        {
          content: <UserSecurityTab user={user} />,
          key: 'security',
        },
      ] as const,
    [user]
  );

  if (isValidating)
    return (
      <>
        <TitleBar title="Керування користувачем" {...defaultProps} />
        <div className="relative h-[400px] w-full">
          <LoadingOverlay />
        </div>
      </>
    );

  if (error) {
    if (error.response?.status === 404) {
      return (
        <>
          <TitleBar title="Керування користувачем" {...defaultProps} />
          <Title order={2}>Користувача не знайдено</Title>
        </>
      );
    }
    return (
      <>
        <TitleBar title="Керування користувачем" {...defaultProps} />
        <Title order={2}>невідома помилка</Title>
      </>
    );
  }

  return (
    <>
      <TitleBar
        title={`Керування користувачем ${user?.fullname}`}
        {...defaultProps}
      />
      <Tabs
        value={activeTab}
        onChange={(key) => router.push(`/admin/users/${user?.id}?tab=${key}`)}
      >
        <ScrollArea type="never">
          <Tabs.List className="flex-nowrap">
            <Tabs.Tab value="orders" leftSection={<Boxes size={18} />} disabled>
              Замовлення
            </Tabs.Tab>
            <Tabs.Tab value="info" leftSection={<Info size={18} />}>
              Інформація
            </Tabs.Tab>
            <Tabs.Tab value="1c" leftSection={<BookKey size={18} />}>
              1С
            </Tabs.Tab>
            <Tabs.Tab value="permissions" leftSection={<Key size={18} />}>
              Права
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<Shield size={18} />}>
              Безпека
            </Tabs.Tab>
            <Tabs.Tab value="sessions" leftSection={<Fingerprint size={18} />}>
              Сесії
            </Tabs.Tab>
          </Tabs.List>
        </ScrollArea>

        {tabs.map((tab) => (
          <Tabs.Panel key={tab.key} value={tab.key} className="mt-3">
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
}
