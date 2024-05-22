"use client";

import TitleBar from "@/components/TitleBar";
import CreateNewMessage from "@/components/projects/CreateNewMessage";
import plurals from "@/libs/plurals";
import type Message from "@/types/projects/Message";
import type { ProjectData } from "@/types/projects/Project";
import { ActionIcon, Badge, Button, Group, Popover, PopoverDropdown, PopoverTarget, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import { MessageCircleMore } from "lucide-react";
import { DataTable, type DataTableColumn } from "mantine-datatable";
import Link from "next/link";
import { redirect } from "next/navigation";
import plural from "plurals-cldr";
import { useMemo } from "react";
import useSWR from "swr";

const getColumns = (projectId: string): DataTableColumn<Message>[] => [
  {
    accessor: "manager-agent",
    title: "Менеджер/Контрагент",
    render: ({ manager, agent, notificationDate }) => (
      <Stack gap="2px">
        <Text size="sm">{manager?.name}</Text>
        <Link href={`/projects/${projectId}/${agent.id}`}>
          <Text fw={600}>{agent?.name}</Text>
        </Link>
        <Text size="xs" c="dimmed">
          {dayjs(notificationDate).format("DD.MM.YYYY")}
        </Text>
      </Stack>
    ),
  },
  {
    accessor: "status",
    title: "Статус",
    textAlign: "right",
    render: ({ status }) => <Badge variant="light">{status}</Badge>,
  },
  {
    accessor: "new",
    title: "",
    width: "110px",
    textAlign: "right",
    render: ({ agent, comment }) => (
      <Group justify="center">
        {comment && (
          <Popover>
            <PopoverTarget>
              <ActionIcon size="lg" radius="xl" variant="light" c="blue">
                <MessageCircleMore />
              </ActionIcon>
            </PopoverTarget>
            <PopoverDropdown p="xs">{comment}</PopoverDropdown>
          </Popover>
        )}
        <CreateNewMessage projectId={projectId} agent={agent.id} />
      </Group>
    ),
  },
];

interface IProps {
  params: {
    id: string;
  };
  searchParams: {
    all?: unknown;
  };
}

export default function Page({ params, searchParams }: IProps) {
  const { data, error, isValidating } = useSWR<ProjectData>(
    `/api/projects/${params.id}${searchParams.all ? "?all=true" : ""}`,
  );
  const columns = useMemo(() => getColumns(params.id), [params.id]);

  if (isValidating) {
    return <TitleBar title="Завантаження..." />;
  }

  if (error) {
    redirect("/projects");
  }

  if (!data) {
    return <TitleBar title="Завантаження..." />;
  }

  return (
    <>
      <TitleBar title={data.title} description={`Код: ${params.id}`} enableBackButton />
      <DataTable columns={columns} records={data.messages} />
      <Text c="dimmed" size="sm" ta="center" mt={"md"}>
        Показано {data.messages.length}/{data.allMessagesCount}{" "}
        {plurals.message?.[plural("uk", data.messages.length) ?? ""]}
      </Text>
      {(searchParams.all === "true" || data.messages.length < data.allMessagesCount) && (
        <Button
          component={Link}
          href={searchParams.all === "true" ? "?" : "?all=true"}
          fullWidth
          variant="light"
          mt="xs"
        >
          {searchParams.all === "true" ? "Показати лише останні" : "Показати всі"}
        </Button>
      )}
    </>
  );
}
