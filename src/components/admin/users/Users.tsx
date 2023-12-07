'use client';

import { ActionIcon, Badge, Box, Group, Tooltip } from '@mantine/core';
import { BadgeInfo, Pencil } from 'lucide-react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import { Id } from '@/components/info';
import PermissionBadge from '@/components/PermissionBadge';
import IUser from '@/types/User';

const columns: DataTableColumn<IUser>[] = [
  {
    accessor: 'id',
    title: 'ID',
  },
  {
    accessor: 'verified',
    render: (record) => (
      <div className="flex flex-row gap-2">
        {record.id_1c_main && <Id label="Вказано ID основного серверу" />}
        {record.id_1c_secondary && (
          <Id label="Вказано ID додаткового серверу" />
        )}
      </div>
    ),
    textAlign: 'center',
    title: (
      <Tooltip label="Інформація">
        <BadgeInfo />
      </Tooltip>
    ),
    width: 50,
  },
  {
    accessor: 'fullname',
    title: "Повне ім'я",
  },
  {
    accessor: 'email',
    title: 'Email',
  },
  {
    accessor: 'account_type',
    render: (record) => {
      if (record.account_type === 'Google') {
        return <Badge color="green">Google</Badge>;
      }
      return <Badge>Стандартний</Badge>;
    },
    title: 'Тип облікового запису',
  },
  {
    accessor: 'permissions',
    render: (record) => (
      <div className="flex flex-wrap gap-2">
        {record.permissions.map((permission) => (
          <PermissionBadge key={permission} permission={permission} />
        ))}
      </div>
    ),
    title: 'Дозволи',
  },
  {
    accessor: 'actions',
    render: (record) => (
      <Group gap={4} justify="right" wrap="nowrap">
        <ActionIcon
          component={Link}
          size="sm"
          variant="subtle"
          color="yellow"
          href={`/admin/users/${record.id}`}
        >
          <Pencil />
        </ActionIcon>
      </Group>
    ),
    textAlign: 'right',
    title: <Box mr={6}>Дії</Box>,
  },
];

interface Response {
  total: number;
  users: IUser[];
}

const page = (pageParam: string | null) => {
  if (!pageParam || !Number.isInteger(+pageParam) || +pageParam < 1) {
    return 1;
  }
  return +pageParam;
};

export default function Users() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const { data, isValidating } = useSWR<Response>(
    `/api/admin/users?page=${page(pageParam) ?? 1}`
  );

  const onPageChange = (p: number) => router.push(`/admin/users?page=${p}`);

  return (
    <DataTable
      withTableBorder
      withColumnBorders
      striped
      columns={columns}
      verticalSpacing="md"
      records={data?.users ?? []}
      loaderBackgroundBlur={2}
      totalRecords={data?.total ?? 0}
      recordsPerPage={10}
      page={page(pageParam)}
      onPageChange={onPageChange}
      fetching={isValidating}
    />
  );
}
