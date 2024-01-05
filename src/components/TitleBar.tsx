'use client';

import { ActionIcon, Divider, Text, Title } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface IProps {
  title: string;
  description?: string;
  backHref?: string;
}

export default function TitleBar({ title, description, backHref }: IProps) {
  return (
    <div>
      <Text>
        {backHref && (
          <ActionIcon display='inline' variant='subtle' aria-label='Settings' mr='sm' component={Link} href={backHref}>
            <ArrowLeft size={28} />
          </ActionIcon>
        )}
        <Title display='inline' order={1}>
          {title}
        </Title>
      </Text>
      {description && (
        <Text size='sm' my='sm'>
          {description}
        </Text>
      )}
      <Divider className='my-2' />
    </div>
  );
}
