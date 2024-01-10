import { Badge } from '@mantine/core';
import React from 'react';

interface IProps {
  completed: boolean;
}

export default function RouteStatusBadge({ completed }: IProps) {
  return <Badge color={completed ? 'green' : 'orange'}>{completed ? 'Завершено' : 'Активний'}</Badge>;
}
