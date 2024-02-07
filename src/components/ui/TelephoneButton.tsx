import { ActionIcon, Button } from '@mantine/core';
import { Phone } from 'lucide-react';
import React, { memo } from 'react';

interface IProps {
  tel?: string | null;
  full?: boolean;
}

function TelephoneButton({ tel, full }: IProps) {
  if (full) {
    return (
      <Button
        component='a'
        href={tel ? `tel:${tel}` : '#'}
        variant='light'
        leftSection={<Phone size={16} />}
        data-disabled={!tel}
        onClick={(event) => {
          if (!tel) event.preventDefault();
        }}
      >
        Зателефонувати
      </Button>
    );
  }

  return (
    <ActionIcon
      component='a'
      href={tel ? `tel:${tel}` : '#'}
      data-disabled={!tel}
      onClick={(event) => {
        if (!tel) event.preventDefault();
      }}
      variant='light'
      size='lg'
    >
      <Phone size={20} />
    </ActionIcon>
  );
}

export default memo(TelephoneButton);
