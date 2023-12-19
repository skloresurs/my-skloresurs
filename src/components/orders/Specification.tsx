'use client';

import { Fieldset, Overlay, Select, Switch, Tabs, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';

import elementTypes from '@/data/order/element-type';
import types from '@/data/order/types';
import { defaultData, ValidationSchema } from '@/types/NewOrder';

import CoatingTypesSelect from './items/CoatingTypesSelect';
import MainNomenclatureSelect from './items/MainNomenclatureSelect';
import NomenclatureSelect from './items/NomenclatureSelect';
import OperationSelect from './items/OperationSelect';

interface IProps {
  form: UseFormReturnType<ValidationSchema, (values: ValidationSchema) => ValidationSchema>;
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Specification({ form, activeTab, setActiveTab }: IProps) {
  const type = types.find((e) => e.value === form.values.type);

  useEffect(() => {
    if (activeTab === 'new') {
      form.insertListItem('specification', {
        type: elementTypes[0].value,
      });
      if (type?.twoGrops) {
        form.insertListItem('specification', defaultData.specification[0]);
      }
      setActiveTab('0');
    } else if (activeTab === 'remove') {
      form.removeListItem('specification', form.values.specification.length - 1);
      if (type?.twoGrops) {
        form.removeListItem('specification', form.values.specification.length - 2);
      }
      setActiveTab('0');
    }
  }, [activeTab, form, type, setActiveTab]);
  return (
    <Fieldset legend='Параметри і склад виробу' className='relative space-y-2'>
      {!form.values.type && (
        <>
          <Title order={3} className='absolute left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2'>
            Виберіть тип
          </Title>
          <Overlay className='inset-1' blur={8} />
        </>
      )}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          {form.values.specification?.map((e, i) => (
            <Tabs.Tab
              key={nanoid()}
              value={i.toString()}
              className={
                Object.keys(form.errors).findIndex((ee) => ee.startsWith(`specification.${i}.`)) === -1
                  ? ''
                  : 'text-red-500'
              }
            >
              {i}
            </Tabs.Tab>
          ))}
          <Tabs.Tab value='remove' disabled={form.values.specification?.length < 2}>
            -
          </Tabs.Tab>
          <Tabs.Tab
            value='new'
            disabled={type?.maxElementGroups ? type?.maxElementGroups <= form.values.specification?.length : true}
          >
            +
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <div className='space-y-2'>
        <Select
          label='Вид'
          {...form.getInputProps(`specification.${activeTab}.type`)}
          data={elementTypes.map((e) => ({
            ...e,
            disabled: !e.avalibleFor?.includes(form.values.type) && !!e.avalibleFor,
          }))}
          allowDeselect={false}
        />
        <MainNomenclatureSelect activeTab={activeTab} form={form} />
        <div className='flex w-full flex-row gap-2'>
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
        <div className='flex w-full flex-row gap-2'>
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
        <div className='flex w-full flex-row gap-2'>
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
        <div className='flex w-full flex-row gap-2'>
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
    </Fieldset>
  );
}
