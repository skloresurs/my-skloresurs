import { Group, Text } from '@mantine/core';
import React, { memo } from 'react';

interface IProps {
  label: string;
  value?: string;
  children?: React.ReactNode;
}

function DrawerItem({ label, value, children }: IProps) {
  return (
    <Group align='center'>
      <Text fw='bold'>{label}:</Text>
      <div className='flex-1' />
      <Group align='center' gap='xs'>
        {value && <Text>{value}</Text>}
        {children}
      </Group>
    </Group>
  );
}

export default memo(DrawerItem);
