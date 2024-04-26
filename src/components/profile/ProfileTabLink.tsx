"use client";

import { Button, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import { Link, Unlink } from "lucide-react";
import { memo } from "react";
import useSWR from "swr";

import type { IUserMeRequest } from "@/types/User";

interface ILinkItem {
  id: string;
  label: string;
  linked: boolean;
}

function LinkItem({ id, label, linked }: ILinkItem) {
  return (
    <Paper withBorder={true} shadow="md" radius="md" p="md">
      <Title order={2} size="h3">
        {label}
      </Title>
      <Text size="sm">Входьте в свій аккаунт за допомогою облікового запису {label}</Text>
      <Flex mt="sm" direction="row-reverse">
        <Button
          onClick={() => window.location.replace(linked ? `/api/profile/unlink/${id}` : `/api/auth/${id}`)}
          leftSection={linked ? <Unlink size={20} /> : <Link size={20} />}
          color={linked ? "red" : "blue"}
        >
          {linked ? "Від'єднанти" : "Прив'язати"}
        </Button>
      </Flex>
    </Paper>
  );
}

function ProfileTabLink() {
  const { data: user } = useSWR<IUserMeRequest>("/api/user");

  return (
    <Stack gap="sm" maw="576">
      <LinkItem key="google" id="google" label="Google" linked={!!user?.google_id} />
      <LinkItem key="facebook" id="facebook" label="Facebook" linked={!!user?.facebook_id} />
    </Stack>
  );
}

export default memo(ProfileTabLink);
