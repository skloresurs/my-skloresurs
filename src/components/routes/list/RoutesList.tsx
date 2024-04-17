"use client";

import { Center, Grid } from "@mantine/core";
import { map } from "lodash";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import type { Route } from "@/types/route/Route";

import ErrorAlert from "../../ui/ErrorAlert";
import GridSkeleton from "../../ui/GridSkeleton";
import InfoAlert from "../../ui/InfoAlert";
import Pagination from "../../ui/Pagination";
import RouteItem from "./RouteItem";

interface IResponse {
  data: Route[];
  total: number;
}

const span = { base: 12, xs: 6, lg: 3, xl: 2.4 };

export default function RoutesList() {
  const query = useSearchParams();
  const { data, error, isValidating, mutate } = useSWR<IResponse>(`/api/routes/?${query.toString()}`);
  if (isValidating) {
    return (
      <GridSkeleton span={span} times={10}>
        <div className="h-[250px]" />
      </GridSkeleton>
    );
  }

  if (error) {
    return (
      <Center>
        <ErrorAlert
          maw={576}
          w={576}
          title="Помилка"
          description="Не вдалось завантажити список маршрутів"
          refresh={mutate}
        />
      </Center>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Center>
        <InfoAlert maw={576} w={576} title="Немає маршрутів" description="Не знадено жодного маршруту" />
      </Center>
    );
  }

  return (
    <>
      <Grid gutter="xs">
        {map(data.data, (e) => (
          <Grid.Col key={e.id} span={span}>
            <RouteItem route={e} />
          </Grid.Col>
        ))}
      </Grid>

      <Pagination query={query} total={Math.ceil(data.total / 60)} />
    </>
  );
}
