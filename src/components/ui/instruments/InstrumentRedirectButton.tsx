import { ActionIcon, Tooltip } from "@mantine/core";
import Link from "next/link";
import type { ReactNode } from "react";

interface IProps {
  href: string;
  icon: ReactNode;
  tooltip: string;
}

export default function InstrumentRedirectButton({ href, icon, tooltip }: IProps) {
  return (
    <Tooltip label={tooltip}>
      <ActionIcon size="lg" component={Link} href={href}>
        {icon}
      </ActionIcon>
    </Tooltip>
  );
}
