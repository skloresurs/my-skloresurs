"use client";

import { Accordion, Checkbox, Flex, Group, Stack, Text } from "@mantine/core";
import { constant, map, split } from "lodash";
import { memo, useState } from "react";

import DrawerItem from "@/components/ui/DrawerItem";
import TelephoneButton from "@/components/ui/TelephoneButton";
import { phoneRegexp } from "@/libs/regexp";
import type { FullRoute } from "@/types/route/Route";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { mutate } from "swr";

interface IProps {
  route: FullRoute;
}

function TasksTab({ route }: IProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateTask = async (id: string, completed: boolean) => {
    notifications.hide(`route-${id}`);
    notifications.show({
      id: `route-${id}`,
      title: "Оновлення завдання",
      message: "Оновлюється...",
      loading: true,
      autoClose: false,
    });
    const response = await axios
      .patch(`/api/routes/${route.id}`, { id: Number(id), completed })
      .then(constant(true))
      .catch(constant(false));

    if (response) {
      await mutate(`/api/routes/${route.id}`, route, { revalidate: true });
      notifications.update({
        id: `route-${id}`,
        title: "Оновлення завдання",
        message: "Успішно оновлено",
        color: "green",
        loading: false,
        autoClose: true,
      });
    } else {
      notifications.update({
        id: `route-${id}`,
        title: "Оновлення завдання",
        message: "Не вдалося оновити",
        color: "red",
        loading: false,
        autoClose: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <Accordion mt="sm">
      {map(route.tasks, (task) => (
        <Accordion.Item value={task.id} key={task.id}>
          <Accordion.Control
            flex={1}
            c={task.completed ? "dimmed" : ""}
            td={task.completed ? "line-through" : ""}
            className="duration-300"
          >
            <Group align="center">
              <Checkbox
                radius="xl"
                size="md"
                checked={task.completed}
                onChange={() => updateTask(task.id, !task.completed)}
                disabled={isLoading}
              />
              <Text>Завдання №{task.id}</Text>
            </Group>
          </Accordion.Control>
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
