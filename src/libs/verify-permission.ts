import { includes } from 'lodash';

import { MissingPermissionError } from '@/classes/CustomError';
import { Permission } from '@/types/User';

const verifyPermission = (userPermissions: Permission[], permission?: Permission, defaultState: boolean = false) => {
  if (includes(userPermissions, 'SuperAdmin')) {
    return true;
  }

  switch (permission) {
    case 'Manager': {
      return includes(userPermissions, 'Manager') || includes(userPermissions, 'Admin');
    }
    case 'Driver': {
      return includes(userPermissions, 'Driver') || includes(userPermissions, 'Admin');
    }
    case 'Admin': {
      return includes(userPermissions, 'Admin');
    }
    case 'SuperAdmin': {
      return includes(userPermissions, 'SuperAdmin');
    }
    case 'Beta': {
      return includes(userPermissions, 'Beta');
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
