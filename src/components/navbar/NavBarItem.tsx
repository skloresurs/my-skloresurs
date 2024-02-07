import { NavLink } from '@mantine/core';
import { map } from 'lodash';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { memo } from 'react';

import { NavBarItem, RootNavBarItem } from '@/components/navbar/NavBar';

interface IProps {
  item: NavBarItem | RootNavBarItem;
  hide: boolean;
  toogle: () => void;
}

const isRootItem = (item: NavBarItem): item is RootNavBarItem => 'children' in item;

function NavBarItemCompnent({ item, hide = false, toogle }: IProps) {
  const pathname = usePathname();

  if (hide) {
    return null;
  }

  if (isRootItem(item) && item.children) {
    return (
      <NavLink label={item.label} leftSection={item.icon} description={item.description} opened>
        {map(item.children, (e) => (
          <NavBarItemCompnent key={e.id} item={e} hide={hide} toogle={toogle} />
        ))}
      </NavLink>
    );
  }

  if (item.href) {
    return (
      <NavLink
        component={Link}
        label={item.label}
        leftSection={item.icon}
        href={item.href ?? '#'}
        description={item.description}
        active={pathname === item.href}
        onClick={() => toogle()}
      />
    );
  }

  return (
    <NavLink
      label={item.label}
      leftSection={item.icon}
      description={item.description}
      onClick={() => {
        if (item.onClick) {
          item.onClick();
        }
        toogle();
      }}
    />
  );
}

export default memo(NavBarItemCompnent);
