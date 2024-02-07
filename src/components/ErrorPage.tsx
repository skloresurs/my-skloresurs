import { Button, Container, Group, Text, Title } from '@mantine/core';
import React, { memo } from 'react';

import classes from '@/css/Error.module.css';

interface IProps {
  code: number;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}

function ErrorPage({ code, title, description, buttonLabel, onClick }: IProps) {
  return (
    <Container className={classes.root}>
      <Text className={classes.label}>{code}</Text>
      <Title className={classes.title}>{title}</Title>
      <Text c='dimmed' size='lg' ta='center' className={classes.description}>
        {description}
      </Text>
      <Group justify='center'>
        <Button onClick={() => onClick()} variant='subtle' size='md'>
          {buttonLabel}
        </Button>
      </Group>
    </Container>
  );
}

export default memo(ErrorPage);
