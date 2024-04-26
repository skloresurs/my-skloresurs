"use client";

import { Center, Grid, type StyleProp } from "@mantine/core";
import { map } from "lodash";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import type { Order } from "@/types/manager/Order";

import ErrorAlert from "../../ui/ErrorAlert";
import GridSkeleton from "../../ui/GridSkeleton";
import InfoAlert from "../../ui/InfoAlert";
import Pagination from "../../ui/Pagination";
import OrderItem from "./OrderItem";

const span: StyleProp<number> = {
  base: 12,
  "2xs": 6,
  lg: 4,
  xl: 3,
  "2xl": 2,
};

interface IResponse {
  data: Order[];
  total: number;
}

export default function OrdersList() {
  const query = useSearchParams();
  const { data, error, isValidating, mutate } = useSWR<IResponse>(`/api/manager/orders/?${query.toString()}`);

  if (isValidating) {
    return (
      <GridSkeleton span={span} times={12}>
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
          description="Не вдалось завантажити список замовлень"
          refresh={mutate}
        />
      </Center>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Center>
        <InfoAlert
          maw={576}
          w={576}
          title="Немає замовлень"
          description="Не знадено жодного замовлення за вказаними параметрами"
        />
      </Center>
    );
  }

  return (
    <>
      <Grid>
        {map(data.data, (order) => (
          <Grid.Col span={span} key={order.id}>
            <OrderItem order={order} />
          </Grid.Col>
        ))}
      </Grid>
      <Pagination total={Math.ceil(data.total / 50)} query={query} />
    </>
  );
}
