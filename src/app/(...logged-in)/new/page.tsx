import React from 'react';

import NewOrder from '@/components/orders/NewOrder';
import TitleBar from '@/components/TitleBar';

export default function NewOrderPage() {
  return (
    <>
      <TitleBar title="Нове замовлення" />
      <NewOrder />
    </>
  );
}
