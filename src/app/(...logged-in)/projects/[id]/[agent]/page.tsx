"use client";

import TitleBar from "@/components/TitleBar";
import type { CommercialOffer, CommercialOfferDetail } from "@/types/projects/CommercialOffer";
import { NumberFormatter } from "@mantine/core";
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
    accessor: "price",
    title: "Ціна",
    textAlign: "right",
    render: ({ price }) => <NumberFormatter value={price} decimalScale={2} thousandSeparator=" " />,
  },
];

const subTableColumns: DataTableColumn<CommercialOfferDetail>[] = [
  {
    accessor: "name",
    title: "Назва",
  },
  {
    accessor: "price",
    title: "Ціна",
    render: ({ price }) => <NumberFormatter value={price} decimalScale={2} thousandSeparator=" " />,
  },
  {
    accessor: "size",
    title: "Розмір",
    textAlign: "right",
    render: ({ count, countSuffix }) => (
      <NumberFormatter value={count} suffix={` ${countSuffix}`} decimalScale={3} thousandSeparator=" " />
    ),
  },
];

export default function Page({ params }: { params: { id: string; agent: string } }) {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const { data, error, isValidating } = useSWR<{ data: CommercialOffer[] }>(
    `/api/projects/${params.id}/${params.agent}`,
  );

  if (isValidating) {
    return <TitleBar title="Завантаження..." />;
  }

  if (error || !data) {
    redirect(`/projects/${params.id}`);
  }

  return (
    <>
      <TitleBar title="КП" enableBackButton />
      <DataTable
        columns={mainTableColumns}
        records={data.data}
        rowExpansion={{
          allowMultiple: true,
          expanded: { recordIds: expandedIds, onRecordIdsChange: setExpandedIds },
          content: ({ record }) => <DataTable columns={subTableColumns} records={record.details} />,
        }}
      />
    </>
  );
}
