import { Fieldset } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { map } from 'lodash';
import { nanoid } from 'nanoid';
import React from 'react';

import { ValidationSchema } from '@/types/NewOrder';

import VisualizationItem from './VisualizationItem';

interface IProps {
  form: UseFormReturnType<ValidationSchema, (values: ValidationSchema) => ValidationSchema>;
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Visualization({ form, activeTab, setActiveTab }: IProps) {
  return (
    <Fieldset
      legend='Візуалізація'
      className='order-2 flex flex-row items-center justify-center overflow-x-scroll rounded-md lg:order-1'
    >
      {map(form.values.specification, (e, i) => (
        <VisualizationItem
          key={nanoid()}
          element={e}
          index={i}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          form={form}
        />
      ))}
    </Fieldset>
  );
}
