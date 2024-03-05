import React from 'react';

import RouteClient from '@/components/routes/route/RouteClient';
import TitleBar from '@/components/TitleBar';

export default function RoutePage({ params }: { params: { id: string } }) {
  return (
    <>
      <TitleBar title={`Маршрут #${params.id}`} enableBackButton />
      <RouteClient id={params.id} />
    </>
  );
}
