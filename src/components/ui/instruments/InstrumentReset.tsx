'use client';

import { Button } from '@mantine/core';
import { FilterX } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { memo } from 'react';

function InstrumentReset() {
  const pathname = usePathname();
  return (
    <Button component={Link} href={pathname} color='red' variant='outline' leftSection={<FilterX size={16} />}>
      Скинути фільтри
    </Button>
  );
}

export default memo(InstrumentReset);
