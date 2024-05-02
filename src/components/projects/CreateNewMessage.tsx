"use client";

import { mutateAllKeysStartingWith } from "@/libs/mutate";
import { Button, Drawer, Group, Select, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/uk";
import { constant } from "lodash";
import { CheckCircle, PlusCircle, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { z } from "zod";

const schema = z.object({
  agent: z.string().min(1, "Обов`язкове поле"),
  message: z.string().min(1, "Обов`язкове поле"),
  status: z.string().min(1, "Обов`язкове поле"),
  notificationDate: z.date().optional(),
});

type ValidationSchema = z.infer<typeof schema>;

interface IProps {
  projectId: string;
}

export default function CreateNewMessage({ projectId }: IProps) {
  const searchParams = useSearchParams();
  const { data: agents, error: agentsError, isValidating: agentsIsValidating } = useSWR("/api/data/agents");
  const {
    data: statuses,
    error: statusesError,
    isValidating: statusesIsValidating,
  } = useSWR("/api/data/project-statuses");

  const agent = useMemo(() => searchParams.get("agent") ?? "", [searchParams]);
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ValidationSchema>({
    initialValues: {
      agent,
      message: "",
      status: "",
      notificationDate: dayjs().set("hour", 0).set("minute", 0).set("second", 0).toDate(),
    },
    validate: zodResolver(schema),
  });

  async function onSubmit(values: ValidationSchema) {
    setIsLoading(true);
    const response = await axios
      .post(`/api/projects/${projectId}`, {
        ...values,
        notificationDate: dayjs(values.notificationDate).format("YYYYMMDDHHmmss"),
      })
      .catch(constant(null));

    if (!response || response.status !== 200) {
      setIsLoading(false);
      notifications.show({
        autoClose: 3000,
        color: "red",
        icon: <XCircle />,
        message: "Сталася помилка при створенні повідомлення",
        title: "Створення повідомлення",
        withCloseButton: true,
      });
      return;
    }

    await mutateAllKeysStartingWith("/api/projects");

    notifications.show({
      autoClose: 3000,
      color: "green",
      icon: <CheckCircle />,
      message: "Повідомлення створено",
      title: "Створення повідомлення",
      withCloseButton: true,
    });
    setIsLoading(false);
  }

  return (
    <>
      <Drawer opened={opened} position="right" onClose={close} title="Додати повідомлення">
        <form onSubmit={form.onSubmit(onSubmit)} className="space-y-4">
          <Select
            {...form.getInputProps("agent")}
            data={agents?.data ?? []}
            label="Контрагент"
            disabled={isLoading || !agents || agentsError || agentsIsValidating}
            limit={25}
            searchable
            readOnly
          />
          <Select
            {...form.getInputProps("status")}
            data={statuses?.data ?? []}
            label="Статус"
            disabled={isLoading || !statuses || statusesError || statusesIsValidating}
            searchable
          />
          <DateInput
            {...form.getInputProps("notificationDate")}
            label="Дата нагадування"
            locale="uk"
            valueFormat="DD MMMM YYYY"
          />
          <Textarea label="Повідомлення" {...form.getInputProps("message")} />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Додати</Button>
          </Group>
        </form>
      </Drawer>

      <Button leftSection={<PlusCircle />} onClick={open} size="sm">
        Додати повідомлення
      </Button>
    </>
  );
}
