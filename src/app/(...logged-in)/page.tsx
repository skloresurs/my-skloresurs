import { Button } from '@mantine/core';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import TitleBar from '@/components/TitleBar';

export default function Home() {
  return (
    <>
      <TitleBar title="Ваші замовлення" />
      <div className="flex flex-row items-center justify-end">
        <Button component={Link} href="/new" leftSection={<PlusCircle />}>
          Нове замовлення
        </Button>
      </div>
    </>
  );
}
