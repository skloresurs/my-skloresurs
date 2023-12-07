import { Tooltip } from '@mantine/core';
import { Info as InfoIcon } from 'lucide-react';
import React from 'react';

export default function Info({ label }: { label: string }) {
  return (
    <Tooltip label={label} color="gray" withArrow w={250} multiline>
      <InfoIcon color="var(--mantine-color-blue-5)" />
    </Tooltip>
  );
}
