import React from 'react';

import Support from '@/components/Support';
import TitleBar from '@/components/TitleBar';

export default async function SupportPage() {
  return (
    <>
      <TitleBar title="Підтримка" />
      <Support />
    </>
  );
}
