import { Filter } from 'lucide-react';
import React from 'react';

import RoutesList from '@/components/routes/list/RoutesList';
import TitleBar from '@/components/TitleBar';
import InstrumentCheckbox from '@/components/ui/instruments/InstrumentCheckbox';
import InstrumentPopover from '@/components/ui/instruments/InstrumentPopover';
import InstrumentReset from '@/components/ui/instruments/InstrumentReset';
import InstrumentsBar from '@/components/ui/instruments/InstrumentsBar';
import InstrumentSearch from '@/components/ui/instruments/InstrumentSearch';

export default function Routes() {
  return (
    <>
      <TitleBar title='Маршрути' />
      <InstrumentsBar>
        <InstrumentPopover buttonIcon={<Filter size={16} />}>
          <InstrumentSearch label='Пошук маршрутів' description='Пошук маршрутів за їх ID та водієм' />
          <InstrumentCheckbox
            paramKey='all'
            title='Всі маршрути'
            description='Показати лише маршрути з статусом "Затверджено" та створені не пізніше ніж тиждень тому. Сховати маршрути з самовивозом.'
            enabledDescription='Показати всі маршрути.'
          />
          <InstrumentReset />
        </InstrumentPopover>
      </InstrumentsBar>
      <RoutesList />
    </>
  );
}
