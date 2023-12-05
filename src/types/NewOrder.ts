import { z } from 'zod';

import { cameraSchema, filmSchema, glassSchema } from './VisualizationData';

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
  visualization: z.array(glassSchema.or(filmSchema.or(cameraSchema))),
});

export type ValidationSchema = z.infer<typeof formSchema>;

export { formSchema };
