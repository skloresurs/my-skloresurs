import { z } from 'zod';

import elementTypes from '@/data/order/element-type';

const specificationSchema = z
  .object({
    coatingType: z.string().nullable(),
    edgeProcessing: z.string().nullable(),
    emalitFilm: z.string().nullable(),
    facet: z.string().nullable(),
    gasFilling: z.string().nullable(),
    hardening: z.string().nullable(),
    hydrofob: z.boolean().nullable(),
    nomenclature: z.string().nullable(),
    paint: z.string().nullable(),
    sandBlaster: z.string().nullable(),
    type: z.string({ required_error: 'Тип обов`язковий' }).min(1, 'Тип обов`язковий'),
  })
  .strict()
  .refine((data) => data.nomenclature, { message: 'Номенклатура обов`язкова', path: ['nomenclature'] });

const formSchema = z
  .object({
    address: z
      .string({ required_error: 'Адреса замовлення обов`язкова' })
      .min(1, 'Адреса замовлення обов`язкова')
      .max(255, 'Максимальна довжина адреси 255 символів'),
    comment: z.string().nullable(),
    specification: specificationSchema.array().min(1, 'Налаштуйте хоча б одну специфікацію'),
    title: z
      .string({ required_error: 'Назва замовлення обов`язкова' })
      .min(1, 'Назва замовлення обов`язкова')
      .max(255, 'Максимальна довжина назви 255 символів'),
    type: z.string().nullable(),
  })
  .strict()
  .refine((data) => data.type, { message: 'Тип замовлення обов`язковий', path: ['type'] });

const defaultData: ValidationSchema = {
  address: '',
  comment: '',
  specification: [
    {
      type: elementTypes[0].value,
      nomenclature: null,
      coatingType: null,
      edgeProcessing: null,
      emalitFilm: null,
      facet: null,
      gasFilling: null,
      hardening: null,
      paint: null,
      sandBlaster: null,
      hydrofob: false,
    },
  ],
  title: '',
  type: null,
};

export type ValidationSchema = z.infer<typeof formSchema>;
export type SpecificationSchema = z.infer<typeof specificationSchema>;

export { defaultData, formSchema };
