'use client';

import { ActionIcon, Divider, Group, Text, Title } from '@mantine/core';
import { ArrowLeft, Link } from 'lucide-react';
import React from 'react';

interface IProps {
  title: string;
  description?: string;
  backHref?: string;
}

export default function TitleBar({ title, description, backHref }: IProps) {
  return (
    <div>
      <Group>
        {backHref && (
          <ActionIcon variant='subtle' aria-label='Settings' component={Link} href={backHref}>
            <ArrowLeft size={28} />
          </ActionIcon>
        )}
        <Title order={1}>{title}</Title>
      </Group>
      {description && (
        <Text size='sm' my='sm'>
          {description}
        </Text>
      )}
      <Divider className='my-2' />
    </div>
  );
}
