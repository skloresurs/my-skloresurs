'use client';

import { Center, Grid, Pagination as MantinePagination } from '@mantine/core';
import { fill, map, max } from 'lodash';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import Route from './Route';

const array = fill(Array.from({ length: 50 }), nanoid());

interface PaginationProps {
  value: number;
  total: number;
}
function Pagination({ value, total }: PaginationProps) {
  return (
    <Center my='md'>
      <MantinePagination
        value={value}
        total={total}
        withEdges
        getItemProps={(e) => ({
          component: Link,
          href: `/routes?page=${e}`,
        })}
        getControlProps={(e) => {
          if (e === 'first') {
            return {
              component: Link,
              href: `/routes`,
            };
          }
          if (e === 'last') {
            return {
              component: Link,
              href: `/routes?page=${total}`,
            };
          }
          if (e === 'next') {
            return {
              component: Link,
              href: `/routes?page=${value + 1}`,
            };
          }
          if (e === 'previous') {
            if (value <= 2) {
              return {
                component: Link,
                href: `/routes`,
              };
            }
            return {
              component: Link,
              href: `/routes?page=${value - 1}`,
            };
          }
          return {};
        }}
      />
    </Center>
  );
}

export default function RoutesList() {
  const searchParam = useSearchParams();
  const page = max([1, Number(searchParam.get('page')) ?? 1]) ?? 1;

  return (
    <>
      <Pagination value={page} total={10} />

      <Grid grow gutter='xs'>
        {map(array, (e) => (
          <Grid.Col key={e} span={{ base: 12, xs: 6, lg: 3, xl: 2 }}>
            <Route />
          </Grid.Col>
        ))}
      </Grid>

      <Pagination value={page} total={10} />
    </>
  );
}
