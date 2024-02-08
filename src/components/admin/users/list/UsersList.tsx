'use client';

import { ActionIcon, Flex, Stack, Text, TextInput } from '@mantine/core';
import { includes, map, sortBy } from 'lodash';
import { ChevronRight, Search, UsersRound, X } from 'lucide-react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { permissionsEnum } from '@/libs/db/schema';

import UsersGroup from './UsersGroup';

interface IGroup {
  id: string;
  title: string;
}

const groups: IGroup[] = [
  { id: 'none', title: 'Без прав' },
  ...map(sortBy(permissionsEnum.enumValues), (e) => ({ id: e, title: e })),
];

export default function UsersList() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [filterByName, setFilterByName] = useState('');
  const [filterById, setFilterById] = useState('');
  const [filterByEmail, setFilterByEmail] = useState('');

  const columns: DataTableColumn<IGroup>[] = useMemo(
    () => [
      {
        accessor: 'id',
        title: 'Права / ID',
        width: '150px',
        render: ({ id, title }) => (
          <Flex gap='xs' wrap='nowrap'>
            <ChevronRight className={twMerge(includes(expandedIds, id) ? 'rotate-90' : '', 'duration-300')} />
            <UsersRound />
            <Text>{title}</Text>
          </Flex>
        ),
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
        accessor: 'name',
        title: "Повне ім'я",
        width: '50%',
        render: () => <div />,
        filter: (
          <Stack>
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
        filtering: filterByName !== '' || filterByEmail !== '',
      },
      {
        accessor: 'persmissions',
        title: 'Права',
        width: '25%',
        render: () => <div />,
      },
      {
        accessor: 'actions',
        title: '',
        width: '10%',
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
