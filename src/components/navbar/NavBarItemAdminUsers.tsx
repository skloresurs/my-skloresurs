'use client';

import { Badge } from '@mantine/core';
import { Users } from 'lucide-react';
import React, { memo } from 'react';
import useSWR from 'swr';

import verifyPermission from '@/libs/verify-permission';
import { IUserMeRequest } from '@/types/User';

import NavBarItem from './NavBarItem';

interface IProps {
  user?: IUserMeRequest;
}

function NavBarItemAdminUsers({ user }: IProps) {
  const { data } = useSWR('/api/users?permission=none');
  return (
    <NavBarItem
      label='Користувачі'
      href='/admin/users'
      icon={<Users />}
      hide={!verifyPermission(user?.permissions ?? [], 'Admin')}
      rightSection={
        <Badge variant='light' radius='xl'>
          {data?.total}
        </Badge>
      }
    />
  );
}

export default memo(NavBarItemAdminUsers);
