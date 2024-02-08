'use client';

import { ActionIcon, Flex, Group, Stack, Text } from '@mantine/core';
import { map } from 'lodash';
import { Pencil } from 'lucide-react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import React, { useState } from 'react';
import useSWR from 'swr';

import PermissionBadge from '@/components/PermissionBadge';
import { IUserRequest } from '@/types/User';

import RemoveUserButton from './RemoveUserButton';

interface IResponse {
  total: number;
  users: IUserRequest[];
}

const columns: DataTableColumn<IUserRequest>[] = [
  {
    accessor: 'id',
    width: '150px',
    render: ({ id }) => <Text ta='center'>{id}</Text>,
  },
  {
    accessor: 'name',
    title: "Повне ім'я",
    width: '50%',
    render: ({ fullname, email, id_1c }) => (
      <Stack gap='0px'>
        <Text size='lg'>{fullname}</Text>
        <Text>{email}</Text>
        <Text size='xs'>{id_1c}</Text>
      </Stack>
    ),
  },
  {
    accessor: 'persmissions',
    width: '25%',
    render: ({ permissions }) => (
      <Flex gap='xs' wrap='wrap'>
        {map(permissions, (e) => (
          <PermissionBadge key={e} permission={e} />
        ))}
      </Flex>
    ),
  },
  {
    accessor: 'actions',
    width: '10%',
    render: (record) => (
      <Group gap='sm' justify='right' wrap='nowrap'>
        <ActionIcon component={Link} variant='subtle' color='yellow' href={`/admin/users/${record.id}`}>
          <Pencil />
        </ActionIcon>
        <RemoveUserButton user={record} params='' />
      </Group>
    ),
  },
];

interface IProps {
  groupId: string;
  filterByName: string;
  filterById: string;
  filterByEmail: string;
}

export default function UsersGroup({ groupId, filterByName, filterById, filterByEmail }: IProps) {
  const [page, setPage] = useState(1);

  const query = new URLSearchParams();

  query.set('permission', groupId);
  query.set('page', page.toString());
  query.set('filterByName', filterByName);
  query.set('filterById', filterById);
  query.set('filterByEmail', filterByEmail);

  const { data, isValidating } = useSWR<IResponse>(`/api/users?${query.toString()}`);

  return (
    <DataTable
      striped
      noHeader
      page={page}
      columns={columns}
      loaderType='dots'
      withColumnBorders
      recordsPerPage={10}
      verticalSpacing='xs'
      fetching={isValidating}
      loaderBackgroundBlur={2}
      records={data?.users ?? []}
      totalRecords={data?.total ?? 0}
      onPageChange={(p) => setPage(p)}
      noRecordsText='Не знайдено жодного користувача'
      minHeight={!data || data.users.length === 0 ? 150 : undefined}
    />
  );
}
