'use client';

import { ActionIcon, Box, Group } from '@mantine/core';
import { Pencil } from 'lucide-react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import PermissionBadge from '@/components/PermissionBadge';
import { IUserRequest } from '@/types/User';

const columns: DataTableColumn<IUserRequest>[] = [
  {
    accessor: 'id',
    title: 'ID',
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
    accessor: 'permissions',
    render: (record) => (
      <div className='flex flex-wrap gap-2'>
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
      <Group gap={4} justify='right' wrap='nowrap'>
        <ActionIcon component={Link} size='sm' variant='subtle' color='yellow' href={`/admin/users/${record.id}`}>
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
  users: IUserRequest[];
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
  const { data, isValidating } = useSWR<Response>(`/api/users?page=${page(pageParam) ?? 1}`);

  const onPageChange = (p: number) => router.push(`/admin/users?page=${p}`);

  return (
    <DataTable
      withTableBorder
      withColumnBorders
      striped
      columns={columns}
      verticalSpacing='md'
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
