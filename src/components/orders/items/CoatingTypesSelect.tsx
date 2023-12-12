'use client';

import { Select } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Loader2 } from 'lucide-react';
import React from 'react';
import useSWR from 'swr';

import { env } from '@/env.mjs';
import { ValidationSchema } from '@/types/NewOrder';

interface IProps {
  activeTab: string | null;
  form: UseFormReturnType<
    ValidationSchema,
    (values: ValidationSchema) => ValidationSchema
  >;
  className?: string;
}

export default function CoatingTypesSelect({
  activeTab,
  form,
  className,
}: IProps) {
  const { data, isValidating, error } = useSWR(
    `${env.NEXT_PUBLIC_API_URL_1C_MAIN}/data/coating-types`
  );
  return (
    <Select
      className={className}
      label="Тип покриття"
      {...form.getInputProps(`specification.${activeTab}.coatingType`)}
      disabled={error || isValidating}
      rightSection={isValidating ? <Loader2 className="animate-spin" /> : null}
      placeholder={error ? 'Помилка отримання даних' : ''}
      data={data?.data ?? []}
    />
  );
}
