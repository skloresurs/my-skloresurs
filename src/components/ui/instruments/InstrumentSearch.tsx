'use client';

import { ActionIcon, Flex, TextInput } from '@mantine/core';
import { Search, SearchX } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

interface IProps {
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function InstrumentSearch({ label, description, placeholder, disabled }: IProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get('search');

  const [value, setValue] = useState(search ?? '');

  useEffect(() => {
    setValue(search ?? '');
  }, [search]);

  const onSearch = useMemo(() => {
    const params = new URLSearchParams([...searchParams]);

    params.delete('page');

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    return `${pathname}?${params.toString()}`;
  }, [value, searchParams, pathname]);

  const onClearSearch = useMemo(() => {
    const params = new URLSearchParams([...searchParams]);
    params.delete('search');
    params.delete('page');

    return `${pathname}?${params.toString()}`;
  }, [searchParams, pathname]);

  return (
    <Flex direction='row' align='end' gap='4px'>
      <TextInput
        className='flex-1'
        label={label}
        description={description}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            router.push(onSearch);
          }
        }}
      />
      <ActionIcon component={Link} href={onSearch} size={36} disabled={disabled}>
        <Search />
      </ActionIcon>
      {search && (
        <ActionIcon component={Link} href={onClearSearch} color='red' size={36} disabled={disabled}>
          <SearchX />
        </ActionIcon>
      )}
    </Flex>
  );
}
