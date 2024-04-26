"use client";

import { Button, Code } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useState } from "react";

import formSchema, { defaultFormData, type ValidationSchema } from "@/types/newOrder/Form";

import MainInformation from "./MainInformation";
import Specification from "./specification/Specification";
import Visualization from "./visualization/Visualization";

export default function NewOrder() {
  const form = useForm<ValidationSchema>({
    initialValues: defaultFormData,
    validate: zodResolver(formSchema),
  });
  const [activeTab, setActiveTab] = useState<string | null>("0");

  const onSubmit = (values: ValidationSchema) => {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(values);
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={form.onSubmit(onSubmit)}>
      <Visualization form={form} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="order-1 grid grid-cols-1 gap-3 lg:order-2 lg:grid-cols-2">
        <MainInformation form={form} setActiveTab={setActiveTab} />
        <Specification form={form} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <Button type="submit" className="order-3">
        Створити
      </Button>
      <Code block={true} className="order-4">
        {JSON.stringify(form.values, null, 2)}
      </Code>
      <Code block={true} className="order-4">
        {JSON.stringify(form.errors, null, 2)}
      </Code>
    </form>
  );
}
