import { Select } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import useSWR from "swr";

import getInputPlaceholder from "@/libs/input-async-placeholder";
import type { FormType } from "@/types/newOrder/Form";
import type IOrderType from "@/types/newOrder/OrderType";
import { defaultSpecificationData } from "@/types/newOrder/Specification";

import AsyncInputRightSections from "../AsyncInputRightSections";

interface IProps {
  form: FormType;
  setActiveTab: Dispatch<SetStateAction<string | null>>;
}

export default function OrderTypeSelect({ form, setActiveTab }: IProps) {
  const { data, isValidating, error } = useSWR<{ data: IOrderType[] }>("/api/data/order-types");

  const thisFormTypes = form.getInputProps("type");

  return (
    <Select
      label="Вид замовлення"
      {...thisFormTypes}
      data={data?.data ?? []}
      allowDeselect={false}
      withAsterisk
      placeholder={getInputPlaceholder(isValidating, error, false)}
      disabled={error || isValidating}
      rightSection={<AsyncInputRightSections isValidating={isValidating} error={error} />}
      onChange={(e) => {
        form.setFieldValue("type", e ?? "");
        form.setFieldValue("specifications", [{ ...defaultSpecificationData }]);
        setActiveTab("0");
      }}
    />
  );
}
