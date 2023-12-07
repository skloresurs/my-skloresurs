'use client';

import { Button, Divider, Paper, TextInput, Title } from '@mantine/core';
import React from 'react';
import useSWR from 'swr';

import IUser from '@/types/User';

export default function ProfileTabLink() {
  const { data: user } = useSWR<IUser>(`/api/user`);

  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <Paper withBorder shadow="md" radius="md" className="py-3">
        <div className="px-4">
          <Title order={2} size="h3">
            Google
          </Title>
          <span className="text-sm">
            Входьте в свій аккаунт за допомогою облікового запису Google
          </span>
          <TextInput
            className="mt-3"
            value={user?.google ?? "Не з'єднано"}
            readOnly
          />
        </div>
        <Divider className="my-3" />
        <div className="flex flex-row items-center justify-between px-4">
          <span className="text-sm text-[var(--mantine-color-gray-5)]" />
          <Button
            onClick={() =>
              window.location.replace(
                user?.google ? `/api/profile/unlink/google` : `/api/auth/google`
              )
            }
            color={user?.google ? 'red' : 'blue'}
          >
            {user?.google ? "Від'єднанти" : "Прив'язати"}
          </Button>
        </div>
      </Paper>
    </div>
  );
}
