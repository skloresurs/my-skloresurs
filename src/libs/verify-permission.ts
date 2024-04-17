import { includes } from "lodash";

import { MissingPermissionError } from "@/classes/CustomError";
import type { Permission } from "@/types/User";

/**
 * Verify user's permission based on their role.
 *
 * @param {Permission[]} userPermissions - the array of user permissions
 * @param {Permission} permission - the specific permission to check
 * @param {boolean} defaultState - the default state if permission is not provided
 * @return {boolean} the result of permission verification
 */
const verifyPermission = (userPermissions: Permission[], permission?: Permission, defaultState = false): boolean => {
  if (includes(userPermissions, "SuperAdmin")) {
    return true;
  }

  switch (permission) {
    case "Manager": {
      return includes(userPermissions, "Manager") || includes(userPermissions, "Admin");
    }
    case "Driver": {
      return includes(userPermissions, "Driver") || includes(userPermissions, "Admin");
    }
    case "Admin": {
      return includes(userPermissions, "Admin");
    }
    case "SuperAdmin": {
      return includes(userPermissions, "SuperAdmin");
    }
    case "Beta": {
      return includes(userPermissions, "Beta");
    }
    case "GPS": {
      return includes(userPermissions, "GPS") || includes(userPermissions, "Admin");
    }
    default: {
      return defaultState;
    }
  }
};

/**
 * Verify if the user has the required permission
 *
 * @param {Permission[]} userPermissions - the user's permissions
 * @param {Permission} permission - the permission to verify
 * @throws {MissingPermissionError} if the permission is missing
 */
export function verifyPermissionServer(userPermissions: Permission[], permission?: Permission): void {
  if (!verifyPermission(userPermissions, permission)) {
    throw MissingPermissionError;
  }
}

export default verifyPermission;
