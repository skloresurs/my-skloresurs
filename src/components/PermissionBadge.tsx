import { Badge } from "@mantine/core";
import { memo } from "react";

import { permissions, permissionsColors } from "@/libs/dictionaries";
import type { Permission } from "@/types/User";

interface IProps {
  permission: Permission;
}

function PermissionBadge({ permission }: IProps) {
  const permissionLabel = permissions.get(permission);
  const color = permissionsColors.get(permission);

  return (
    <Badge variant="light" color={color}>
      {permissionLabel ?? permission}
    </Badge>
  );
}

export default memo(PermissionBadge);
