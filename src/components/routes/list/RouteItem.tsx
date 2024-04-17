import { Card, Flex, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { CalendarClock, MapPin, Truck } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

import type { Route } from "@/types/route/Route";

import StatusBadge from "../StatusBadge";

interface IProps {
  route: Route;
}

function RouteItem({ route }: IProps) {
  return (
    <Card
      component={Link}
      href={`/routes/${route.id}`}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="cursor-pointer duration-300 hover:bg-[var(--mantine-color-dark-5)]"
      h="100%"
    >
      <Title order={2} c="blue">
        {route.id}
      </Title>
      <Text size="xs" c="dimmed">
        {dayjs(route.date).format("DD.MM.YYYY HH:mm:ss")}
      </Text>
      <StatusBadge route={route} />
      <Flex gap="1px" mt="md" direction="column">
        <Flex gap="xs" align="center">
          <CalendarClock size={18} />
          <Text>{dayjs(route.departure).format("HH:mm:ss")}</Text>
        </Flex>
        <Flex gap="xs" align="center">
          <MapPin size={18} />
          <Text>{route.route}</Text>
        </Flex>
        <Flex gap="xs" align="center">
          <Truck size={18} />
          <Text>{route.transport}</Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export default memo(RouteItem);
