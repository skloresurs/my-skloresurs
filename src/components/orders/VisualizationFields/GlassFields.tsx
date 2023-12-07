'use client';

import { ComboboxItem, Select, Slider, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React from 'react';

import { ValidationSchema } from '@/types/NewOrder';
import { IGlass } from '@/types/VisualizationData';

interface IProps {
  form: UseFormReturnType<
    ValidationSchema,
    (values: ValidationSchema) => ValidationSchema
  >;
  index: number;
}

type Nomenclature = ComboboxItem & {
  thicknesses: string[];
};

const nomenclature: Nomenclature[] = [
  {
    label: 'Скло сире',
    thicknesses: ['4mm', '5mm', '6mm', '8mm', '10mm', '12mm'],
    value: '000000005',
  },
  {
    label: 'Триплекс заводський',
    thicknesses: ['6mm', '8mm', '10mm', '11mm', '13mm'],
    value: '000000012',
  },
];

export default function GlassFields({ form, index }: IProps) {
  // OK, because it's all fields is public
  // eslint-disable-next-line security/detect-object-injection
  const data = form.values.visualization[index] as IGlass;
  const [sliderData, setSliderData] = React.useState(data.facet ?? 5);
  return (
    <div className="space-y-2">
      <Select
        label="Вид номенклатури"
        data={nomenclature}
        value={data.nomenclature}
        allowDeselect={false}
        onChange={(value) => {
          form.setFieldValue(`visualization.${index}.nomenclature`, value);
          form.setFieldValue(
            `visualization.${index}.thickness`,
            nomenclature.find((item) => item.value === value)?.thicknesses[0]
          );
        }}
      />
      <Select
        label="Товщина"
        data={
          nomenclature.find((item) => item.value === data.nomenclature)
            ?.thicknesses ?? []
        }
        allowDeselect={false}
        value={data.thickness}
        onChange={(value) =>
          form.setFieldValue(`visualization.${index}.thickness`, value)
        }
      />
      <Select
        label="Тип скла"
        data={[]}
        value={data.type}
        onChange={(value) =>
          form.setFieldValue(`visualization.${index}.type`, value)
        }
      />
      <Select
        label="Обробка кромки"
        data={[]}
        value={data.edge}
        onChange={(value) =>
          form.setFieldValue(`visualization.${index}.edge`, value)
        }
      />
      <Select
        label="Піскоструй"
        data={[]}
        value={data.sandblast}
        onChange={(value) =>
          form.setFieldValue(`visualization.${index}.sandblast`, value)
        }
      />
      <Text>Фацет</Text>
      <Slider
        label={(value) => `${value}mm.`}
        min={5}
        max={50}
        step={5}
        value={sliderData}
        onChange={(value) => setSliderData(value)}
        onChangeEnd={(value) =>
          form.setFieldValue(`visualization.${index}.facet`, value)
        }
      />
      <Select
        label="Покриття"
        data={[]}
        value={data.coating}
        onChange={(value) =>
          form.setFieldValue(`visualization.${index}.coating`, value)
        }
      />
    </div>
  );
}
