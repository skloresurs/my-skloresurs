import { MissingPermissionError } from '@/classes/CustomError';
import { Permission } from '@/types/User';

const verifyPermission = (
  userPermissions: Permission[],
  permission?: Permission,
  defaultState: boolean = false
) => {
  switch (permission) {
    case 'Manager': {
      return (
        userPermissions.includes('Manager') ||
        userPermissions.includes('ManagerAllOrders') ||
        userPermissions.includes('Admin') ||
        userPermissions.includes('SuperAdmin')
      );
    }
    case 'Driver': {
      return (
        userPermissions.includes('Driver') ||
        userPermissions.includes('Admin') ||
        userPermissions.includes('SuperAdmin')
      );
    }
    case 'Admin': {
      return (
        userPermissions.includes('Admin') ||
        userPermissions.includes('SuperAdmin')
      );
    }
    case 'SuperAdmin': {
      return userPermissions.includes('SuperAdmin');
    }
    default: {
      return defaultState;
    }
  }
};

export function verifyPermissionServer(
  userPermissions: Permission[],
  permission?: Permission
) {
  if (!verifyPermission(userPermissions, permission)) {
    throw MissingPermissionError;
  }
}

export default verifyPermission;
