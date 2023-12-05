'use client';

import { Select } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React from 'react';

import { ValidationSchema } from '@/types/NewOrder';
import { IFilm } from '@/types/VisualizationData';

interface IProps {
  form: UseFormReturnType<
    ValidationSchema,
    (values: ValidationSchema) => ValidationSchema
  >;
  index: number;
}

export default function FilmFields({ form, index }: IProps) {
  // OK, because it's all fields is public
  // eslint-disable-next-line security/detect-object-injection
  const data = form.values.visualization[index] as IFilm;
  return (
    <div className="space-y-2">
      <Select
        label="Тип плівки"
        data={[]}
        value={data.type}
        onChange={(value) =>
          form.setFieldValue(`visualization.${index}.type`, value)
        }
      />
    </div>
  );
}
