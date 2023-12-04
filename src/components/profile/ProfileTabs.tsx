'use client';

import { Tabs } from '@mantine/core';
import { Fingerprint, Info, Shield } from 'lucide-react';
import React, { ReactNode } from 'react';

import ProfileTabInfo from './ProfileTabInfo';
import ProfileTabSecurity from './ProfileTabSecurity';

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
    content: <div />,
    key: 'sessions',
  },
] as const;
export default function ProfileTabs() {
  return (
    <Tabs defaultValue="info">
      <Tabs.List>
        <Tabs.Tab value="info" leftSection={<Info size={18} />}>
          Інформація
        </Tabs.Tab>
        <Tabs.Tab value="security" leftSection={<Shield size={18} />}>
          Безпека
        </Tabs.Tab>
        <Tabs.Tab
          value="sessions"
          leftSection={<Fingerprint size={18} />}
          disabled
        >
          Сесії
        </Tabs.Tab>
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Panel key={tab.key} value={tab.key} className="mt-3">
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
