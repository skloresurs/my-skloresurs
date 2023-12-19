'use client';

import { Select } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Loader2 } from 'lucide-react';
import React from 'react';
import useSWR from 'swr';

import { env } from '@/env.mjs';
import { ValidationSchema } from '@/types/NewOrder';

interface IProps {
  label: string;
  activeTab: string | null;
  id: string;
  form: UseFormReturnType<ValidationSchema, (values: ValidationSchema) => ValidationSchema>;
  formKey: string;
  className?: string;
}

export default function NomenclatureSelect({ label, activeTab, form, formKey, id, className }: IProps) {
  const { data, isValidating, error } = useSWR(`${env.NEXT_PUBLIC_API_URL_1C_MAIN}/data/nomenclatures/${id}`);
  return (
    <Select
      className={className}
      label={label}
      {...form.getInputProps(`specification.${activeTab}.${formKey}`)}
      disabled={error || isValidating}
      rightSection={isValidating ? <Loader2 className='animate-spin' /> : null}
      placeholder={error ? 'Помилка отримання даних' : ''}
      data={data?.data ?? []}
    />
  );
}
