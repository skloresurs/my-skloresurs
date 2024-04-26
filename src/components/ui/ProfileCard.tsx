"use client";

import { Button, Divider, Flex, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { every, map } from "lodash";
import React, { memo } from "react";
import useSWR, { useSWRConfig } from "swr";
import type { ZodSchema } from "zod";

import { mutateAllKeysStartingWith } from "@/libs/mutate";
import type { IUserMeRequest } from "@/types/User";

import { errorNotificationProps, loadingNotificationProps, successNotificationProps } from "../Notification";

interface IValidator {
  validator: ZodSchema<unknown>;
  errorMessage: string;
}

interface IProps {
  title: string;
  description: string;
  value: string;
  readOnly?: true;
  footerText?: string;
  maximumCharacters?: number;
  button?: {
    icon?: React.ReactNode;
    label: string;
  };
  submitSettings?: {
    apiUrl: string;
    key: string;
    userId?: string;
    validators?: IValidator[];
    nullOnEmpty?: boolean;
  };
}

const NotificationTitle = "Оновлення профілю";

function ProfileCard({
  title,
  description,
  value,
  readOnly,
  footerText,
  maximumCharacters,
  button,
  submitSettings,
}: IProps) {
  const { data: activeUser } = useSWR<IUserMeRequest>("/api/user");
  const { mutate } = useSWRConfig();
  const [inputValue, setInputValue] = React.useState(value);
  const [loading, { open: enableLoading, close: disableLoading }] = useDisclosure();

  const onClick = async () => {
    if (!submitSettings) return null;

    if (submitSettings?.validators) {
      const result = map(submitSettings?.validators, (validator) => {
        const status = validator.validator.safeParse(inputValue).success;
        if (!validator.validator.safeParse(inputValue).success) {
          notifications.show({
            message: validator.errorMessage,
            title: NotificationTitle,
            ...errorNotificationProps,
          });
        }
        return status;
      });

      if (!every(result, true)) {
        return null;
      }
    }

    enableLoading();

    const notification = notifications.show({
      message: "Оновлення...",
      title: NotificationTitle,
      ...loadingNotificationProps,
    });

    const response = await axios
      .post(submitSettings?.apiUrl, {
        [submitSettings?.key]: submitSettings?.nullOnEmpty && inputValue === "" ? null : inputValue,
      })
      .catch((error) => {
        notifications.update({
          id: notification,
          message: error.response?.data.error ?? error.message ?? "Невідома помилка",
          title: NotificationTitle,
          ...errorNotificationProps,
        });
      });

    if (!response || response.status !== 200) return disableLoading();
    await mutate(`/api/user/${submitSettings?.userId}`);

    await mutateAllKeysStartingWith("/api/user/");

    if (activeUser?.id === submitSettings.userId) {
      await mutate("/api/user");
    }

    disableLoading();

    return notifications.update({
      id: notification,
      message: "Оновлено",
      title: NotificationTitle,
      ...successNotificationProps,
    });
  };
  return (
    <Paper withBorder={true} shadow="md" radius="md" p="md">
      <Stack gap="4px">
        <Title order={2} size="h3">
          {title}
        </Title>
        <Text size="sm">{description}</Text>
        <TextInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          maxLength={maximumCharacters}
          readOnly={readOnly}
        />
        {maximumCharacters && (
          <Text size="xs" c="dimmed" ta="end">{`${inputValue.length} / ${maximumCharacters}`}</Text>
        )}
      </Stack>
      <Divider my="sm" />
      <Flex justify="space-between" align="center" gap="xs">
        <Text c="dimmed" size="sm">
          {footerText}
        </Text>
        {button && (
          <Button loading={loading} onClick={onClick} leftSection={button.icon}>
            {button.label}
          </Button>
        )}
      </Flex>
    </Paper>
  );
}

export default memo(ProfileCard);
