import { Badge } from "@mantine/core";
import { memo } from "react";

interface IProps {
  count: number;
}

function TabCountBadge({ count }: IProps) {
  if (count === 0) {
    return null;
  }

  return (
    <Badge circle={true} variant="light">
      {count}
    </Badge>
  );
}

export default memo(TabCountBadge);
