import { find } from 'lodash';
import Image from 'next/image';
import React, { useMemo } from 'react';
import useSWR from 'swr';

import { FormType } from '@/types/newOrder/Form';
import ISpecificationType from '@/types/newOrder/SpecificationType';

import VisualizationButton from './VisualizationButton';

interface IProps {
  form: FormType;
  index: number;
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
}
export default function VisualizationItem({ form, index, activeTab, setActiveTab }: IProps) {
  const orderTypeInputProps = form.getInputProps('type');
  const specificationTypeInputProps = form.getInputProps(`specifications.${index}.type`);
  const { data } = useSWR<{ data: ISpecificationType[] }>(`/api/data/specification-types/${orderTypeInputProps.value}`);

  const type = useMemo(
    () => find(data?.data ?? [], ['value', specificationTypeInputProps.value])?.type ?? 'glass',
    [data, specificationTypeInputProps]
  );

  return (
    <div className='relative w-[25px] md:w-[35px] xl:w-[40px]'>
      <VisualizationButton activeTab={activeTab} setActiveTab={setActiveTab} index={index} />
      <Image src={`/${type}.png`} alt={type} width={70} height={200} />
    </div>
  );
}
