'use client';

import { Stack } from '@mantine/core';
import { map } from 'lodash';
import React from 'react';
import useSWR from 'swr';

import { IUserMeRequest } from '@/types/User';

import SessionItem from '../ui/SessionItem';

export default function ProfileTabSessions() {
  const { data: user } = useSWR<IUserMeRequest>(`/api/user`);
  return (
    <Stack gap='md' maw='576px'>
      {map(user?.sessions, (e) => (
        <SessionItem key={e.id} session={e} />
      ))}
    </Stack>
  );
}
