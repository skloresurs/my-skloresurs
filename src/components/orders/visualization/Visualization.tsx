import { Fieldset, Title } from "@mantine/core";
import { map } from "lodash";
import { nanoid } from "nanoid";
import type React from "react";

import type { FormType } from "@/types/newOrder/Form";

import VisualizationItem from "./VisualizationItem";

interface IProps {
  form: FormType;
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Visualization({ form, activeTab, setActiveTab }: IProps) {
  const orderTypeInputProps = form.getInputProps("type");
  return (
    <Fieldset
      legend="Візуалізація"
      className="order-2 flex flex-row items-center justify-center overflow-x-scroll rounded-md lg:order-1"
    >
      {orderTypeInputProps.value ? (
        map(form.values.specifications, (_, i) => (
          <VisualizationItem key={nanoid()} form={form} index={i} activeTab={activeTab} setActiveTab={setActiveTab} />
        ))
      ) : (
        <div className="h-[75px]">
          <Title className="flex size-full items-center justify-center" order={2} size="h3">
            Виберіть тип замовлення для перегляду візуалізації
          </Title>
        </div>
      )}
    </Fieldset>
  );
}
