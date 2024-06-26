import { ActionIcon, Avatar, Center, Flex, Paper, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import dayjs from "dayjs";
import { Trash } from "lucide-react";
import { memo } from "react";
import useSWR from "swr";

import { mutateAllKeysStartingWith } from "@/libs/mutate";
import type ISession from "@/types/Session";
import type { IUserMeRequest } from "@/types/User";

import { errorNotificationProps, loadingNotificationProps, successNotificationProps } from "../Notification";

const NotificationTitle = "Сесії";

function SessionItem({ session }: { session: ISession }) {
  const { data: user, mutate } = useSWR<IUserMeRequest>("/api/user");
  const removeSession = async (id: string) => {
    const notification = notifications.show({
      message: "Видалення сесій...",
      title: NotificationTitle,
      ...loadingNotificationProps,
    });

    const response = await axios.delete(`/api/sessions/${id}`).catch((error) => {
      notifications.update({
        id: notification,
        message: error.response?.data.error ?? error.message ?? "Невідома помилка",
        title: NotificationTitle,
        ...errorNotificationProps,
      });
    });

    await mutateAllKeysStartingWith("/api/users");
    await mutate();

    if (!response || response.status !== 200) return;
    notifications.update({
      id: notification,
      message: "Сесія видалена",
      title: NotificationTitle,
      ...successNotificationProps,
    });
  };

  return (
    <Paper withBorder={true} p="md" radius="md" c={session.id === user?.thisSession ? "green" : ""}>
      <Flex gap="sm" align="center">
        <Center p="xs" bg="dark.6" maw="48px" mah="48px" className="rounded-full">
          <Avatar radius="xs" size="sm" src={`https://cdn.simpleicons.org/${session.os}`} />
        </Center>
        <Flex justify="center" align="flex-start" direction="column">
          <Title order={2} size="h5">
            {session.browser} <span className={session.id === user?.thisSession ? "" : "hidden"}>(ця сесія)</span>
          </Title>
          <Text size="sm" c="dimmed">
            {dayjs(session.created_at).format("DD.MM.YYYY HH:mm")}
          </Text>
        </Flex>
        <div className="flex-1" />
        <ActionIcon
          variant="transparent"
          aria-label="Remove session"
          color="red"
          onClick={() => removeSession(session.id)}
        >
          <Trash />
        </ActionIcon>
      </Flex>
    </Paper>
  );
}

export default memo(SessionItem);
