import { UseFormReturnType } from '@mantine/form';
import { z } from 'zod';

import specificationSchema, { defaultSpecificationData } from './Specification';

const formSchema = z
  .object({
    title: z
      .string({ required_error: 'Назва замовлення обов`язкова' })
      .min(1, 'Назва замовлення обов`язкова')
      .max(255, 'Максимальна довжина назви 255 символів'),
    address: z
      .string({ required_error: 'Адреса замовлення обов`язкова' })
      .min(1, 'Адреса замовлення обов`язкова')
      .max(255, 'Максимальна довжина адреси 255 символів'),
    comment: z.string().optional(),
    type: z.string().nullable(),
    specifications: specificationSchema.array().min(1, 'Налаштуйте хоча б одну специфікацію'),
  })
  .strict()
  .refine((data) => data.type, { message: 'Тип замовлення обов`язковий', path: ['type'] });

type ValidationSchema = z.infer<typeof formSchema>;
type FormType = UseFormReturnType<ValidationSchema, (values: ValidationSchema) => ValidationSchema>;

const defaultFormData: ValidationSchema = {
  title: '',
  address: '',
  comment: '',
  type: null,
  specifications: [{ ...defaultSpecificationData }],
};

export default formSchema;
export { defaultFormData };
export type { FormType, ValidationSchema };
