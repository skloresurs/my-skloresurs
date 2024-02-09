'use client';

import { ActionIcon, Avatar, Badge, Flex, Group, Stack, Text } from '@mantine/core';
import { map, split } from 'lodash';
import { Pencil } from 'lucide-react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import plural from 'plurals-cldr';
import React, { useState } from 'react';
import sha256 from 'sha256';
import useSWR from 'swr';

import PermissionBadge from '@/components/PermissionBadge';
import plurals from '@/libs/plurals';
import { IUserRequest } from '@/types/User';

import RemoveUserButton from './RemoveUserButton';

interface IResponse {
  total: number;
  users: IUserRequest[];
}

const columns: DataTableColumn<IUserRequest>[] = [
  {
    accessor: 'name',
    title: "Повне ім'я",
    width: '300px',
    render: ({ fullname, email, id, id_1c }) => (
      <Flex align='center' wrap='nowrap' gap='sm'>
        <Avatar alt={fullname} radius='xl' src={`https://gravatar.com/avatar/${sha256(email)}?s=64`}>
          {`${split(fullname, ' ')?.at(0)?.at(0) ?? ''}${split(fullname, ' ')?.at(1)?.at(0) ?? ''}`}
        </Avatar>
        <Stack gap='0px'>
          <Text size='lg'>{fullname}</Text>
          <Text>{email}</Text>
          <Text size='xs' c='dimmed'>
            {id}
          </Text>
          <Text size='xs' c='dimmed'>
            {id_1c}
          </Text>
        </Stack>
      </Flex>
    ),
  },
  {
    accessor: 'persmissions',
    width: '200px',
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
    width: '100px',
    render: (record) => (
      <Group gap='sm' justify='right' wrap='nowrap'>
        <Badge variant='light'>{`${record.sessions.length} ${plurals.session![plural('uk', record.sessions.length) ?? '']}`}</Badge>
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
