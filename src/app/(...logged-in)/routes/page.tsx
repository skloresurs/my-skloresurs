import React from 'react';

import RoutesList from '@/components/routes/RoutesList';
import TitleBar from '@/components/TitleBar';

export default function Routes() {
  return (
    <>
      <TitleBar title='Маршрути' />
      <RoutesList />
    </>
  );
}
