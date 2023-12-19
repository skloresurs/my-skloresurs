import { Boxes, GanttChartSquare, LogOut, LucideProps, Shield, UserRound, Users } from 'lucide-react';
import React, { ReactNode } from 'react';

import { Permission } from '@/types/User';

const props: LucideProps = {
  size: 18,
};

export interface NavBarItem {
  id: string;
  label: string;
  description?: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void | Promise<void>;
  permission?: Permission;
}

export interface RootNavBarItem extends NavBarItem {
  children?: NavBarItem[];
}

const navbar: RootNavBarItem[] = [
  {
    href: '/',
    icon: <Boxes {...props} />,
    id: 'orders',
    label: 'Замовлення',
  },
  {
    children: [
      {
        href: '/manager/orders',
        icon: <Boxes {...props} />,
        id: 'manager-orders',
        label: 'Замовлення',
        permission: 'Manager',
      },
    ],
    icon: <GanttChartSquare {...props} />,
    id: 'manager',
    label: 'Менеджер',
    permission: 'Manager',
  },
  {
    children: [
      {
        href: '/admin/users',
        icon: <Users {...props} />,
        id: 'admin-users',
        label: 'Користувачі',
        permission: 'Admin',
      },
    ],
    icon: <Shield {...props} />,
    id: 'admin',
    label: 'Адміністратор',
    permission: 'Admin',
  },
];

const footer: (logoutFunc: () => Promise<void>) => NavBarItem[] = (logoutFunc) =>
  [
    {
      href: '/profile',
      icon: <UserRound {...props} />,
      id: 'profile',
      label: 'Профіль',
    },
    {
      icon: <LogOut {...props} />,
      id: 'logout',
      label: 'Вийти',
      onClick: logoutFunc,
    },
  ] as NavBarItem[];

export default navbar;
export { footer };
