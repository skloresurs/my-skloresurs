import React from 'react';

import UsersList from '@/components/admin/users/list/UsersList';
import TitleBar from '@/components/TitleBar';

export default function UsersPage() {
  return (
    <>
      <TitleBar title='Користувачі' />
      <UsersList />
    </>
  );
}
