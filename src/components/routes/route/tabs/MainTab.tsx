"use client";

import { Space, Stack } from "@mantine/core";
import dayjs from "dayjs";
import { memo } from "react";

import DrawerItem from "@/components/ui/DrawerItem";
import TelephoneButton from "@/components/ui/TelephoneButton";
import type { FullRoute } from "@/types/route/Route";

import StatusBadge from "../../StatusBadge";

interface IProps {
  route: FullRoute;
}

function MainTab({ route }: IProps) {
  return (
    <Stack gap="4px" mt="sm">
      <DrawerItem label="ID" value={route.id} />
      <DrawerItem label="Статус">
        <StatusBadge route={route} />
      </DrawerItem>
      <Space />
      <DrawerItem label="Дата" value={dayjs(route.date).format("DD.MM.YYYY")} />
      <DrawerItem label="Виїзд" value={dayjs(route.departure).format("HH:mm:ss")} />
      <DrawerItem label="Транспорт" value={route.transport} />
      <Space />
      <DrawerItem label="Водій" value={route.driver?.name}>
        <TelephoneButton tel={route.driver?.tel} />
      </DrawerItem>
      <DrawerItem label="Відповідальний" value={route.responsible?.name}>
        <TelephoneButton tel={route.responsible?.tel} />
      </DrawerItem>
    </Stack>
  );
}

export default memo(MainTab);
