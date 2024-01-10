'use client';

import { Button, Flex, Popover, Stack, Switch, TextInput, Title } from '@mantine/core';
import { Search, SearchX } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function OrdersInstruments() {
  const query = useSearchParams();
  const router = useRouter();
  const [opened, setOpened] = useState<boolean>(false);
  const [allOrders, setAllOrders] = useState<boolean>(!!query.get('all'));
  const [search, setSearch] = useState<string>(query.get('search') ?? '');

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
    current.delete('page');

    const filter: string = current.toString();
    const newQuery = filter ? `?${filter}` : '';
    router.replace(`/manager${newQuery}`);
  }

  return (
    <Flex direction='row-reverse'>
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
          </Stack>
          <Stack mt='sm' gap='xs'>
            <Button leftSection={<Search size={16} />} onClick={() => searchHandler()}>
              Шукати
            </Button>
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
    </Flex>
  );
}
