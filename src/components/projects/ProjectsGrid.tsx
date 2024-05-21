"use client";

import InstrumentPopover from "@/components/ui/instruments/InstrumentPopover";
import InstrumentReset from "@/components/ui/instruments/InstrumentReset";
import InstrumentsBar from "@/components/ui/instruments/InstrumentsBar";
import { Center, Grid, Skeleton } from "@mantine/core";
import { map } from "lodash";
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import ErrorAlert from "../ui/ErrorAlert";
import Pagination from "../ui/Pagination";
import InstrumentSelect from "../ui/instruments/InstrumentSelect";
import ProjectCard from "./ProjectCard";

const span = { base: 12, md: 6, lg: 4, xl: 3 };

export default function ProjectsGrid() {
  const query = useSearchParams();

  const { data, error, isValidating, mutate } = useSWR(`/api/projects?${query.toString()}`);
  if (isValidating) {
    return (
      <Grid>
        <Grid.Col span={span}>
          <Skeleton h="250px" />
        </Grid.Col>
        <Grid.Col span={span}>
          <Skeleton h="250px" />
        </Grid.Col>
        <Grid.Col span={span}>
          <Skeleton h="250px" />
        </Grid.Col>
        <Grid.Col span={span}>
          <Skeleton h="250px" />
        </Grid.Col>
      </Grid>
    );
  }

  if (error || !data?.data) {
    return (
      <Center>
        <ErrorAlert
          maw={576}
          w={576}
          title="Помилка"
          description="Не вдалось завантажити список проєктів"
          refresh={mutate}
        />
      </Center>
    );
  }

  return (
    <>
      <InstrumentsBar>
        <InstrumentPopover buttonIcon={<Filter size={16} />}>
          <InstrumentSelect paramKey="agent" label="Пошук за контрагентом" dataUrl="/api/data/agents" />
          <InstrumentReset />
        </InstrumentPopover>
      </InstrumentsBar>
      <Grid align="stretch">
        {map(data.data, (e) => (
          <Grid.Col key={e.id + e.agent.name} span={span}>
            <ProjectCard project={e} />
          </Grid.Col>
        ))}
      </Grid>
      <Pagination total={Math.ceil(data.total / 60)} query={query} />
    </>
  );
}
