import React from 'react';

import OrdersFilter from '@/components/manager/OrdersFilter';
import OrdersList from '@/components/manager/OrdersList';
import TitleBar from '@/components/TitleBar';

export default function Orders() {
  return (
    <>
      <TitleBar title="Замовлення" />
      <OrdersFilter />
      <div className="mt-3">
        <OrdersList />
      </div>
    </>
  );
}
