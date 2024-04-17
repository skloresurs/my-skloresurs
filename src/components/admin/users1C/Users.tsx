"use client";

import { ActionIcon, TextInput } from "@mantine/core";
import { Search, X } from "lucide-react";
import { DataTable, type DataTableColumn } from "mantine-datatable";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";

interface IUsers1C {
  id: number;
  name: string;
}

interface Response {
  total: number;
  data: IUsers1C[];
}

const page = (pageParam: string | null) => {
  if (!pageParam || !Number.isInteger(+pageParam) || +pageParam < 1) {
    return 1;
  }
  return +pageParam;
};

export default function Users() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const params = useMemo(
    () =>
      new URLSearchParams({
        page: pageParam ?? "1",
        search,
      }),
    [pageParam, search],
  );
  const { data, isValidating } = useSWR<Response>(`/api/users-1c?${params.toString()}`);

  const onPageChange = (p: number) => router.push(`/admin/users-1c?page=${p}`);

  const columns = useMemo<DataTableColumn<IUsers1C>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
      },
      {
        accessor: "name",
        title: "Повне ім'я",
        filter: (
          <TextInput
            label="Пошук за повним ім`ям"
            leftSection={<Search size={16} />}
            rightSection={
              <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearch("")}>
                <X size={14} />
              </ActionIcon>
            }
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              params.set("page", "1");
            }}
          />
        ),
        filtering: search !== "",
      },
    ],
    [params, search],
  );

  return (
    <DataTable
      withTableBorder
      withColumnBorders
      striped
      columns={columns}
      minHeight={400}
      verticalSpacing="md"
      records={data?.data ?? []}
      loaderBackgroundBlur={2}
      totalRecords={data?.total ?? 0}
      recordsPerPage={20}
      page={page(pageParam)}
      onPageChange={onPageChange}
      fetching={isValidating}
    />
  );
}
