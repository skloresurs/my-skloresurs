import { Stack } from '@mantine/core';
import { Save } from 'lucide-react';
import React, { memo } from 'react';

import ProfileCard from '@/components/ui/ProfileCard';
import { IUserRequest } from '@/types/User';

function User1CTab({ user }: { user?: IUserRequest }) {
  if (!user) return null;

  return (
    <Stack maw='576'>
      <ProfileCard
        title='ID 1C'
        value={user.id_1c ?? ''}
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
          nullOnEmpty: true,
        }}
      />
    </Stack>
  );
}

export default memo(User1CTab);
