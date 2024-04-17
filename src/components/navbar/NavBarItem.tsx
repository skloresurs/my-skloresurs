import { NavLink } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { memo, useMemo } from "react";

type Props = {
  children?: React.ReactNode;
  label: string;
  description?: string;
  icon: React.ReactNode;
  hide?: boolean;
  rightSection?: React.ReactNode;
} & ({ href: string; onClick?: undefined } | { href?: undefined; onClick?: () => void });

function NavBarItem({ children, hide, href, label, icon, description, rightSection, onClick }: Props) {
  const pathname = usePathname();

  const props = useMemo(
    () => ({
      label,
      leftSection: icon,
      description,
      active: pathname === href,
      opened: !rightSection,
      rightSection,
    }),
    [description, href, icon, label, pathname, rightSection],
  );

  if (hide) {
    return null;
  }

  if (href) {
    return (
      <NavLink component={Link} href={href} {...props}>
        {children}
      </NavLink>
    );
  }

  return (
    <NavLink onClick={onClick} {...props}>
      {children}
    </NavLink>
  );
}

export default memo(NavBarItem);
