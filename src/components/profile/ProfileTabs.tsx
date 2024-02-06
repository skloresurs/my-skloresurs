'use client';

import { Tabs } from '@mantine/core';
import { map } from 'lodash';
import { Fingerprint, Info, Link, Shield } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ReactNode } from 'react';

import ProfileTabInfo from './ProfileTabInfo';
import ProfileTabLink from './ProfileTabLink';
import ProfileTabSecurity from './ProfileTabSecurity';
import ProfileTabSessions from './ProfileTabSessions';

interface Tab {
  key: string;
  content: ReactNode;
}

const tabs: readonly Tab[] = [
  {
    content: <ProfileTabInfo />,
    key: 'info',
  },
  {
    content: <ProfileTabSecurity />,
    key: 'security',
  },
  {
    content: <ProfileTabSessions />,
    key: 'sessions',
  },
  {
    content: <ProfileTabLink />,
    key: 'link',
  },
] as const;

export default function ProfileTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') ?? 'info';
  return (
    <Tabs value={activeTab} onChange={(value) => router.push(`/profile?tab=${value}`)}>
      <Tabs.List>
        <Tabs.Tab value='info' leftSection={<Info size={20} />}>
          Інформація
        </Tabs.Tab>
        <Tabs.Tab value='security' leftSection={<Shield size={20} />}>
          Безпека
        </Tabs.Tab>
        <Tabs.Tab value='link' leftSection={<Link size={20} />}>
          Зв&apos;язані аккаунти
        </Tabs.Tab>
        <Tabs.Tab value='sessions' leftSection={<Fingerprint size={20} />}>
          Сесії
        </Tabs.Tab>
      </Tabs.List>

      {map(tabs, (tab) => (
        <Tabs.Panel key={tab.key} value={tab.key} className='mt-3'>
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
