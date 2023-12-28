'use client';

import { Switch } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React from 'react';

import { ValidationSchema } from '@/types/NewOrder';

import CoatingTypesSelect from './items/CoatingTypesSelect';
import MainNomenclatureSelect from './items/MainNomenclatureSelect';
import NomenclatureSelect from './items/NomenclatureSelect';
import OperationSelect from './items/OperationSelect';
import TypeSelect from './items/TypeSelect';

interface IProps {
  form: UseFormReturnType<ValidationSchema, (values: ValidationSchema) => ValidationSchema>;
  activeTab: string | null;
}

export default function SpecificationItem({ form, activeTab }: IProps) {
  return (
    <div className='space-y-2'>
      <TypeSelect form={form} activeTab={activeTab} />
      <MainNomenclatureSelect activeTab={activeTab} form={form} />
      <div className='flex w-full flex-col md:flex-row md:gap-2'>
        <OperationSelect
          className='flex-1'
          operationId='212f6141-d629-4120-8600-e6d109c7b9e6'
          label='Обробка кромки'
          formKey='edgeProcessing'
          form={form}
          activeTab={activeTab}
        />
        <OperationSelect
          className='flex-1'
          operationId='c66e9ea1-3465-464f-bd6d-f2dc7f0a05c5'
          label='Фацет'
          formKey='facet'
          form={form}
          activeTab={activeTab}
        />
      </div>
      <div className='flex w-full flex-col md:flex-row md:gap-2'>
        <OperationSelect
          className='flex-1'
          operationId='85a785bc-0a9d-40b3-9e6b-d61c2db1b787'
          label='Піскоструй'
          formKey='sandBlaster'
          form={form}
          activeTab={activeTab}
        />
        <OperationSelect
          className='flex-1'
          operationId='bc3a4fa8-ee8f-4f87-af16-9a49771f1ff9'
          label='Гартування'
          formKey='hardening'
          form={form}
          activeTab={activeTab}
        />
      </div>
      <div className='flex w-full flex-col md:flex-row md:gap-2'>
        <OperationSelect
          className='flex-1'
          operationId='6cbbd1f3-55a3-4b4d-8dfb-d8a2c9fc4eea'
          label='Газонаповнювач'
          formKey='gasFilling'
          form={form}
          activeTab={activeTab}
        />
        <CoatingTypesSelect className='flex-1' form={form} activeTab={activeTab} />
      </div>
      <div className='flex w-full flex-col md:flex-row md:gap-2'>
        <NomenclatureSelect
          className='flex-1'
          id='e18bed8f-54e9-4dc8-915d-80ed028639d3'
          label='Краска'
          form={form}
          formKey='paint'
          activeTab={activeTab}
        />
        <NomenclatureSelect
          className='flex-1'
          id='ddf96a56-c08f-11e7-a83b-9c8e990dc4ce'
          label='Плівка Емаліт'
          form={form}
          formKey='emalitFilm'
          activeTab={activeTab}
        />
      </div>
      <Switch label='Гідрофоб' className='mt-2' {...form.getInputProps(`specification.${activeTab}.hydrofob`)} />
    </div>
  );
}
