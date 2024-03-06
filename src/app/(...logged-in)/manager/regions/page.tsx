import { Boxes, CircleUserRound, Filter } from 'lucide-react';
import React from 'react';

import RegionsList from '@/components/manager/regions/RegionsList';
import TitleBar from '@/components/TitleBar';
import InstrumentCheckbox from '@/components/ui/instruments/InstrumentCheckbox';
import InstrumentPopover from '@/components/ui/instruments/InstrumentPopover';
import InstrumentRedirectButton from '@/components/ui/instruments/InstrumentRedirectButton';
import InstrumentReset from '@/components/ui/instruments/InstrumentReset';
import InstrumentsBar from '@/components/ui/instruments/InstrumentsBar';
import InstrumentSearch from '@/components/ui/instruments/InstrumentSearch';

export default function ManagerOrderGroupedByAgentsPage() {
  return (
    <div className='space-y-4'>
      <TitleBar title='Регіони' />
      <InstrumentsBar>
        <InstrumentPopover buttonIcon={<Filter size={16} />}>
          <InstrumentSearch label='Пошук регіонів' />
          <InstrumentCheckbox
            paramKey='all'
            title='Всі регіони'
            description='Не показувати регіони замовлення, яких з статусом "Прийнятий Менеджером", "Відхилено", "Виконано" та старіші за 2 роки'
            enabledDescription='Показати всі регіони'
          />
          <InstrumentReset />
        </InstrumentPopover>
        <InstrumentRedirectButton href='/manager/agents' icon={<CircleUserRound />} tooltip='Контрагенти' />
        <InstrumentRedirectButton href='/manager' icon={<Boxes />} tooltip='Замовлення' />
      </InstrumentsBar>
      <RegionsList />
    </div>
  );
}
