'use client';

import { notifications } from '@mantine/notifications';
import { ClipboardCopy } from 'lucide-react';
import React from 'react';
import { useCopyToClipboard } from 'react-use';
import { twMerge } from 'tailwind-merge';

interface IProps {
  title: string;
  data: string | React.ReactNode;
  enableCopy?: boolean;
  className?: string;
}

export default function DrawerItem({ title, data, enableCopy, className }: IProps) {
  const [, copyToClipboard] = useCopyToClipboard();

  function copy() {
    copyToClipboard(data as string);
    notifications.show({
      color: 'green',
      message: 'Успішно скопійовано!',
      title: 'Замовлення',
    });
  }

  return (
    <div className={twMerge('flex flex-row gap-2', className)}>
      <span>{title}:</span>
      <div className='flex-1 text-right'>{data}</div>
      {enableCopy && !React.isValidElement(data) && (
        <ClipboardCopy
          className='cursor-pointer duration-300 hover:text-[var(--mantine-color-blue-5)]'
          onClick={() => copy()}
        />
      )}
    </div>
  );
}
