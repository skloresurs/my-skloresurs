import { Filter } from "lucide-react";

import TitleBar from "@/components/TitleBar";
import RoutesList from "@/components/routes/list/RoutesList";
import InstrumentCheckbox from "@/components/ui/instruments/InstrumentCheckbox";
import InstrumentPopover from "@/components/ui/instruments/InstrumentPopover";
import InstrumentReset from "@/components/ui/instruments/InstrumentReset";
import InstrumentSearch from "@/components/ui/instruments/InstrumentSearch";
import InstrumentsBar from "@/components/ui/instruments/InstrumentsBar";

export default function Routes() {
  return (
    <>
      <TitleBar title="Маршрути" />
      <InstrumentsBar>
        <InstrumentPopover buttonIcon={<Filter size={16} />}>
          <InstrumentSearch label="Пошук маршрутів" description="Пошук маршрутів за їх ID та водієм" />
          <InstrumentCheckbox
            paramKey="all"
            title="Всі маршрути"
            description='Показати лише маршрути з статусом "Затверджено" та створені не пізніше ніж день тому. Сховати маршрути з самовивозом.'
            enabledDescription="Показати всі маршрути."
          />
          <InstrumentReset />
        </InstrumentPopover>
      </InstrumentsBar>
      <RoutesList />
    </>
  );
}
