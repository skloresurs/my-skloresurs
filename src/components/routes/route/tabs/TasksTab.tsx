"use client";

import { Checkbox, Group, Stack, Text, Title } from "@mantine/core";
import { constant, map } from "lodash";
import { memo, useState } from "react";

import TelephoneButton from "@/components/ui/TelephoneButton";
import type { FullRoute } from "@/types/route/Route";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { Star } from "lucide-react";
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
        <Group align="center" gap="sm" wrap="nowrap" p="sm">
          <Checkbox
            radius="xl"
            size="md"
            checked={task.completed}
            onChange={() => updateTask(task.id, !task.completed)}
            disabled={isLoading}
          />
          <Stack gap={0} flex={1}>
            <Group gap={2}>
              {task.important && (
                <Star size={16} fill="var(--mantine-color-blue-6)" color="var(--mantine-color-blue-6)" />
              )}
              <Title order={3} size="h5" td={task.completed ? "line-through" : ""} c={task.completed ? "dimmed" : ""}>
                {task.description}
              </Title>
            </Group>
            <Text size="sm" c="dimmed">
              {task.manager?.name}
            </Text>
          </Stack>
          <TelephoneButton tel={task.manager?.tel} />
        </Group>
      ))}
    </Stack>
  );
}

export default memo(TasksTab);
