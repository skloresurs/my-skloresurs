import { Badge } from '@mantine/core';
import React from 'react';

interface IProps {
  data?: unknown[];
  error?: unknown;
  isLoading?: boolean;
}

export default function TabCountBadge({ data, error, isLoading }: IProps) {
  if (isLoading) {
    return null;
  }

  if (error || !data) {
    return <Badge color='red'>Помилка</Badge>;
  }

  return <Badge>{data.length}</Badge>;
}
