import { Fieldset, Textarea, TextInput } from '@mantine/core';
import React from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';

import { env } from '@/env.mjs';
import { FormType } from '@/types/newOrder/Form';

import OrderTypeSelect from './OrderTypeSelect';

interface IProps {
  form: FormType;
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

      <OrderTypeSelect form={form} setActiveTab={setActiveTab} />
      <Textarea label='Коментар' {...form.getInputProps('comment')} />
    </Fieldset>
  );
}
