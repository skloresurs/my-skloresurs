"use client";

import TitleBar from "@/components/TitleBar";
import type { CommercialOffer, CommercialOfferDetail } from "@/types/projects/CommercialOffer";
import { ActionIcon, Group, NumberFormatter, Popover, PopoverDropdown, PopoverTarget, Text } from "@mantine/core";
import { MessageCircleMore } from "lucide-react";
import { DataTable, type DataTableColumn } from "mantine-datatable";
import { redirect } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const mainTableColumns: DataTableColumn<CommercialOffer>[] = [
  {
    accessor: "id",
    title: "Назва",
  },
  {
    accessor: "comment",
    title: "",
    textAlign: "right",
    render: ({ comment }) => (
      <Group justify="end">
        {comment && (
          <Popover>
            <PopoverTarget>
              <ActionIcon size="lg" radius="xl" variant="light" c="blue">
                <MessageCircleMore />
              </ActionIcon>
            </PopoverTarget>
            <PopoverDropdown maw="350px" p="xs">
              {comment}
            </PopoverDropdown>
          </Popover>
        )}
      </Group>
    ),
  },
  {
    accessor: "price",
    title: "Сума",
    textAlign: "right",
    width: "120px",
    render: ({ price }) => <NumberFormatter value={price} fixedDecimalScale decimalScale={0} thousandSeparator=" " />,
  },
];

const subTableColumns: DataTableColumn<CommercialOfferDetail>[] = [
  {
    accessor: "name",
    title: "Назва",
    render: ({ name }) => (
      <Text size="xs" miw={250}>
        {name}
      </Text>
    ),
  },
  {
    accessor: "size",
    title: "Площа",
    textAlign: "right",
    width: "120px",
    render: ({ count, countSuffix }) => (
      <NumberFormatter
        value={count}
        suffix={` ${countSuffix}`}
        fixedDecimalScale
        decimalScale={0}
        thousandSeparator=" "
      />
    ),
  },
  {
    accessor: "price",
    title: "Сума",
    width: "120px",
    textAlign: "right",
    render: ({ price }) => <NumberFormatter value={price} decimalScale={0} fixedDecimalScale thousandSeparator=" " />,
  },
];

interface IResponse {
  title: string;
  data: CommercialOffer[];
}

export default function Page({ params }: { params: { id: string; agent: string } }) {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const { data, error, isValidating } = useSWR<IResponse>(`/api/projects/${params.id}/${params.agent}`);

  if (isValidating) {
    return <TitleBar title="Завантаження..." />;
  }

  if (error || !data) {
    redirect(`/projects/${params.id}`);
  }

  return (
    <>
      <TitleBar title={data.title ?? "КП"} enableBackButton />
      <DataTable
        columns={mainTableColumns}
        records={data.data}
        rowExpansion={{
          allowMultiple: true,
          expanded: { recordIds: expandedIds, onRecordIdsChange: setExpandedIds },
          content: ({ record }) => <DataTable bg="dark.9" columns={subTableColumns} records={record.details} />,
        }}
      />
    </>
  );
}
