'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

import AgentsList from './agents/AgentsList';
import OrdersList from './orders/OrdersList';

export default function ManagerClientPage() {
  const searchParams = useSearchParams();

  if (searchParams.get('group-by-agents')) {
    return <AgentsList />;
  }
  return <OrdersList />;
}
