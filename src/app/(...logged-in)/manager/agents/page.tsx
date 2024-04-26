import { Boxes, Filter, MapIcon } from "lucide-react";

import TitleBar from "@/components/TitleBar";
import AgentsList from "@/components/manager/agents/AgentsList";
import InstrumentCheckbox from "@/components/ui/instruments/InstrumentCheckbox";
import InstrumentPopover from "@/components/ui/instruments/InstrumentPopover";
import InstrumentRedirectButton from "@/components/ui/instruments/InstrumentRedirectButton";
import InstrumentReset from "@/components/ui/instruments/InstrumentReset";
import InstrumentSearch from "@/components/ui/instruments/InstrumentSearch";
import InstrumentsBar from "@/components/ui/instruments/InstrumentsBar";

export default function ManagerOrderGroupedByAgentsPage() {
  return (
    <div className="space-y-4">
      <TitleBar title="Контрагенти" />
      <InstrumentsBar>
        <InstrumentPopover buttonIcon={<Filter size={16} />}>
          <InstrumentSearch label="Пошук контрагетів" />
          <InstrumentCheckbox
            paramKey="all"
            title="Всі Контрагенти"
            description='Не показувати контрагентів замовлення, яких з статусом "Прийнятий Менеджером", "Відхилено", "Виконано" та старіші за 2 роки'
            enabledDescription="Показати всіх контрагентів"
          />
          <InstrumentReset />
        </InstrumentPopover>
        <InstrumentRedirectButton href="/manager/regions" icon={<MapIcon />} tooltip="Регіони" />
        <InstrumentRedirectButton href="/manager" icon={<Boxes />} tooltip="Замовлення" />
      </InstrumentsBar>
      <AgentsList />
    </div>
  );
}
