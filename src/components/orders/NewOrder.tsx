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
import { useForm, zodResolver } from '@mantine/form';
import { Trash } from 'lucide-react';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import React from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import { z } from 'zod';

import { env } from '@/env.mjs';

const specificationSchema = z.object({
  comment: z.string().optional(),
  count: z
    .number({ required_error: 'Кількість обов`язкова' })
    .min(1, 'Кількість має бути більше 1'),
  height: z
    .number({ required_error: 'Висота обов`язкова' })
    .min(0, 'Висота має бути більше 0'),
  width: z
    .number({ required_error: 'Ширина обов`язкова' })
    .min(0, 'Ширина має бути більше 0'),
});

const formSchema = z.object({
  address: z
    .string({ required_error: 'Адреса замовлення обов`язкова' })
    .min(1, 'Адреса замовлення обов`язкова')
    .max(255, 'Максимальна довжина адреси 255 символів'),
  comment: z.string().optional(),
  glass_type: z.string({ required_error: 'Тип стекла обов`язково' }),
  specification: specificationSchema
    .array()
    .min(1, 'Додайте хоча б одну специфікацію'),
  title: z
    .string({ required_error: 'Назва замовлення обов`язкова' })
    .min(1, 'Назва замовлення обов`язкова')
    .max(255, 'Максимальна довжина назви 255 символів'),
});

type ValidationSchema = z.infer<typeof formSchema>;

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
        <form
          onSubmit={form.onSubmit(onSubmit)}
          className="max-w-2xl space-y-4"
        >
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
              onChange={(value) => form.setFieldValue('glass_type', value)}
              orientation="vertical"
              data={[
                {
                  label: 'Моноскло',
                  value: 'mono',
                },
                {
                  label: 'Тріплекс',
                  value: 'triplex',
                },
                {
                  label: 'Однокамерний склопакет',
                  value: 'single',
                },
                {
                  label: 'Двокамерний склопакет',
                  value: 'double',
                },
                {
                  label: 'Трикамерний склопакет',
                  value: 'triple',
                },
              ]}
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
      {/* TODO: Add visualization */}
      <div>visualize</div>
    </div>
  );
}
