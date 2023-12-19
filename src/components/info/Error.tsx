import { Tooltip } from '@mantine/core';
import { XCircle } from 'lucide-react';
import React from 'react';

export default function Error({ label }: { label: string }) {
  return (
    <Tooltip label={label} color='gray' withArrow w={250} multiline>
      <XCircle color='var(--mantine-color-red-5)' />
    </Tooltip>
  );
}
