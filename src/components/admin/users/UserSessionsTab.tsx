import { Center } from '@mantine/core';
import { map } from 'lodash';
import React from 'react';

import InfoAlert from '@/components/ui/InfoAlert';
import SessionItem from '@/components/ui/SessionItem';
import { IUserRequest } from '@/types/User';

export default function UserSessionsTab({ user }: { user?: IUserRequest }) {
  if (!user || !user.sessions)
    return (
      <Center>
        <InfoAlert maw={576} w={576} title='Немає сесій' description='Не знадено жодної сесії' />
      </Center>
    );

  return (
    <div className='flex max-w-xl flex-col gap-3'>
      {map(user?.sessions, (e) => (
        <SessionItem key={e.id} session={e} />
      ))}
    </div>
  );
}
