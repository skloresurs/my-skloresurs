'use client';

import { ActionIcon, Box, Group, TextInput } from '@mantine/core';
import { endsWith, map } from 'lodash';
import { Pencil, Search, X } from 'lucide-react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import useSWR from 'swr';

import Have1Cid from '@/components/badges/Have1Cid';
import OfficialMail from '@/components/badges/OfficialMail';
import PermissionBadge from '@/components/PermissionBadge';
import { IUserRequest } from '@/types/User';

const PAGE_SIZES = [5, 10, 15, 20, 25, 50, 100];

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
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IUserRequest>>({
    columnAccessor: 'fullname',
    direction: 'asc',
  });
  const [pageSize, setPageSize] = useState(10);
  const [filterByName, setFilterByName] = useState('');
  const [filterById, setFilterById] = useState('');
  const [filterByEmail, setFilterByEmail] = useState('');
  const params = new URLSearchParams({
    page: pageParam ?? '1',
    sortBy: sortStatus.columnAccessor,
    sortDirection: sortStatus.direction,
    filterByName,
    filterById,
    filterByEmail,
    pageSize: pageSize.toString(),
  });
  const { data, isValidating } = useSWR<Response>(`/api/users?${params.toString()}`);

  const onPageChange = (p: number) => router.push(`/admin/users?page=${p}`);

  const columns = useMemo<DataTableColumn<IUserRequest>[]>(
    () => [
      {
        accessor: 'id',
        title: 'ID',
        sortable: true,
        filter: (
          <TextInput
            label='Пошук по ID'
            leftSection={<Search size={16} />}
            rightSection={
              <ActionIcon size='sm' variant='transparent' c='dimmed' onClick={() => setFilterById('')}>
                <X size={14} />
              </ActionIcon>
            }
            value={filterById}
            onChange={(e) => setFilterById(e.currentTarget.value)}
          />
        ),
        filtering: filterById !== '',
      },
      {
        accessor: 'fullname',
        title: "Повне ім'я",
        sortable: true,
        filter: (
          <TextInput
            label='Пошук за повним ім`ям'
            leftSection={<Search size={16} />}
            rightSection={
              <ActionIcon size='sm' variant='transparent' c='dimmed' onClick={() => setFilterByName('')}>
                <X size={14} />
              </ActionIcon>
            }
            value={filterByName}
            onChange={(e) => setFilterByName(e.currentTarget.value)}
          />
        ),
        filtering: filterByName !== '',
      },
      {
        accessor: 'email',
        title: 'Email',
        sortable: true,
        filter: (
          <TextInput
            label='Пошук по email'
            leftSection={<Search size={16} />}
            rightSection={
              <ActionIcon size='sm' variant='transparent' c='dimmed' onClick={() => setFilterByEmail('')}>
                <X size={14} />
              </ActionIcon>
            }
            value={filterByEmail}
            onChange={(e) => setFilterByEmail(e.currentTarget.value)}
          />
        ),
        filtering: filterByEmail !== '',
      },
      {
        accessor: 'badges',
        title: 'Інформація',
        width: 120,
        render: (record: IUserRequest) => (
          <Group gap='xs'>
            {endsWith(record.email, '@skloresurs.com') && <OfficialMail />}
            {record.id_1c && <Have1Cid />}
          </Group>
        ),
      },
      {
        accessor: 'permissions',
        render: (record) => (
          <div className='flex flex-wrap gap-2'>
            {map(record.permissions, (permission) => (
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
    ],
    [filterByEmail, filterById, filterByName]
  );

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
      recordsPerPage={pageSize}
      page={page(pageParam)}
      onPageChange={onPageChange}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      fetching={isValidating}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  );
}
