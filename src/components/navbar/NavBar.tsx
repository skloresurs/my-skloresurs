import { Boxes, GanttChartSquare, LogOut, LucideProps, Shield, Truck, UserRound, Users } from 'lucide-react';
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
    id: 'orders',
    label: 'Замовлення',
    href: '/',
    icon: <Boxes {...props} />,
  },
  {
    id: 'manager-orders',
    label: 'Замовлення (менеджер)',
    icon: <GanttChartSquare {...props} />,
    permission: 'Manager',
    href: '/manager',
  },
  {
    id: 'routes',
    label: 'Маршрути',
    icon: <Truck {...props} />,
    permission: 'Driver',
    href: '/routes',
  },
  {
    id: 'admin',
    label: 'Адміністратор',
    icon: <Shield {...props} />,
    permission: 'Admin',
    children: [
      {
        id: 'admin-users',
        label: 'Користувачі',
        href: '/admin/users',
        icon: <Users {...props} />,
        permission: 'Admin',
      },
    ],
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
