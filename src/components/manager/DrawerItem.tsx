'use client';

import { MantineColor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ClipboardCopy } from 'lucide-react';
import React, { memo } from 'react';
import { useCopyToClipboard } from 'react-use';
import { twMerge } from 'tailwind-merge';

interface IProps {
  title: string;
  data: string | React.ReactNode;
  enableCopy?: boolean;
  textColor?: MantineColor;
  className?: string;
}

const DrawerItem = ({ title, data, enableCopy, textColor, className }: IProps) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const textClass = textColor ? `text-[var(--mantine-color-${textColor}-5)]` : '';

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
      <div className={twMerge('flex-1 text-right', textClass)}>{data}</div>
      {enableCopy && !React.isValidElement(data) && (
        <ClipboardCopy
          className='cursor-pointer duration-300 hover:text-[var(--mantine-color-blue-5)]'
          onClick={() => copy()}
        />
      )}
    </div>
  );
};

export default memo(DrawerItem);
