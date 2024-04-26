"use client";

import TitleBar from "@/components/TitleBar";
import type Message from "@/types/projects/Message";
import type { ProjectData } from "@/types/projects/Project";
import dayjs from "dayjs";
import { DataTable, type DataTableColumn } from "mantine-datatable";
import { redirect } from "next/navigation";
import useSWR from "swr";

const columns: DataTableColumn<Message>[] = [
  { accessor: "id", title: "#" },
  { accessor: "date", title: "Дата", render: ({ date }) => dayjs(date).format("DD.MM.YYYY") },
  { accessor: "manager", title: "Менеджер", render: ({ manager }) => manager.name },
  { accessor: "agent", title: "Контрагент", render: ({ agent }) => agent?.name },
  { accessor: "comment", title: "Коментар" },
  { accessor: "status", title: "Статус" },
];

export default function Page({ params }: { params: { id: string } }) {
  const { data, error, isValidating } = useSWR<ProjectData>(`/api/projects/${params.id}`);

  if (isValidating) {
    return <TitleBar title="Завантаження..." />;
  }

  if (error || !data) {
    redirect("/projects");
  }

  return (
    <>
      <TitleBar title={data.title} enableBackButton />
      <DataTable columns={columns} records={data.messages} />
    </>
  );
}
