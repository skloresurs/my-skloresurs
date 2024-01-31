'use client';

import { Switch, Text, UnstyledButton } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface IProps {
  paramKey: string;
  title: string;
  description: string;
  enabledDescription?: string;
  disabled?: boolean;
}

export default function InstrumentSwitch({ paramKey, title, description, enabledDescription, disabled }: IProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [checked, setChecked] = useState<boolean>(!!searchParams.get(paramKey));

  useEffect(() => {
    setChecked(!!searchParams.get(paramKey));
  }, [searchParams, paramKey]);

  function onChange() {
    setChecked(!checked);

    const current = new URLSearchParams([...searchParams]);
    current.delete('page');

    if (checked) {
      current.delete(paramKey);
    } else {
      current.set(paramKey, 'true');
    }

    const filter = current.toString();
    router.push(`${pathname}?${filter}`);
  }

  return (
    <UnstyledButton
      className='flex w-full rounded-[var(--mantine-radius-sm)] bg-[var(--mantine-color-dark-7)] p-[var(--mantine-spacing-md)] duration-300 hover:bg-[var(--mantine-color-dark-8)] disabled:cursor-not-allowed'
      onClick={onChange}
      disabled={disabled}
    >
      <Switch tabIndex={-1} size='md' mr='xs' aria-hidden checked={checked} disabled={disabled} />

      <div>
        <Text fw={500} mb={7} lh={1}>
          {title}
        </Text>
        <Text fz='sm' c='dimmed'>
          {checked ? enabledDescription ?? description : description}
        </Text>
      </div>
    </UnstyledButton>
  );
}
