'use client';

import { Button, Divider, Flex, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { Link, Unlink } from 'lucide-react';
import React from 'react';
import useSWR from 'swr';

import { IUserMeRequest } from '@/types/User';

interface ILinkItem {
  id: string;
  label: string;
  valueId?: string;
  value?: string;
}

function LinkItem({ id, label, valueId, value }: ILinkItem) {
  return (
    <Paper withBorder shadow='md' radius='md' p='md'>
      <Title order={2} size='h3'>
        {label}
      </Title>
      <Text size='sm'>Входьте в свій аккаунт за допомогою облікового запису {label}</Text>
      <TextInput mt='sm' value={value ?? valueId ?? "Не з'єднано"} readOnly />
      <Divider mt='md' />
      <Flex mt='sm' direction='row-reverse'>
        <Button
          onClick={() => window.location.replace(valueId ? `/api/profile/unlink/${id}` : `/api/auth/${id}`)}
          leftSection={valueId ? <Unlink size={20} /> : <Link size={20} />}
          color={valueId ? 'red' : 'blue'}
        >
          {valueId ? "Від'єднанти" : "Прив'язати"}
        </Button>
      </Flex>
    </Paper>
  );
}

export default function ProfileTabLink() {
  const { data: user } = useSWR<IUserMeRequest>(`/api/user`);

  return (
    <Stack gap='sm' maw='576'>
      <LinkItem key='google' id='google' label='Google' value={user?.google} valueId={user?.googleId} />
      <LinkItem key='facebook' id='facebook' label='Facebook' value={user?.facebook} valueId={user?.facebookId} />
    </Stack>
  );
}
