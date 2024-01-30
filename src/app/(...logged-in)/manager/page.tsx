import React from 'react';

import ManagerClientPage from '@/components/manager/ManagerClientPage';
import ManagerInstruments from '@/components/manager/ManagerInstruments';
import TitleBar from '@/components/TitleBar';

export default function ManagerPage() {
  return (
    <>
      <TitleBar title='Замовлення' />
      <ManagerInstruments />
      <div className='mt-3'>
        <ManagerClientPage />
      </div>
    </>
  );
}
