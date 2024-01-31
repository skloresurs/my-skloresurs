'use client';

import { Button, Flex, Popover } from '@mantine/core';
import React from 'react';

interface IProps {
  buttonLabel: string;
  buttonIcon?: React.ReactNode;
  children: React.ReactNode;
}

export default function InstrumentPopover({ buttonLabel, buttonIcon, children }: IProps) {
  const [opened, setOpened] = React.useState(false);

  return (
    <Popover width={350} position='bottom-end' withArrow shadow='md' opened={opened} onChange={setOpened}>
      <Popover.Target>
        <Button onClick={() => setOpened((o) => !o)} leftSection={buttonIcon}>
          {buttonLabel}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Flex direction='column' w='100%' gap='4px'>
          {children}
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
}
