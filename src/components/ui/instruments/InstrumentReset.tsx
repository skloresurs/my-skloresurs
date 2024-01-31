'use client';

import { Button } from '@mantine/core';
import { FilterX } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function InstrumentReset() {
  const pathname = usePathname();
  return (
    <Button component={Link} href={pathname} color='red' variant='outline' leftSection={<FilterX size={16} />}>
      Скинути фільтри
    </Button>
  );
}
