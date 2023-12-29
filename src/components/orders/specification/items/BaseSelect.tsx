'use client';

import { Select } from '@mantine/core';
import React from 'react';
import useSWR from 'swr';

import AsyncInputRightSections from '@/components/AsyncInputRightSections';
import getInputPlaceholder from '@/libs/input-async-placeholder';
import { FormType } from '@/types/newOrder/Form';
import INomenclature from '@/types/newOrder/Nomenclature';

interface IProps {
  url: string;
  form: FormType;
  formKey: string;
  label: string;
  activeTab: string | null;
  forbridden?: boolean;
  hidden?: boolean;
  require?: boolean;
}

export default function BaseSelect({ url, form, formKey, label, activeTab, forbridden, hidden, require }: IProps) {
  const thisTypeInputProps = form.getInputProps(`specifications.${activeTab}.${formKey}`);

  const { data, isValidating, error } = useSWR<{ data: INomenclature[] }>(`/api/data${url}`);

  if (hidden) {
    return null;
  }

  return (
    <Select
      className='min-w-[250px] flex-1 '
      label={label}
      {...thisTypeInputProps}
      data={data?.data ?? []}
      placeholder={getInputPlaceholder(isValidating, error, forbridden ?? false, 'Не вибрано')}
      disabled={error || isValidating || forbridden}
      rightSection={<AsyncInputRightSections isValidating={isValidating} error={error} forbidden={forbridden} />}
      withAsterisk={require}
    />
  );
}
