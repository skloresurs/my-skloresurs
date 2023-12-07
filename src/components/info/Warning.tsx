import { Tooltip } from '@mantine/core';
import { AlertCircle } from 'lucide-react';
import React from 'react';

export default function Warning({ label }: { label: string }) {
  return (
    <Tooltip label={label} color="gray" withArrow w={250} multiline>
      <AlertCircle color="var(--mantine-color-orange-5)" />
    </Tooltip>
  );
}
