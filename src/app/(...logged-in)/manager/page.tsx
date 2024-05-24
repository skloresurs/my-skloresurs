import { CircleUserRound, Filter, MapIcon } from "lucide-react";

import TitleBar from "@/components/TitleBar";
import OrdersList from "@/components/manager/orders/OrdersList";
import InstrumentCheckbox from "@/components/ui/instruments/InstrumentCheckbox";
import InstrumentPopover from "@/components/ui/instruments/InstrumentPopover";
import InstrumentRedirectButton from "@/components/ui/instruments/InstrumentRedirectButton";
import InstrumentReset from "@/components/ui/instruments/InstrumentReset";
import InstrumentResetOne from "@/components/ui/instruments/InstrumentResetOne";
import InstrumentSearch from "@/components/ui/instruments/InstrumentSearch";
import InstrumentsBar from "@/components/ui/instruments/InstrumentsBar";

export default function ManagerPage() {
  return (
    <>
      <TitleBar title="Замовлення" />
      <InstrumentsBar>
        <InstrumentPopover buttonIcon={<Filter size={16} />}>
          <InstrumentSearch label="Пошук замовлень" />
          <InstrumentCheckbox
            paramKey="all"
            title="Всі замовлення"
            description='Не показувати замовлення з статусом "Прийнятий Менеджером", "Відхилено", "Виконано" та замовлення старіші за 2 роки'
            enabledDescription="Показати всі замовлення"
          />
          <InstrumentCheckbox
            paramKey="storage"
            title="Показати лише замовлення на складі"
            description="Показувати замовлення з іншими статусами"
            enabledDescription='Показувати замовлення лише з статусом "Склад"'
          />
          <InstrumentCheckbox
            paramKey="debt"
            title="Борг до відвантаження"
            description="Показувати всі замовлення"
            enabledDescription="Показувати замовлення лише з боргом до відвантаження"
          />
          <InstrumentResetOne title="Скинути контрагента" paramKey="agent" />
          <InstrumentResetOne title="Скинути регіон" paramKey="region" />
          <InstrumentResetOne title="Скинути рахунок" paramKey="bill" />
          <InstrumentReset />
        </InstrumentPopover>
        <InstrumentRedirectButton href="/manager/regions" icon={<MapIcon />} tooltip="Регіони" />
        <InstrumentRedirectButton href="/manager/agents" icon={<CircleUserRound />} tooltip="Контрагенти" />
      </InstrumentsBar>
      <div className="mt-3">
        <OrdersList />
      </div>
    </>
  );
}
