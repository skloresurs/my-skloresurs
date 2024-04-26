"use client";

import { Accordion, Flex, Stack, Text } from "@mantine/core";
import { map, split } from "lodash";
import { AlarmClockCheck } from "lucide-react";
import { memo } from "react";

import DrawerItem from "@/components/ui/DrawerItem";
import TelephoneButton from "@/components/ui/TelephoneButton";
import { phoneRegexp } from "@/libs/regexp";
import type { FullRoute } from "@/types/route/Route";

interface IProps {
  route: FullRoute;
}

function TasksTab({ route }: IProps) {
  return (
    <Accordion mt="sm">
      {map(route.tasks, (task) => (
        <Accordion.Item value={task.id} key={task.id}>
          <Accordion.Control icon={<AlarmClockCheck />}>Завдання №{task.id}</Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <DrawerItem label="Менеджер" value={task.manager} />
              <Flex align="center" gap="xs">
                <Stack gap="0px" className="flex-1">
                  {map(split(task.description, "¶"), (d) => (
                    <Text>{d}</Text>
                  ))}
                </Stack>
                <TelephoneButton tel={[task.description.match(phoneRegexp)?.at(0) ?? ""]} />
              </Flex>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default memo(TasksTab);
