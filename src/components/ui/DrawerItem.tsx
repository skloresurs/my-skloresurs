import { Group, Text } from '@mantine/core';
import React from 'react';

interface IProps {
  label: string;
  value?: string;
  children?: React.ReactNode;
}

export default function DrawerItem({ label, value, children }: IProps) {
  return (
    <Group>
      <Text>{label}:</Text>
      <div className='flex-1' />
      <Group align='end' gap='xs'>
        {value && <Text>{value}</Text>}
        {children}
      </Group>
    </Group>
  );
}
