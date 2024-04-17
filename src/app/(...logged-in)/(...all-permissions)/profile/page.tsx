import { Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { map } from "lodash";
import { Fingerprint, Info, Link, Shield } from "lucide-react";
import type { ReactNode } from "react";

import TitleBar from "@/components/TitleBar";
import ProfileTabInfo from "@/components/profile/ProfileTabInfo";
import ProfileTabLink from "@/components/profile/ProfileTabLink";
import ProfileTabSecurity from "@/components/profile/ProfileTabSecurity";
import ProfileTabSessions from "@/components/profile/ProfileTabSessions";

type Tab = {
  key: string;
  content: ReactNode;
};

const tabs: readonly Tab[] = [
  {
    content: <ProfileTabInfo />,
    key: "info",
  },
  {
    content: <ProfileTabSecurity />,
    key: "security",
  },
  {
    content: <ProfileTabSessions />,
    key: "sessions",
  },
  {
    content: <ProfileTabLink />,
    key: "link",
  },
] as const;

export default function Profile() {
  return (
    <>
      <TitleBar title="Профіль" />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTab value="info" leftSection={<Info size={20} />}>
            Інформація
          </TabsTab>
          <TabsTab value="security" leftSection={<Shield size={20} />}>
            Безпека
          </TabsTab>
          <TabsTab value="link" leftSection={<Link size={20} />}>
            Зв&apos;язані аккаунти
          </TabsTab>
          <TabsTab value="sessions" leftSection={<Fingerprint size={20} />}>
            Сесії
          </TabsTab>
        </TabsList>

        {map(tabs, (tab) => (
          <TabsPanel key={tab.key} value={tab.key} className="mt-3">
            {tab.content}
          </TabsPanel>
        ))}
      </Tabs>
    </>
  );
}
