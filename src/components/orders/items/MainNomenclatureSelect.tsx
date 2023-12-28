'use client';

import { Select, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { find } from 'lodash';
import { Loader2 } from 'lucide-react';
import React from 'react';
import useSWR from 'swr';

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
    `/api/data/nomenclatures/${form.values.specification?.at(Number(activeTab))?.type}`
  );
  const formInput = form.getInputProps(`specification.${activeTab}.nomenclature`);

  return (
    <div className='flex w-full flex-row gap-2'>
      <Select
        className='flex-1'
        label='Номенклатура'
        {...formInput}
        onChange={(e) => {
          formInput.onChange(e);
          form.setFieldValue(`specification.${activeTab}.hydrofob`, false);
          form.setFieldValue(`specification.${activeTab}.coatingType`, null);
          form.setFieldValue(`specification.${activeTab}.edgeProcessing`, null);
          form.setFieldValue(`specification.${activeTab}.emalitFilm`, null);
          form.setFieldValue(`specification.${activeTab}.facet`, null);
          form.setFieldValue(`specification.${activeTab}.gasFilling`, null);
          form.setFieldValue(`specification.${activeTab}.hardening`, null);
          form.setFieldValue(`specification.${activeTab}.paint`, null);
          form.setFieldValue(`specification.${activeTab}.sandBlaster`, null);
        }}
        allowDeselect={false}
        disabled={error || isValidating}
        rightSection={isValidating ? <Loader2 className='animate-spin' /> : null}
        placeholder={error ? 'Помилка отримання даних' : ''}
        data={data?.data ?? []}
        searchable
        withAsterisk
      />
      <TextInput
        className='w-[100px]'
        label='Товщина'
        value={
          find(data?.data, ['value', form.getInputProps(`specification.${activeTab}.nomenclature`)?.value])
            ?.thickness ?? '-'
        }
        readOnly
        rightSection='мм'
      />
    </div>
  );
}
