'use client';

import { Button, Flex, Popover, Stack, Switch, TextInput, Title, Tooltip } from '@mantine/core';
import { Filter, FilterX, Search, SearchX } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const GROUP_BY_AGENT_KEY = 'group-by-agents';

export default function ManagerInstruments() {
  const query = useSearchParams();
  const router = useRouter();
  const [opened, setOpened] = useState<boolean>(false);
  const [allOrders, setAllOrders] = useState<boolean>(!!query.get('all'));
  const [groupByAgents, setGroupByAgents] = useState<boolean>(!!query.get(GROUP_BY_AGENT_KEY));
  const [search, setSearch] = useState<string>(query.get('search') ?? '');

  useEffect(() => {
    setGroupByAgents(!!query.get(GROUP_BY_AGENT_KEY));
  }, [query]);

  function searchHandler() {
    setOpened(false);
    const current = new URLSearchParams([...query.entries()]);

    if (search) {
      current.set('search', search);
    } else {
      current.delete('search');
    }

    if (allOrders) {
      current.set('all', 'true');
    } else {
      current.delete('all');
    }

    if (groupByAgents) {
      current.set(GROUP_BY_AGENT_KEY, 'true');
    } else {
      current.delete(GROUP_BY_AGENT_KEY);
    }
    current.delete('page');

    const filter = current.toString();
    const newQuery = filter ? `?${filter}` : '';
    router.replace(`/manager${newQuery}`);
  }

  function resetAgent() {
    setOpened(false);
    const current = new URLSearchParams([...query.entries()]);
    current.delete('agent');
    current.delete('group-by-agents');
    current.delete('page');
    const filter = current.toString();
    const newQuery = filter ? `?${filter}` : '';
    router.replace(`/manager${newQuery}`);
  }

  return (
    <Flex direction='row-reverse' gap='sm' align='center'>
      <Popover width={300} position='bottom-end' withArrow shadow='md' opened={opened} onChange={setOpened}>
        <Popover.Target>
          <Button leftSection={<Search size={20} />} onClick={() => setOpened((prev) => !prev)}>
            Пошук
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Title className='text-center' order={2} size='h4'>
            Пошук
          </Title>
          <Stack gap='sm' mt='md'>
            <TextInput
              placeholder='Пошук...'
              leftSection={<Search size={16} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  searchHandler();
                }
              }}
            />
            <Switch
              defaultChecked={allOrders}
              checked={allOrders}
              onChange={(event) => setAllOrders(event.currentTarget.checked)}
              label='Показати всі замовлення'
              description={
                allOrders
                  ? 'Показати всі замовлення'
                  : 'Не показувати замовлення з статусом "Прийнятий Менеджером", "Відхилено", "Виконано" та замовлення старіші за 2 роки'
              }
            />
            <Switch
              defaultChecked={groupByAgents}
              checked={groupByAgents}
              onChange={(event) => setGroupByAgents(event.currentTarget.checked)}
              label='Групувати за контрагентами (BETA)'
              c='orange'
              description={
                groupByAgents
                  ? 'Показати список контагентів за заданими параметрами'
                  : 'Показати список замовлень за заданими параметрами'
              }
            />
          </Stack>
          <Stack mt='sm' gap='xs'>
            <Button leftSection={<Search size={16} />} onClick={() => searchHandler()}>
              Шукати
            </Button>
            {query.get('agent') && (
              <Button variant='outline' color='red' leftSection={<FilterX size={16} />} onClick={resetAgent}>
                Скинути контрагента
              </Button>
            )}
            <Button
              variant='outline'
              color='red'
              leftSection={<SearchX size={16} />}
              onClick={() => {
                router.push('/manager');
                setOpened(false);
              }}
            >
              Скинути
            </Button>
          </Stack>
        </Popover.Dropdown>
      </Popover>
      {query.get('agent') && (
        <Tooltip label='Увімкнено фільтрацію за контрагентом'>
          <Filter color='var(--mantine-color-yellow-text)' />
        </Tooltip>
      )}
    </Flex>
  );
}
