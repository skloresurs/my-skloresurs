import React from 'react';

import Users from '@/components/admin/users1C/Users';
import TitleBar from '@/components/TitleBar';

export default function UsersPage() {
  return (
    <>
      <TitleBar title='Користувачі 1С' />
      <Users />
    </>
  );
}
