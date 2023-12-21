import { Fieldset } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { find, map } from 'lodash';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import React from 'react';

import elementTypes from '@/data/order/element-type';
import { ValidationSchema } from '@/types/NewOrder';

import VisualizationButton from './items/VisualizationButton';

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
        <div key={nanoid()} className='relative w-[25px] md:w-[35px] xl:w-[40px]'>
          <VisualizationButton activeTab={activeTab} setActiveTab={setActiveTab} id={i} />
          <Image
            src={`/${find(elementTypes, ['value', e.type])?.imageType}.png`}
            alt={e.type}
            width={70}
            height={200}
          />
        </div>
      ))}
    </Fieldset>
  );
}
