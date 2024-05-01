"use client";

import TitleBar from "@/components/TitleBar";
import CreateNewMessage from "@/components/projects/CreateNewMessage";
import type Message from "@/types/projects/Message";
import type { ProjectData } from "@/types/projects/Project";
import { Badge, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import { DataTable, type DataTableColumn } from "mantine-datatable";
import { redirect } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

const getColumns = (projectId: string): DataTableColumn<Message>[] => [
  { accessor: "id", title: "#", width: "45px", textAlign: "center" },
  {
    accessor: "manager-agent",
    title: "Менеджер/Контрагент",
    render: ({ manager, agent, date }) => (
      <Stack gap="2px">
        <Text size="sm">{manager?.name}</Text>
        <Text fw={600}>{agent?.name}</Text>
        <Text size="xs" c="dimmed">
          {dayjs(date).format("DD.MM.YYYY")}
        </Text>
      </Stack>
    ),
  },
  {
    accessor: "comment",
    title: <CreateNewMessage projectId={projectId} />,
    textAlign: "right",
    render: ({ comment, status }) => (
      <Stack gap="2px" align="flex-end">
        <Badge variant="light">{status}</Badge>
        <Text>{comment}</Text>
      </Stack>
    ),
  },
];

export default function Page({ params }: { params: { id: string } }) {
  const { data, error, isValidating } = useSWR<ProjectData>(`/api/projects/${params.id}`);
  const columns = useMemo(() => getColumns(params.id), [params.id]);

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
