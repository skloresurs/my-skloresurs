"use client";

import { Checkbox, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { constant, map } from "lodash";
import { memo, useState } from "react";

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
    <Stack mt="sm" gap="sm">
      {map(route.tasks, (task) => (
        <Paper p="sm">
          <Group align="center" gap="sm">
            <Checkbox
              radius="xl"
              size="md"
              checked={task.completed}
              onChange={() => updateTask(task.id, !task.completed)}
              disabled={isLoading}
            />
            <Stack gap={1}>
              <Title order={3} size="h5" td={task.completed ? "line-through" : ""} c={task.completed ? "dimmed" : ""}>
                Завдання №{task.id} - {task.manager}
              </Title>
              <Text size="sm" c="dimmed">
                {task.description}
              </Text>
            </Stack>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}

export default memo(TasksTab);
