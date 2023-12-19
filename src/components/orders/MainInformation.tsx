'use client';

import { Fieldset, Select, Textarea, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';

import OrderTypes from '@/data/order/types';
import { env } from '@/env.mjs';
import { defaultData, ValidationSchema } from '@/types/NewOrder';

interface IProps {
  form: UseFormReturnType<ValidationSchema, (values: ValidationSchema) => ValidationSchema>;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function MainInformation({ form, setActiveTab }: IProps) {
  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => {
      form.setFieldValue('address', place.formatted_address);
    },
    options: {
      types: 'locality',
    },
  });

  return (
    <Fieldset legend='Основна інформація' className='space-y-2'>
      <TextInput label='Назва замовлення' size='md' withAsterisk {...form.getInputProps('title')} />
      <TextInput
        ref={ref}
        label='Адреса'
        placeholder='Харків, вул. Сумська, 17, кв. 25'
        size='md'
        withAsterisk
        {...form.getInputProps('address')}
      />

      <Select
        label='Вид'
        {...form.getInputProps('type')}
        data={OrderTypes}
        allowDeselect={false}
        withAsterisk
        onChange={(e) => {
          form.setFieldValue('type', e ?? '');
          form.setFieldValue('specification', defaultData.specification);
          setActiveTab('0');
        }}
      />
      <Textarea label='Коментар' {...form.getInputProps('comment')} />
    </Fieldset>
  );
}
