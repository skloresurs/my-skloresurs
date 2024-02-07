import { Badge } from '@mantine/core';
import React, { memo } from 'react';

interface IProps {
  count: number;
  data?: unknown[];
  error?: unknown;
  isLoading?: boolean;
}

function TabCountBadge({ count, data, error, isLoading }: IProps) {
  if (isLoading) {
    return null;
  }

  if (error || !data) {
    return (
      <Badge color='red' variant='light'>
        Помилка
      </Badge>
    );
  }

  if (count === 0) {
    return null;
  }

  return (
    <Badge circle variant='light'>
      {count}
    </Badge>
  );
}

export default memo(TabCountBadge);
