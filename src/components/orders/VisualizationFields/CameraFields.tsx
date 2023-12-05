'use client';

import { Select, Slider, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React from 'react';

import { ValidationSchema } from '@/types/NewOrder';
import { ICamera } from '@/types/VisualizationData';

interface IProps {
  form: UseFormReturnType<
    ValidationSchema,
    (values: ValidationSchema) => ValidationSchema
  >;
  index: number;
}

export default function CameraFields({ form, index }: IProps) {
  // OK, because it's all fields is public
  // eslint-disable-next-line security/detect-object-injection
  const data = form.values.visualization[index] as ICamera;
  const [sliderData, setSliderData] = React.useState(data.thickness ?? 8);
  return (
    <div className="space-y-2">
      <Select
        label="Вид номенклатури"
        data={[]}
        value={data.nomenclature}
        onChange={(value) =>
          form.setFieldValue(`visualization.${index}.nomenclature`, value)
        }
      />
      <Text>Товщина</Text>
      <Slider
        label={(value) => `${value}mm.`}
        min={8}
        max={24}
        step={2}
        value={sliderData}
        onChange={(value) => setSliderData(value)}
        onChangeEnd={(value) =>
          form.setFieldValue(`visualization.${index}.thickness`, value)
        }
      />
      <Select
        label="Вид номенклатури"
        data={[]}
        value={data.type}
        onChange={(value) =>
          form.setFieldValue(`visualization.${index}.type`, value)
        }
      />
      <Select
        label="Газонаповнення"
        data={[]}
        value={data.gas}
        onChange={(value) =>
          form.setFieldValue(`visualization.${index}.gas`, value)
        }
      />
    </div>
  );
}
