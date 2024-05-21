"use client";

import { Select } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect, useState } from "react";
import useSWR from "swr";

interface IProps {
  label: string;
  paramKey: string;
  dataUrl: string;
}

function InstrumentSelect({ label, paramKey, dataUrl }: IProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get(paramKey);

  const [value, setValue] = useState<string | null>(search ?? "");

  const { data, error, isValidating } = useSWR(dataUrl);

  useEffect(() => {
    setValue(search ?? "");
  }, [search]);

  const onSearch = (newValue: string | null) => {
    setValue(newValue);

    const params = new URLSearchParams([...searchParams]);

    params.delete("page");

    if (newValue) {
      params.set(paramKey, newValue);
    } else {
      params.delete(paramKey);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      data={data?.data ?? []}
      value={value}
      onChange={onSearch}
      label={label}
      limit={25}
      searchable
      placeholder="Не вказано"
      disabled={error || isValidating}
    />
  );
}

export default memo(InstrumentSelect);
