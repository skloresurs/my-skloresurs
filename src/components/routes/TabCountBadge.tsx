import { Badge } from '@mantine/core';
import React, { memo } from 'react';

interface IProps {
  count: number;
}

function TabCountBadge({ count }: IProps) {
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
