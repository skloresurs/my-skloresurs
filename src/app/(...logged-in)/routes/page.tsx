import { Filter } from 'lucide-react';
import React from 'react';

import RoutesList from '@/components/routes/RoutesList';
import TitleBar from '@/components/TitleBar';
import InstrumentPopover from '@/components/ui/instruments/InstrumentPopover';
import InstrumentReset from '@/components/ui/instruments/InstrumentReset';
import InstrumentsBar from '@/components/ui/instruments/InstrumentsBar';
import InstrumentSearch from '@/components/ui/instruments/InstrumentSearch';
import InstrumentSwitch from '@/components/ui/instruments/InstrumentSwitch';

export default function Routes() {
  return (
    <>
      <TitleBar title='Маршрути' />
      <InstrumentsBar>
        <InstrumentPopover buttonLabel='Фільтри' buttonIcon={<Filter size={16} />}>
          <InstrumentSearch label='Пошук маршрутів' description='Пошук маршрутів за їх ID та водієм' />
          <InstrumentSwitch
            paramKey='all'
            title='Всі маршрути'
            description='Показати лише затвержені та не завершені маршрути'
            enabledDescription='Показати всі маршрути'
          />
          <InstrumentReset />
        </InstrumentPopover>
      </InstrumentsBar>
      <RoutesList />
    </>
  );
}
