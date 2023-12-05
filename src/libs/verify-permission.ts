import { Permission } from '@/types/User'; /**
 * Verifies if the user has a specific permission and returns the result.
 *
 * @param {Permission[]} userPermissions - The list of permissions assigned to the user.
 * @param {Permission} permission - The permission to verify. (optional)
 * @param {boolean} defaultState - The default state to return if the permission is not found. (default: false)
 * @return {boolean} The result of the permission verification.
 */
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

export default verifyPermission;
