import { UseFormReturnType } from '@mantine/form';
import { find } from 'lodash';
import Image from 'next/image';
import React from 'react';

import elementTypes from '@/data/order/element-type';
import { SpecificationSchema, ValidationSchema } from '@/types/NewOrder';

import VisualizationButton from './items/VisualizationButton';

interface IProps {
  element: SpecificationSchema;
  index: number;
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
  form: UseFormReturnType<ValidationSchema, (values: ValidationSchema) => ValidationSchema>;
}
export default function VisualizationItem({ element, index, activeTab, setActiveTab, form }: IProps) {
  const formValue = form.getInputProps(`specification.${index}`).value;

  return (
    <div className='relative w-[25px] md:w-[35px] xl:w-[40px]'>
      <VisualizationButton activeTab={activeTab} setActiveTab={setActiveTab} id={index} />
      <Image
        src={`/${(find(elementTypes, ['value', formValue.type]) ?? elementTypes[0]).imageType}.png`}
        alt={element.type}
        width={70}
        height={200}
      />
    </div>
  );
}
