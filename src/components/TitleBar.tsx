'use client';

import { Divider, Title } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface IProps {
  title: string;
  description?: string;
  backHref?: string;
}

export default function TitleBar({ title, description, backHref }: IProps) {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-row items-center gap-2">
        {backHref && (
          <ArrowLeft
            size={28}
            className="min-w-[30px] cursor-pointer duration-300 hover:scale-105 hover:text-[var(--mantine-color-blue-5)]"
            onClick={() => router.push(backHref)}
          />
        )}
        <Title order={1}>{title}</Title>
      </div>
      {description && <span className="my-2 text-sm">{description}</span>}
      <Divider className="my-2" />
    </div>
  );
}
