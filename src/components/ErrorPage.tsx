import { Button, Container, Group, Text, Title } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

import classes from '@/css/Error.module.css';

interface IProps {
  code: number;
  title: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
}

export default function ErrorPage({
  code,
  title,
  description,
  buttonLabel,
  buttonLink,
}: IProps) {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>{code}</div>
      <Title className={classes.title}>{title}</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        {description}
      </Text>
      <Group justify="center">
        <Button component={Link} href={buttonLink} variant="subtle" size="md">
          {buttonLabel}
        </Button>
      </Group>
    </Container>
  );
}
