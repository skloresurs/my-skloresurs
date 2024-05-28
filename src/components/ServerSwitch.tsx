"use client";
import { mutateAllKeysStartingWith } from "@/libs/mutate";
import { Badge, Group, Loader, Select, type SelectProps, Text } from "@mantine/core";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";

export default function ServerSwitch() {
  const [value, setValue] = useState<string>(localStorage.getItem("server") ?? "dubno");
  const { data, error, isValidating } = useSWR("/api/status");

  const icons: Record<string, React.ReactNode> = useMemo(() => {
    if (isValidating) {
      return {
        dubno: <Loader color="blue" size="xs" />,
        tlymach: <Loader color="blue" size="xs" />,
      };
    }
    if (error) {
      return {
        dubno: <Badge circle color="red" size="xs" className="animate-pulse" />,
        tlymach: <Badge circle color="red" size="xs" className="animate-pulse" />,
      };
    }
    return {
      dubno: <Badge circle color={data.dubno ? "green" : "red"} size="xs" className="animate-pulse" />,
      tlymach: <Badge circle color={data.tlymach ? "green" : "red"} size="xs" className="animate-pulse" />,
    };
  }, [data, error, isValidating]);

  const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }) => (
    <Group flex="1" gap="xs">
      {icons[option.value]}
      <Text>{option.label}</Text>
      <div className="flex-1" />
      {checked && <Check />}
    </Group>
  );

  function updateValue(value: string | null) {
    setValue(value ?? "dubno");
    localStorage.setItem("server", value ?? "dubno");

    mutateAllKeysStartingWith("");
  }
  return (
    <Select
      label="Сервер"
      value={value}
      onChange={updateValue}
      leftSection={icons[value]}
      data={[
        {
          value: "dubno",
          label: "Дубно",
        },
        {
          value: "tlymach",
          label: "Тлумач",
        },
      ]}
      renderOption={renderSelectOption}
    />
  );
}
