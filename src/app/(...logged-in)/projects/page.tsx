import TitleBar from "@/components/TitleBar";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import InstrumentPopover from "@/components/ui/instruments/InstrumentPopover";
import InstrumentReset from "@/components/ui/instruments/InstrumentReset";
import InstrumentSearch from "@/components/ui/instruments/InstrumentSearch";
import InstrumentSelect from "@/components/ui/instruments/InstrumentSelect";
import InstrumentsBar from "@/components/ui/instruments/InstrumentsBar";
import { Filter } from "lucide-react";

export default function Page() {
  return (
    <>
      <TitleBar title="Проекти" />
      <InstrumentsBar>
        <InstrumentPopover buttonIcon={<Filter size={16} />}>
          <InstrumentSearch label="Пошук" />
          <InstrumentSelect paramKey="agent" label="Пошук за контрагентом" dataUrl="/api/data/agents" />
          <InstrumentReset />
        </InstrumentPopover>
      </InstrumentsBar>
      <ProjectsGrid />
    </>
  );
}
