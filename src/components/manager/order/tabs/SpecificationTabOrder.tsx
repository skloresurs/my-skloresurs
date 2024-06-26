"use client";

import { Container, Stack, Text } from "@mantine/core";
import { reduce, sortBy } from "lodash";
import { Sigma } from "lucide-react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import { memo, useMemo, useState } from "react";
import { useWindowSize } from "react-use";

import type Goods from "@/types/manager/Goods";
import type { FullOrder } from "@/types/manager/Order";

interface IProps {
  order: FullOrder;
}

function SpecificationTabOrder({ order }: IProps) {
  const { height } = useWindowSize();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Goods>>({
    columnAccessor: "position",
    direction: "asc",
  });

  const records = useMemo(
    () =>
      sortStatus.direction === "desc"
        ? sortBy(order.goods, sortStatus.columnAccessor).toReversed()
        : sortBy(order.goods, sortStatus.columnAccessor),
    [order, sortStatus],
  );

  const groups = useMemo(
    () => [
      {
        columns: [
          {
            accessor: "position",
            footer: (
              <div className="flex items-center">
                <Sigma size={20} />
              </div>
            ),
            footerClassName: "bg-dark-6",
            sortable: true,
            title: "#",
          },
        ],
        id: "base",
        title: "",
      },
      {
        columns: [
          {
            accessor: "amount",
            footer: <span>{Math.round(reduce(order.goods, (a, b) => a + b.amount, 0) * 1000) / 1000}</span>,
            footerClassName: "bg-dark-6",
            sortable: true,
            title: "S m²",
          },
          {
            accessor: "pieces",
            footer: <span>{Math.round(reduce(order.goods, (a, b) => a + b.pieces, 0) * 1000) / 1000}</span>,
            footerClassName: "bg-dark-6",
            sortable: true,
            title: "Шт.",
          },
        ],
        id: "count",
        title: "Замовлення",
      },
      {
        columns: [
          {
            accessor: "in",
            footer: <span>{Math.round(reduce(order.goods, (a, b) => a + b.in, 0) * 1000) / 1000}</span>,
            footerClassName: "bg-dark-6",
            render: (record: Goods) => <span>{record.in === 0 ? "" : record.in}</span>,
            sortable: true,
            title: "Шт.",
          },
        ],
        id: "movements",
        title: "Склад",
      },
      {
        columns: [
          {
            accessor: "out",
            footer: <span>{Math.round(reduce(order.goods, (a, b) => a + b.out, 0) * 1000) / 1000}</span>,
            footerClassName: "bg-dark-6",
            render: (record: Goods) => <span>{record.out === 0 ? "" : record.out}</span>,
            sortable: true,
            title: "Шт.",
          },
        ],
        id: "client",
        title: "Клієнт",
      },
    ],
    [order],
  );

  return (
    <Container mt="sm" fluid={true} p="0" h={height - 300}>
      <DataTable
        withTableBorder={true}
        withColumnBorders={true}
        highlightOnHover={true}
        groups={groups}
        records={records}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        minHeight="100%"
        noRecordsText="Немає даних"
        idAccessor="position"
        rowExpansion={{
          // eslint-disable-next-line react/no-unstable-nested-components -- Library component
          content: ({ record }) => (
            <Stack w="100%" p="md" gap="md">
              <Stack gap="0">
                <Text span={true} fw={600}>
                  Номенклатура:
                </Text>
                {record.name}
              </Stack>
              <Stack gap="0">
                <Text span={true} fw={600}>
                  Розміри:
                </Text>
                {`${record.width} x ${record.height} m²`}
              </Stack>
            </Stack>
          ),
        }}
      />
    </Container>
  );
}

export default memo(SpecificationTabOrder);
