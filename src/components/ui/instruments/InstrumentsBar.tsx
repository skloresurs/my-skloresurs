import { Flex } from '@mantine/core';
import React, { memo } from 'react';

interface IProps {
  children: React.ReactNode;
}

function InstrumentsBar({ children }: IProps) {
  return (
    <Flex direction='row-reverse' gap='xs' my='md'>
      {children}
    </Flex>
  );
}

export default memo(InstrumentsBar);
