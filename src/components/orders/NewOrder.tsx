'use client';

import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  NumberInput,
  SegmentedControl,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Trash } from 'lucide-react';
import { zodResolver } from 'mantine-form-zod-resolver';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import React from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';

import { glassTypeData } from '@/data/new-order-data';
import { env } from '@/env.mjs';
import { formSchema, ValidationSchema } from '@/types/NewOrder';

import Visualization from './Visualization';

export default function NewOrder() {
  const form = useForm<ValidationSchema>({
    initialValues: {
      address: '',
      comment: '',
      glass_type: 'mono',
      specification: [
        {
          comment: '',
          count: 1,
          height: 0,
          width: 0,
        },
      ],
      title: '',
      visualization:
        glassTypeData.find((item) => item.value === 'mono')?.data ?? [],
    },
    validate: zodResolver(formSchema),
  });

  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => {
      form.setFieldValue('address', place.formatted_address);
    },
    options: {
      types: 'locality',
    },
  });

  // TODO: Create submit function
  const onSubmit = (values: ValidationSchema) => {
    console.log(values);
  };

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-5">
      <div>
        <form onSubmit={form.onSubmit(onSubmit)} className="space-y-4">
          <Fieldset legend="Основна інформація" className="space-y-2">
            <TextInput
              label="Назва замовлення"
              size="md"
              withAsterisk
              {...form.getInputProps('title')}
            />
            <TextInput
              ref={ref}
              label="Адреса"
              placeholder="Харків, вул. Сумська, 17, кв. 25"
              size="md"
              withAsterisk
              {...form.getInputProps('address')}
            />

            <Textarea label="Коментар" {...form.getInputProps('comment')} />
          </Fieldset>
          <Fieldset
            legend="Тип склопакету"
            className="flex flex-row justify-around gap-2"
          >
            <SegmentedControl
              defaultValue="mono"
              value={form.values.glass_type}
              onChange={(value) => {
                form.setFieldValue('glass_type', value);
                form.setFieldValue(
                  'visualization',
                  glassTypeData.find((e) => e.value === value)?.data ?? []
                );
              }}
              fullWidth
              orientation="vertical"
              data={glassTypeData}
            />
            <Image
              src={`/glass-type/${form.values.glass_type}.png`}
              alt=""
              width={150}
              height={200}
            />
          </Fieldset>
          <Fieldset legend="Специфікація" className="flex flex-col gap-2">
            {form.errors.specification && (
              <Text c="red" className="text-center">
                {form.errors.specification}
              </Text>
            )}
            {form.values.specification.map((e, i) => (
              <Fieldset key={nanoid()} className="flex flex-col gap-1">
                <div className="flex flex-row justify-between gap-2">
                  <NumberInput
                    label="Ширина"
                    {...form.getInputProps(`specification.${i}.width`)}
                  />
                  <NumberInput
                    label="Висота"
                    {...form.getInputProps(`specification.${i}.height`)}
                  />
                  <NumberInput
                    label="Кількість"
                    {...form.getInputProps(`specification.${i}.count`)}
                  />
                  <ActionIcon
                    radius="xl"
                    size="lg"
                    color="red"
                    onClick={() => form.removeListItem('specification', i)}
                  >
                    <Trash />
                  </ActionIcon>
                </div>
                <Textarea
                  label="Коментар"
                  {...form.getInputProps(`specification.${i}.comment`)}
                />
              </Fieldset>
            ))}
            <Group justify="center" mt="md">
              <Button
                onClick={() =>
                  form.insertListItem('specification', {
                    comment: '',
                    count: 1,
                    height: 0,
                    width: 0,
                  })
                }
              >
                Додати
              </Button>
            </Group>
          </Fieldset>
          <Button type="submit" className="w-full">
            Відправити на прорахунок
          </Button>
        </form>
      </div>
      <Visualization form={form} />
    </div>
  );
}
