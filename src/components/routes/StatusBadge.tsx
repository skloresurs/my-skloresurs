import { Badge } from "@mantine/core";
import { memo } from "react";

import type { Route } from "@/types/route/Route";

interface IProps {
  route: Route;
}

function StatusBadge({ route }: IProps) {
  if (!route.approved) {
    return (
      <Badge className="cursor-default select-none" variant="light" color="red">
        Не затверджено
      </Badge>
    );
  }

  if (!route.completed) {
    return (
      <Badge className="cursor-default select-none" variant="light" color="orange">
        Затвержений
      </Badge>
    );
  }

  return (
    <Badge className="cursor-default select-none" variant="light" color="green">
      Завершено
    </Badge>
  );
}

export default memo(StatusBadge);
