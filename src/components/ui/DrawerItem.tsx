import { Group, Text } from '@mantine/core';
import React from 'react';

interface IProps {
  label: string;
  value: string | React.ReactNode;
}

export default function DrawerItem({ label, value }: IProps) {
  return (
    <Group>
      <Text>{label}:</Text>
      <div className='flex-1' />
      {value instanceof String ? <Text>{value}</Text> : value}
    </Group>
  );
}
