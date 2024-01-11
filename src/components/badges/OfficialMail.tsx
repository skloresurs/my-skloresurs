import { Tooltip } from '@mantine/core';
import { BadgeCheck } from 'lucide-react';
import React from 'react';

export default function OfficialMail() {
  return (
    <Tooltip label='Внутрішня пошта'>
      <BadgeCheck color='green' />
    </Tooltip>
  );
}
