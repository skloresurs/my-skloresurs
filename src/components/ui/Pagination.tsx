import { Center, Pagination as MantinePagination } from '@mantine/core';
import Link from 'next/link';
import { ReadonlyURLSearchParams } from 'next/navigation';
import React, { memo } from 'react';

interface PaginationProps {
  total: number;
  query: ReadonlyURLSearchParams;
  baseRoute: string;
}
function Pagination({ total, query, baseRoute }: PaginationProps) {
  const searchParam = new URLSearchParams([...query.entries()]);
  const pageNumber = query.get('page') ?? 1;
  const page = Number.isNaN(Number(pageNumber)) ? 1 : Number(pageNumber);
  return (
    <Center my='md'>
      <MantinePagination
        value={page}
        total={total}
        radius='xl'
        size='sm'
        getItemProps={(e) => {
          if (e === 1) {
            searchParam.delete('page');
          } else {
            searchParam.set('page', e.toString());
          }

          return {
            component: Link,
            href: `${baseRoute}?${searchParam.toString()}`,
          };
        }}
        getControlProps={(e) => {
          if (e === 'next') {
            if (page >= total) {
              return { disabled: true };
            }
            searchParam.set('page', (page + 1).toString());
          }
          if (e === 'previous') {
            if (page <= 1) {
              return { disabled: true };
            }
            if (+page - 1 === 1) {
              searchParam.delete('page');
            } else {
              searchParam.set('page', (page - 1).toString());
            }
          }

          return {
            component: Link,
            href: `${baseRoute}?${searchParam.toString()}`,
          };
        }}
      />
    </Center>
  );
}

export default memo(Pagination);
