import { Filter } from 'lucide-react';
import React from 'react';

import ManagerClientPage from '@/components/manager/ManagerClientPage';
import TitleBar from '@/components/TitleBar';
import InstrumentPopover from '@/components/ui/instruments/InstrumentPopover';
import InstrumentReset from '@/components/ui/instruments/InstrumentReset';
import InstrumentResetOne from '@/components/ui/instruments/InstrumentResetOne';
import InstrumentsBar from '@/components/ui/instruments/InstrumentsBar';
import InstrumentSearch from '@/components/ui/instruments/InstrumentSearch';
import InstrumentSwitch from '@/components/ui/instruments/InstrumentSwitch';

export default function ManagerPage() {
  return (
    <>
      <TitleBar title='Замовлення' />
      <InstrumentsBar>
        <InstrumentPopover buttonLabel='Фільтри' buttonIcon={<Filter size={16} />}>
          <InstrumentSearch label='Пошук замовлень' />
          <InstrumentSwitch
            paramKey='all'
            title='Всі замовлення'
            description='Не показувати замовлення з статусом "Прийнятий Менеджером", "Відхилено", "Виконано" та замовлення старіші за 2 роки'
            enabledDescription='Показати всі замовлення'
          />

          <InstrumentSwitch
            paramKey='group-by-agents'
            title='Групувати за контрагентами (BETA)'
            description='Показати список замовлень за заданими параметрами'
            enabledDescription='Показати список контагентів за заданими параметрами'
          />
          <InstrumentResetOne title='Скинути контрагента' paramKey='agent' />
          <InstrumentReset />
        </InstrumentPopover>
      </InstrumentsBar>
      <div className='mt-3'>
        <ManagerClientPage />
      </div>
    </>
  );
}
