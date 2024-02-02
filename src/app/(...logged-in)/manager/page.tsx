import { Filter } from 'lucide-react';
import React from 'react';

import ManagerClientPage from '@/components/manager/ManagerClientPage';
import TitleBar from '@/components/TitleBar';
import InstrumentCheckbox from '@/components/ui/instruments/InstrumentCheckbox';
import InstrumentPopover from '@/components/ui/instruments/InstrumentPopover';
import InstrumentReset from '@/components/ui/instruments/InstrumentReset';
import InstrumentResetOne from '@/components/ui/instruments/InstrumentResetOne';
import InstrumentsBar from '@/components/ui/instruments/InstrumentsBar';
import InstrumentSearch from '@/components/ui/instruments/InstrumentSearch';

export default function ManagerPage() {
  return (
    <>
      <TitleBar title='Замовлення' />
      <InstrumentsBar>
        <InstrumentPopover buttonLabel='Фільтри' buttonIcon={<Filter size={16} />}>
          <InstrumentSearch label='Пошук замовлень' />
          <InstrumentCheckbox
            paramKey='all'
            title='Всі замовлення'
            description='Не показувати замовлення з статусом "Прийнятий Менеджером", "Відхилено", "Виконано" та замовлення старіші за 2 роки'
            enabledDescription='Показати всі замовлення'
          />
          <InstrumentCheckbox
            paramKey='storage'
            title='Показати замовлення на складі'
            description='Не показувати замовлення з статусом "Склад" (ігнорується при "Всі замовлення")'
            enabledDescription='Показувати замовлення з статусом "Склад"'
          />
          <InstrumentCheckbox
            paramKey='group-by-agents'
            title='Групувати за контрагентами'
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
