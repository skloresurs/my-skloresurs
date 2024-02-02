import { ActionIcon, Button } from '@mantine/core';
import React from 'react';

interface IProps {
  link: string | null;
  full?: boolean;
  fullWidth?: boolean;
  label?: string;
  icon?: React.ReactNode;
  target?: React.HTMLAttributeAnchorTarget;
}

export default function OutsideLinkButton({ link, full, fullWidth, label, icon, target }: IProps) {
  if (full) {
    return (
      <Button
        component='a'
        href={link ?? '#'}
        variant='light'
        fullWidth={fullWidth}
        leftSection={icon}
        data-disabled={!link}
        target={target}
        onClick={(event) => {
          if (!link) event.preventDefault();
        }}
      >
        {label}
      </Button>
    );
  }

  return (
    <ActionIcon
      component='a'
      href={link ?? '#'}
      data-disabled={!link}
      onClick={(event) => {
        if (!link) event.preventDefault();
      }}
      target={target}
      variant='light'
      size='lg'
    >
      {icon}
    </ActionIcon>
  );
}
