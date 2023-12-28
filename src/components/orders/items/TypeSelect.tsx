'use client';

import { Select } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { includes, map } from 'lodash';
import React from 'react';

import elementTypes from '@/data/order/element-type';
import { ValidationSchema } from '@/types/NewOrder';

interface IProps {
  form: UseFormReturnType<ValidationSchema, (values: ValidationSchema) => ValidationSchema>;
  activeTab: string | null;
}

export default function TypeSelect({ form, activeTab }: IProps) {
  const formInput = form.getInputProps(`specification.${activeTab}.type`);
  return (
    <Select
      label='Вид'
      {...formInput}
      onChange={(e) => {
        if (e !== form.getInputProps(`specification.${activeTab}.type`).value) {
          form.setFieldValue(`specification.${activeTab}.nomenclature`, null);
        }
        formInput.onChange(e);
      }}
      data={map(elementTypes, (e) => ({
        ...e,
        disabled: !includes(e.avalibleFor, form.values.type) && !!e.avalibleFor,
      }))}
      withAsterisk
      allowDeselect={false}
    />
  );
}
