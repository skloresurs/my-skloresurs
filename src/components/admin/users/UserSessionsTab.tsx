import { map } from 'lodash';
import React from 'react';

import ErrorOnPage from '@/components/ErrorOnPage';
import SessionItem from '@/components/ui/SessionItem';
import { IUserRequest } from '@/types/User';

export default function UserSessionsTab({ user }: { user?: IUserRequest }) {
  if (!user || !user.sessions)
    return <ErrorOnPage title='Сесій немає' description='Не знайдено жоднох сесії' code={404} />;

  return (
    <div className='flex max-w-xl flex-col gap-3'>
      {map(user?.sessions, (e) => (
        <SessionItem key={e.id} session={e} />
      ))}
    </div>
  );
}
