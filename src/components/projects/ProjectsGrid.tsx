"use client";

import { Center, Grid, Skeleton } from "@mantine/core";
import { map } from "lodash";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import ErrorAlert from "../ui/ErrorAlert";
import Pagination from "../ui/Pagination";
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
      <Grid align="stretch">
        {map(data.data, (e) => (
          <Grid.Col key={e.id} span={span}>
            <ProjectCard project={e} />
          </Grid.Col>
        ))}
      </Grid>
      <Pagination total={Math.ceil(data.total / 60)} query={query} />
    </>
  );
}
