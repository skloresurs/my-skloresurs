import { Badge } from '@mantine/core';
import React, { memo } from 'react';

import IRoute from '@/types/Route';

interface IProps {
  route: IRoute;
}

function StatusBadge({ route }: IProps) {
  if (!route.approved) {
    return (
      <Badge className='cursor-default select-none' variant='light' color='red'>
        Не затверджено
      </Badge>
    );
  }

  if (!route.completed) {
    return (
      <Badge className='cursor-default select-none' variant='light' color='orange'>
        Затвержений
      </Badge>
    );
  }

  return (
    <Badge className='cursor-default select-none' variant='light' color='green'>
      Завершено
    </Badge>
  );
}

export default memo(StatusBadge);
