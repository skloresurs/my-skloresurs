'use client';

import { ActionIcon, Flex, Stack, Text, TextInput } from '@mantine/core';
import { includes, map, sortBy } from 'lodash';
import { ChevronRight, Search, UsersRound, X } from 'lucide-react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { permissionsEnum } from '@/libs/db/schema';
import { permissions } from '@/libs/dictionaries';

import UsersGroup from './UsersGroup';

interface IGroup {
  id: string;
  title: string;
}

const groups: IGroup[] = [
  { id: 'none', title: 'Без прав' },
  ...map(sortBy(permissionsEnum.enumValues), (e) => ({ id: e, title: permissions.get(e) ?? e })),
];

export default function UsersList() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [filterByName, setFilterByName] = useState('');
  const [filterById, setFilterById] = useState('');
  const [filterByEmail, setFilterByEmail] = useState('');

  const columns: DataTableColumn<IGroup>[] = useMemo(
    () => [
      {
        accessor: 'name',
        title: "Права / Повне ім'я",
        width: '300px',
        render: ({ id, title }) => (
          <Flex gap='xs' wrap='nowrap'>
            <ChevronRight className={twMerge(includes(expandedIds, id) ? 'rotate-90' : '', 'duration-300')} />
            <UsersRound />
            <Text>{title}</Text>
          </Flex>
        ),
        filter: (
          <Stack>
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
          </Stack>
        ),
        filtering: filterByName !== '' || filterByEmail !== '' || filterById !== '',
      },
      {
        accessor: 'persmissions',
        title: 'Права',
        width: '200px',
        render: () => <div />,
      },
      {
        accessor: 'actions',
        title: '',
        width: '100px',
        render: () => <div />,
      },
    ],
    [expandedIds, filterById, filterByName, filterByEmail]
  );

  return (
    <DataTable
      withTableBorder
      records={groups}
      columns={columns}
      withColumnBorders
      verticalSpacing='xs'
      loaderBackgroundBlur={2}
      rowExpansion={{
        allowMultiple: true,
        expanded: { recordIds: expandedIds, onRecordIdsChange: setExpandedIds },
        // eslint-disable-next-line react/no-unstable-nested-components -- Library component
        content: ({ record }) => (
          <UsersGroup
            groupId={record.id}
            filterByName={filterByName}
            filterById={filterById}
            filterByEmail={filterByEmail}
          />
        ),
      }}
    />
  );
}
