import { Badge } from '@mantine/core';
import React, { memo } from 'react';

import { Permission } from '@/types/User';

interface IProps {
  permission: Permission;
}

function PermissionBadge({ permission }: IProps) {
  switch (permission) {
    case 'SuperAdmin': {
      return <Badge color='purple'>Супер-адмін</Badge>;
    }

    case 'Admin': {
      return <Badge color='yellow'>Адмін</Badge>;
    }

    case 'Manager': {
      return <Badge color='green'>Менеджер</Badge>;
    }

    case 'Driver': {
      return <Badge color='red'>Водій</Badge>;
    }
  }

  return null;
}

export default memo(PermissionBadge);
