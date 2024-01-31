'use client';

import { Button } from '@mantine/core';
import { FilterX } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';

interface IProps {
  paramKey: string;
  title: string;
}

export default function InstrumentResetOne({ paramKey, title }: IProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const path = useMemo(() => {
    const current = new URLSearchParams([...searchParams]);

    current.delete('page');
    current.delete(paramKey);

    return `${pathname}?${current.toString()}`;
  }, [paramKey, pathname, searchParams]);

  if (!searchParams.get(paramKey)) {
    return null;
  }

  return (
    <Button component={Link} href={path} color='red' variant='outline' leftSection={<FilterX size={16} />}>
      {title}
    </Button>
  );
}
