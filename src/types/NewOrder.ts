import { z } from 'zod';

import elementTypes from '@/data/order/element-type';

const specificationSchema = z.object({
  coatingType: z.string().optional(),
  edgeProcessing: z.string().optional(),
  emalitFilm: z.string().optional(),
  facet: z.string().optional(),
  gasFilling: z.string().optional(),
  hardening: z.string().optional(),
  hydrofob: z.boolean().optional(),
  nomenclature: z.string({ required_error: 'Номенклатура обов`язкова' }).min(1, 'Номенклатура обов`язкова'),
  paint: z.string().optional(),
  sandBlaster: z.string().optional(),
  type: z.string({ required_error: 'Тип обов`язковий' }).min(1, 'Тип обов`язковий'),
});

const formSchema = z.object({
  address: z
    .string({ required_error: 'Адреса замовлення обов`язкова' })
    .min(1, 'Адреса замовлення обов`язкова')
    .max(255, 'Максимальна довжина адреси 255 символів'),
  comment: z.string().optional(),
  specification: specificationSchema.array().min(1, 'Налаштуйте хоча б одну специфікацію'),
  title: z
    .string({ required_error: 'Назва замовлення обов`язкова' })
    .min(1, 'Назва замовлення обов`язкова')
    .max(255, 'Максимальна довжина назви 255 символів'),
  type: z.string({ required_error: 'Тип замовлення обов`язково' }).min(1, 'Тип замовлення обов`язково'),
});

const defaultData: ValidationSchema = {
  address: '',
  comment: '',
  specification: [
    {
      hydrofob: false,
      nomenclature: '',
      type: elementTypes[0].value,
    },
  ],
  title: '',
  type: '',
};

export type ValidationSchema = z.infer<typeof formSchema>;

export { defaultData, formSchema };
