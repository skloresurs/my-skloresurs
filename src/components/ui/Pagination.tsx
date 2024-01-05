import { Center, Pagination as MantinePagination } from '@mantine/core';
import Link from 'next/link';
import { ReadonlyURLSearchParams } from 'next/navigation';
import React from 'react';

interface PaginationProps {
  total: number;
  query: ReadonlyURLSearchParams;
  baseRoute: string;
}
export default function Pagination({ total, query, baseRoute }: PaginationProps) {
  const searchParam = new URLSearchParams([...query.entries()]);
  const pageNumber = query.get('page') ?? 1;
  const page = Number.isNaN(Number(pageNumber)) ? 1 : Number(pageNumber);
  return (
    <Center my='md'>
      <MantinePagination
        value={page}
        total={total}
        withEdges
        getItemProps={(e) => {
          searchParam.set('page', e.toString());
          return {
            component: Link,
            href: `${baseRoute}?${searchParam.toString()}`,
          };
        }}
        getControlProps={(e) => {
          if (e === 'first') {
            searchParam.delete('page');
          }
          if (e === 'last') {
            searchParam.set('page', total.toString());
          }
          if (e === 'next') {
            searchParam.set('page', (page + 1).toString());
          }
          if (e === 'previous') {
            searchParam.set('page', (page - 1).toString());
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
