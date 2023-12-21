'use client';

import { Select, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { find } from 'lodash';
import { Loader2 } from 'lucide-react';
import React from 'react';
import useSWR from 'swr';

import { env } from '@/env.mjs';
import { ValidationSchema } from '@/types/NewOrder';

interface IProps {
  activeTab: string | null;
  form: UseFormReturnType<ValidationSchema, (values: ValidationSchema) => ValidationSchema>;
}

interface IRequest {
  data: {
    value: string;
    label: string;
    thickness?: string;
  }[];
}

export default function MainNomenclatureSelect({ activeTab, form }: IProps) {
  const { data, isValidating, error } = useSWR<IRequest>(
    `${env.NEXT_PUBLIC_API_URL_1C_MAIN}/data/nomenclatures/${form.values.specification?.at(Number(activeTab))?.type}`
  );
  return (
    <div className='flex w-full flex-row gap-2'>
      <Select
        className='flex-1'
        label='Номенклатура'
        {...form.getInputProps(`specification.${activeTab}.nomenclature`)}
        allowDeselect={false}
        disabled={error || isValidating}
        rightSection={isValidating ? <Loader2 className='animate-spin' /> : null}
        placeholder={error ? 'Помилка отримання даних' : ''}
        data={data?.data ?? []}
      />
      <TextInput
        label='Товщина'
        value={find(data?.data, ['value', form.values.specification[0].nomenclature])?.thickness ?? '-'}
        readOnly
        rightSection='мм'
      />
    </div>
  );
}
