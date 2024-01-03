'use client';

import { notifications } from '@mantine/notifications';
import { ClipboardCopy } from 'lucide-react';
import React, { memo } from 'react';
import { useCopyToClipboard } from 'react-use';

interface IProps {
  title: string;
  data: string;
  enableCopy?: boolean;
  className?: string;
}
const DrawerItemMultiLine = ({ title, data, enableCopy, className }: IProps) => {
  const [, copyToClipboard] = useCopyToClipboard();

  function copy() {
    copyToClipboard(data);
    notifications.show({
      color: 'green',
      message: 'Успішно скопійовано!',
      title: 'Замовлення',
    });
  }

  return (
    <div className={className}>
      <div className='flex flex-row gap-2'>
        <span className='flex-1'>{title}:</span>
        {enableCopy && (
          <ClipboardCopy
            className='cursor-pointer duration-300 hover:text-[var(--mantine-color-blue-5)]'
            onClick={() => copy()}
          />
        )}
      </div>
      <span>{data}</span>
    </div>
  );
};

export default memo(DrawerItemMultiLine);
