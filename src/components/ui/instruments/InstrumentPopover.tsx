'use client';

import { ActionIcon, Flex, Popover } from '@mantine/core';
import React, { memo } from 'react';

interface IProps {
  buttonIcon: React.ReactNode;
  children: React.ReactNode;
}

function InstrumentPopover({ buttonIcon, children }: IProps) {
  const [opened, setOpened] = React.useState(false);

  return (
    <Popover width={350} position='bottom-end' withArrow shadow='md' opened={opened} onChange={setOpened}>
      <Popover.Target>
        <ActionIcon size='lg' onClick={() => setOpened((o) => !o)}>
          {buttonIcon}
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Flex direction='column' w='100%' gap='4px'>
          {children}
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
}

export default memo(InstrumentPopover);
