import { Tooltip } from "@mantine/core";
import { BadgeCheck } from "lucide-react";
import { memo } from "react";

function OfficialMail() {
  return (
    <Tooltip label="Внутрішня пошта">
      <BadgeCheck color="green" />
    </Tooltip>
  );
}

export default memo(OfficialMail);
