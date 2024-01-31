import { Flex } from '@mantine/core';
import React from 'react';

interface IProps {
  children: React.ReactNode;
}

export default function InstrumentsBar({ children }: IProps) {
  return (
    <Flex direction='row-reverse' gap='xs' my='md'>
      {children}
    </Flex>
  );
}
