'use client';

import 'moment/locale/uk';

import { Grid, Paper, Title } from '@mantine/core';
import React from 'react';

export default function MoreItem() {
  return (
    <Grid.Col span={{ base: 12, lg: 3, md: 6 }}>
      <Paper
        radius='lg'
        p='md'
        shadow='sm'
        component='button'
        className='flex h-full w-full items-center justify-center border-[var(--mantine-color-red-5)] bg-[var(--mantine-color-dark-8)] p-2'
      >
        <Title order={2} size='h4'>
          Завантажено 250 елементів. Щоб побачити більше, скористайтесь пошуком
        </Title>
      </Paper>
    </Grid.Col>
  );
}
