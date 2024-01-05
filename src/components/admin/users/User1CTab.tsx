import { Stack } from '@mantine/core';
import { Save } from 'lucide-react';
import React from 'react';
import { z } from 'zod';

import ProfileCard from '@/components/ui/ProfileCard';
import { IUserRequest } from '@/types/User';

export default function User1CTab({ user }: { user?: IUserRequest }) {
  if (!user) return null;

  return (
    <Stack maw='576'>
      <ProfileCard
        title='ID 1C'
        value={user.id_1c_main ?? ''}
        description='ID користувача в основній системі 1С'
        footerText='ID повинен бути типу UUID'
        button={{
          icon: <Save size={20} />,
          label: 'Зберегти',
        }}
        submitSettings={{
          apiUrl: `/api/user/${user.id}/1c/main`,
          key: 'id',
          userId: user.id,
          validators: [{ validator: z.string().uuid(), errorMessage: 'ID повинен бути типу UUID' }],
        }}
      />
    </Stack>
  );
}
