"use client";

import { Select } from "@mantine/core";
import useSWR from "swr";

import AsyncInputRightSections from "@/components/AsyncInputRightSections";
import getInputPlaceholder from "@/libs/input-async-placeholder";
import type { FormType } from "@/types/newOrder/Form";
import { defaultSpecificationData } from "@/types/newOrder/Specification";
import type ISpecificationType from "@/types/newOrder/SpecificationType";

interface IProps {
  form: FormType;
  activeTab: string | null;
}

export default function TypeSelect({ form, activeTab }: IProps) {
  const thisFormInput = form.getInputProps(`specifications.${activeTab}.type`);
  const orderTypeFormInput = form.getInputProps("type");
  const { data, error, isValidating } = useSWR<{ data: ISpecificationType[] }>(
    `/api/data/specification-types/${orderTypeFormInput.value}`,
  );
  return (
    <Select
      label="Вид специфікації"
      {...thisFormInput}
      data={data?.data ?? []}
      allowDeselect={false}
      withAsterisk
      placeholder={getInputPlaceholder(isValidating, error, false)}
      rightSection={<AsyncInputRightSections isValidating={isValidating} error={error} />}
      disabled={error || isValidating}
      onChange={(e) => {
        form.setFieldValue(`specifications.${activeTab}`, {
          ...defaultSpecificationData,
          type: e,
        });
      }}
    />
  );
}
