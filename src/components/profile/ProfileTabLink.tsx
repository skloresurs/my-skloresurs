'use client';

import { Button, Divider, Paper, TextInput, Title } from '@mantine/core';
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
    <Paper withBorder shadow='md' radius='md' className='py-3'>
      <div className='px-4'>
        <Title order={2} size='h3'>
          {label}
        </Title>
        <span className='text-sm'>Входьте в свій аккаунт за допомогою облікового запису {label}</span>
        <TextInput className='mt-3' value={value ?? valueId ?? "Не з'єднано"} readOnly />
      </div>
      <Divider className='my-3' />
      <div className='flex flex-row items-center justify-between px-4'>
        <span className='text-sm text-[var(--mantine-color-gray-5)]' />
        <Button
          onClick={() => window.location.replace(valueId ? `/api/profile/unlink/${id}` : `/api/auth/${id}`)}
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          leftSection={valueId ? <Unlink size={20} /> : <Link size={20} />}
          color={valueId ? 'red' : 'blue'}
        >
          {valueId ? "Від'єднанти" : "Прив'язати"}
        </Button>
      </div>
    </Paper>
  );
}

export default function ProfileTabLink() {
  const { data: user } = useSWR<IUserMeRequest>(`/api/user`);

  return (
    <div className='flex w-full max-w-xl flex-col gap-5'>
      <LinkItem key='google' id='google' label='Google' value={user?.google} valueId={user?.googleId} />
      <LinkItem key='facebook' id='facebook' label='Facebook' value={user?.facebook} valueId={user?.facebookId} />
    </div>
  );
}
