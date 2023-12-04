'use client';

import { NavLink } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { NavBarItem, RootNavBarItem } from '@/components/NavBar';

interface IProps {
  item: NavBarItem | RootNavBarItem;
  hide: boolean;
}

const isRootItem = (item: NavBarItem): item is RootNavBarItem =>
  'children' in item;

export default function NavBarItemCompnent({ item, hide = false }: IProps) {
  const pathname = usePathname();

  if (hide) {
    return null;
  }

  if (isRootItem(item) && item.children) {
    return (
      <NavLink
        label={item.label}
        leftSection={item.icon}
        description={item.description}
        opened
      >
        {item.children.map((e) => (
          <NavBarItemCompnent key={e.id} item={e} hide={hide} />
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
      />
    );
  }

  return (
    <NavLink
      label={item.label}
      leftSection={item.icon}
      description={item.description}
      onClick={item.onClick}
    />
  );
}
