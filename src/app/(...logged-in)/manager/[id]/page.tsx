import React from 'react';

import OrderClient from '@/components/manager/order/OrderClient';
import TitleBar from '@/components/TitleBar';

export default async function ManagerOrderPage({ params }: { params: { id: string } }) {
  return (
    <>
      <TitleBar title={`Замовлення #${params.id}`} backHref='/manager' />
      <OrderClient id={params.id} />
    </>
  );
}
