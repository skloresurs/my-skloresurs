import { includes } from 'lodash';

import { MissingPermissionError } from '@/classes/CustomError';
import { Permission } from '@/types/User';

const verifyPermission = (userPermissions: Permission[], permission?: Permission, defaultState: boolean = false) => {
  switch (permission) {
    case 'Manager': {
      return (
        includes(userPermissions, 'Manager') ||
        includes(userPermissions, 'ManagerAllOrders') ||
        includes(userPermissions, 'Admin') ||
        includes(userPermissions, 'SuperAdmin')
      );
    }
    case 'Driver': {
      return (
        includes(userPermissions, 'Driver') ||
        includes(userPermissions, 'Admin') ||
        includes(userPermissions, 'SuperAdmin')
      );
    }
    case 'Admin': {
      return includes(userPermissions, 'Admin') || includes(userPermissions, 'SuperAdmin');
    }
    case 'SuperAdmin': {
      return includes(userPermissions, 'SuperAdmin');
    }
    default: {
      return defaultState;
    }
  }
};

export function verifyPermissionServer(userPermissions: Permission[], permission?: Permission) {
  if (!verifyPermission(userPermissions, permission)) {
    throw MissingPermissionError;
  }
}

export default verifyPermission;
