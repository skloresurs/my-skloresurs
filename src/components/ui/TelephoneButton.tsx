import { ActionIcon, Button } from '@mantine/core';
import { Phone } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface IProps {
  tel?: string | null;
  full?: boolean;
}

export default function TelephoneButton({ tel, full }: IProps) {
  if (!tel) return null;

  if (full) {
    return (
      <Button component={Link} href={`tel:${tel}`} variant='light' leftSection={<Phone size={16} />}>
        Зателефонувати
      </Button>
    );
  }

  return (
    <ActionIcon component={Link} href={`tel:${tel}`} variant='light' size='lg'>
      <Phone size={20} />
    </ActionIcon>
  );
}
