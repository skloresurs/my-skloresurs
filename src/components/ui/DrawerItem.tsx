import { Group, Text } from '@mantine/core';
import React from 'react';

interface IProps {
  label: string;
  value: string;
}

export default function DrawerItem({ label, value }: IProps) {
  return (
    <Group>
      <Text>{label}:</Text>
      <Text className='flex-1 text-end'>{value}</Text>
    </Group>
  );
}
