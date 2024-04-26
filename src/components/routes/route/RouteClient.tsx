"use client";

import { Skeleton, Tabs } from "@mantine/core";
import { redirect } from "next/navigation";
import useSWR from "swr";

import getGroupedStations from "@/libs/station-group";
import type { FullRoute } from "@/types/route/Route";

import TabCountBadge from "../TabCountBadge";
import MainTab from "./tabs/MainTab";
import PyramidsTab from "./tabs/PyramidsTab";
import StationsTab from "./tabs/StationsTab";
import TasksTab from "./tabs/TasksTab";

export default function RouteClient({ id }: { id: string }) {
  const { data, error, isValidating } = useSWR<FullRoute>(`/api/routes/${id}`);
  if (isValidating) {
    return <Skeleton height={150} width="100%" />;
  }

  if (error || !data) {
    redirect("/routes");
  }

  return (
    <Tabs defaultValue="main">
      <Tabs.List>
        <Tabs.Tab value="main">Основна інформація</Tabs.Tab>
        <Tabs.Tab value="points">
          Шляхи <TabCountBadge count={getGroupedStations(data.routes ?? []).length} />
        </Tabs.Tab>
        <Tabs.Tab value="pyramids">
          Піраміди <TabCountBadge count={data.pyramids.length} />
        </Tabs.Tab>
        <Tabs.Tab value="tasks">
          Завдання <TabCountBadge count={data.tasks.length} />
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="main">
        <MainTab route={data} />
      </Tabs.Panel>
      <Tabs.Panel value="points">
        <StationsTab route={data} />
      </Tabs.Panel>
      <Tabs.Panel value="pyramids">
        <PyramidsTab route={data} />
      </Tabs.Panel>
      <Tabs.Panel value="tasks">
        <TasksTab route={data} />
      </Tabs.Panel>
    </Tabs>
  );
}
