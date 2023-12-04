'use client';

import { Button, Container, Group, Text, Title } from '@mantine/core';
import React from 'react';

import classes from '@/css/ServerError.module.css';

export default function ServerError() {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>500</div>
        <Title className={classes.title}>Щойно сталося щось погане...</Title>
        <Text size="lg" ta="center" className={classes.description}>
          Наші сервери не змогли обробити ваш запит. Спробуйте оновити сторінку.
        </Text>
        <Group justify="center">
          <Button
            onClick={() => window.location.reload()}
            variant="white"
            size="md"
          >
            Оновіть сторінку
          </Button>
        </Group>
      </Container>
    </div>
  );
}
