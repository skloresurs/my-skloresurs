"use client";

import { ScrollArea, Tabs, Title } from "@mantine/core";
import { map } from "lodash";
import { Activity, BookKey, Boxes, Fingerprint, Info, Key, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useMemo } from "react";
import useSWR from "swr";

import LoadingOverlay from "@/components/LoadingOverlay";
import TitleBar from "@/components/TitleBar";
import User1CTab from "@/components/admin/users/User1CTab";
import UserActivityTab from "@/components/admin/users/UserActivityTab";
import UserInfoTab from "@/components/admin/users/UserInfoTab";
import UserPermissionsTab from "@/components/admin/users/UserPermissionsTab";
import UserSecurityTab from "@/components/admin/users/UserSecurityTab";
import UserSessionsTab from "@/components/admin/users/UserSessionsTab";
import type { IUserRequest } from "@/types/User";

interface Tab {
  key: string;
  content: ReactNode;
}

export default function UserSettingsPage({ params }: { params: { id: string } }) {
  const { data: user, error, isValidating } = useSWR<IUserRequest>(`/api/user/${params.id}`);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "info";

  const tabs: readonly Tab[] = useMemo(
    () =>
      [
        {
          content: <UserInfoTab user={user} />,
          key: "info",
        },
        {
          content: <UserPermissionsTab user={user} />,
          key: "permissions",
        },
        {
          content: <UserSessionsTab user={user} />,
          key: "sessions",
        },
        {
          content: <User1CTab user={user} />,
          key: "1c",
        },
        {
          content: <div />,
          key: "orders",
        },
        {
          content: <UserSecurityTab user={user} />,
          key: "security",
        },
        {
          content: <UserActivityTab user={user} />,
          key: "activity",
        },
      ] as const,
    [user],
  );

  if (isValidating)
    return (
      <>
        <TitleBar title="Керування користувачем" enableBackButton />
        <div className="relative h-[400px] w-full">
          <LoadingOverlay />
        </div>
      </>
    );

  if (error) {
    if (error.response?.status === 404) {
      return (
        <>
          <TitleBar title="Керування користувачем" enableBackButton />
          <Title order={2}>Користувача не знайдено</Title>
        </>
      );
    }
    return (
      <>
        <TitleBar title="Керування користувачем" enableBackButton />
        <Title order={2}>Невідома помилка</Title>
      </>
    );
  }

  return (
    <>
      <TitleBar title={`Керування користувачем ${user?.fullname}`} enableBackButton />
      <Tabs value={activeTab} onChange={(key) => router.push(`/admin/users/${user?.id}?tab=${key}`)}>
        <ScrollArea type="never">
          <Tabs.List className="flex-nowrap">
            <Tabs.Tab value="orders" leftSection={<Boxes size={20} />} disabled>
              Замовлення
            </Tabs.Tab>
            <Tabs.Tab value="info" leftSection={<Info size={20} />}>
              Інформація
            </Tabs.Tab>
            <Tabs.Tab value="1c" leftSection={<BookKey size={20} />}>
              1С
            </Tabs.Tab>
            <Tabs.Tab value="permissions" leftSection={<Key size={20} />}>
              Права
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<Shield size={20} />}>
              Безпека
            </Tabs.Tab>
            <Tabs.Tab value="sessions" leftSection={<Fingerprint size={20} />}>
              Сесії
            </Tabs.Tab>
            <Tabs.Tab value="activity" leftSection={<Activity size={20} />}>
              Активність
            </Tabs.Tab>
          </Tabs.List>
        </ScrollArea>

        {map(tabs, (tab) => (
          <Tabs.Panel key={tab.key} value={tab.key} className="mt-3">
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
}
