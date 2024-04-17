import { Card, Divider, Flex, Stack, Text, Title } from "@mantine/core";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import plural from "plurals-cldr";
import { memo } from "react";

import TruncateScroll from "@/components/ui/TruncateScroll";
import plurals from "@/libs/plurals";
import type Agent from "@/types/manager/Agent";

interface IProps {
  agent: Agent;
}

function AgentItem({ agent }: IProps) {
  return (
    <Card
      component={Link}
      href={`/manager?agent=${agent.id}`}
      shadow="sm"
      radius="md"
      p="md"
      w="100%"
      h="100%"
      className="group cursor-pointer select-none duration-300 hover:bg-[var(--mantine-color-dark-5)]"
    >
      <Stack className="relative" gap="4px">
        <TruncateScroll>
          <Title order={2} size="lg" className="text-truncate-scroll">
            {agent.name}
          </Title>
        </TruncateScroll>
        <Text size="xs" c="dimmed">
          {agent.id}
        </Text>
        <Divider />
        <Flex justify="space-between" align="center">
          <Text>
            {agent.orders} {plurals.order?.[plural("uk", agent.orders) ?? ""]}
          </Text>
          <ArrowUpRight className="duration-300 group-hover:text-[var(--mantine-color-blue-5)]" />
        </Flex>
      </Stack>
    </Card>
  );
}

export default memo(AgentItem);
