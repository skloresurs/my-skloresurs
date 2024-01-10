'use client';

import { Select, TextInput } from '@mantine/core';
import { find } from 'lodash';
import React from 'react';
import useSWR from 'swr';

import AsyncInputRightSections from '@/components/AsyncInputRightSections';
import getInputPlaceholder from '@/libs/input-async-placeholder';
import { FormType } from '@/types/newOrder/Form';
import INomenclature from '@/types/newOrder/Nomenclature';

interface IProps {
  activeTab: string | null;
  form: FormType;
}

export default function NomenclatureSelect({ activeTab, form }: IProps) {
  const thisInputProps = form.getInputProps(`specifications.${activeTab}.nomenclature`);
  const specificationTypeInputProps = form.getInputProps(`specifications.${activeTab}.type`);
  const { data, isValidating, error } = useSWR<{ data: INomenclature[] }>(
    `/api/data/nomenclatures/${specificationTypeInputProps.value}`
  );

  return (
    <div className='flex w-full flex-row gap-2'>
      <Select
        className='flex-1'
        label='Номенклатура'
        {...thisInputProps}
        data={data?.data ?? []}
        searchable
        withAsterisk
        placeholder={getInputPlaceholder(isValidating, error, false)}
        allowDeselect={false}
        disabled={error || isValidating}
        rightSection={<AsyncInputRightSections isValidating={isValidating} error={error} />}
        onChange={(e) => {
          const specification = find(data?.data, ['value', e]);
          thisInputProps.onChange(e);
          form.setFieldValue(`specifications.${activeTab}.tempAllowHardening`, specification?.allowHardening);
          form.setFieldValue(`specifications.${activeTab}.tempRequireHardening`, specification?.requireHardening);
          form.setFieldValue(
            `specifications.${activeTab}.tempRequireEdgeProcessing`,
            specification?.requireEdgeProcessing
          );

          form.setFieldValue(`specifications.${activeTab}.edgeProcessing`, null);
          form.setFieldValue(`specifications.${activeTab}.edgeProcessing`, null);
          form.setFieldValue(`specifications.${activeTab}.facet`, null);
          form.setFieldValue(`specifications.${activeTab}.paint`, null);
          form.setFieldValue(`specifications.${activeTab}.emalitFilm`, null);
          form.setFieldValue(`specifications.${activeTab}.hardening`, null);
          form.setFieldValue(`specifications.${activeTab}.gasFilling`, null);
          form.setFieldValue(`specifications.${activeTab}.coatingType`, null);
          form.setFieldValue(`specifications.${activeTab}.hydrofob`, false);
          form.setFieldValue(`specifications.${activeTab}.hst`, false);
        }}
      />
      <TextInput
        className='w-[100px]'
        label='Товщина'
        value={find(data?.data, ['value', thisInputProps.value])?.thickness ?? '-'}
        readOnly
        rightSection='мм'
      />
    </div>
  );
}
