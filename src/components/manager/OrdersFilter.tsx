'use client';

import { Button, Popover, Switch, TextInput, Title } from '@mantine/core';
import { Search, SearchX } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import useSWR from 'swr';

import { Error, Info, Warning } from '@/components/info';
import { IUserMeRequest } from '@/types/User';

export default function OrdersInstruments() {
  const query = useSearchParams();
  const router = useRouter();
  const { data: user } = useSWR<IUserMeRequest>('/api/user');
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

    const filter: string = current.toString();
    const newQuery = filter ? `?${filter}` : '';
    router.replace(`/${newQuery}`);
  }

  return (
    <div className='flex items-center justify-end gap-2'>
      <Info label='Отримання замовлень з додаткового серверу наразі не підтримується.' />
      {user && !user.id_1c_main && (
        <Warning label='Вам не призначено ідентифікатор основнового серверу. Ви не зможете отримувати замовлення з цього серверу.' />
      )}
      {user && !user.id_1c_main && !user.id_1c_secondary && (
        <Error label='Вам не призначено жодного ідентифікатору серверу. Ви не зможете отримувати замовлення.' />
      )}
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
          <div className='mt-3 flex flex-col gap-2'>
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
          </div>
          <div className='mt-3 flex flex-col gap-2'>
            <Button leftSection={<Search size={16} />} onClick={() => searchHandler()}>
              Шукати
            </Button>
            <Button
              variant='outline'
              color='red'
              leftSection={<SearchX size={16} />}
              onClick={() => {
                router.push('/');
                setSearch('');
                setAllOrders(false);
                setOpened(false);
              }}
            >
              Скинути
            </Button>
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}
