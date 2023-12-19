import { Tooltip } from '@mantine/core';
import { Fingerprint } from 'lucide-react';
import React from 'react';

export default function Id({ label }: { label: string }) {
  return (
    <Tooltip label={label} color='gray' withArrow w={250} multiline>
      <Fingerprint color='var(--mantine-color-green-5)' />
    </Tooltip>
  );
}
