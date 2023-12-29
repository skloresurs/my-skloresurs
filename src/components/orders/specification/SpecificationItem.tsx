'use client';

import { Checkbox, Title } from '@mantine/core';
import { find } from 'lodash';
import React from 'react';
import useSWR from 'swr';

import { FormType } from '@/types/newOrder/Form';
import ISpecificationType from '@/types/newOrder/SpecificationType';

import BaseSelect from './items/BaseSelect';
import NomenclatureSelect from './items/NomenclatureSelect';
import TypeSelect from './items/TypeSelect';

interface IProps {
  form: FormType;
  activeTab: string | null;
}

export default function SpecificationItem({ form, activeTab }: IProps) {
  const orderTypeInputProps = form.getInputProps(`type`);
  const specificationTypeInputProps = form.getInputProps(`specifications.${activeTab}.type`);
  const nomenclatureInputProps = form.getInputProps(`specifications.${activeTab}.nomenclature`);

  const { data: specificationTypes } = useSWR<{ data: ISpecificationType[] }>(
    `/api/data/specification-types/${orderTypeInputProps.value}`
  );

  const specificationType = find(specificationTypes?.data ?? [], ['value', specificationTypeInputProps.value]);

  return (
    <div className='space-y-2'>
      <TypeSelect form={form} activeTab={activeTab} />
      {specificationTypeInputProps.value ? (
        <>
          <NomenclatureSelect activeTab={activeTab} form={form} />
          {nomenclatureInputProps.value ? (
            <>
              <div className='flex flex-wrap gap-2'>
                <BaseSelect
                  url='/operations/212f6141-d629-4120-8600-e6d109c7b9e6'
                  form={form}
                  formKey='edgeProcessing'
                  label='Обробка кромки'
                  activeTab={activeTab}
                  hidden={!(specificationType?.type === 'glass' && specificationType.label !== 'Склопакет')}
                  require={form.getInputProps(`specifications.${activeTab}.tempRequireEdgeProcessing`).value}
                />
                <BaseSelect
                  url='/operations/c66e9ea1-3465-464f-bd6d-f2dc7f0a05c5'
                  form={form}
                  formKey='facet'
                  label='Фацет'
                  activeTab={activeTab}
                  hidden={!(specificationType?.type === 'glass' && specificationType.label !== 'Склопакет')}
                />
                <BaseSelect
                  url='/coating-types'
                  form={form}
                  formKey='coatingType'
                  label='Тип покриття'
                  activeTab={activeTab}
                />
                <BaseSelect
                  url='/nomenclatures/e18bed8f-54e9-4dc8-915d-80ed028639d3'
                  form={form}
                  formKey='paint'
                  label='Фарба'
                  activeTab={activeTab}
                  hidden={!(specificationType?.type === 'glass' && specificationType.label !== 'Склопакет')}
                />
                <BaseSelect
                  url='/nomenclatures/ddf96a56-c08f-11e7-a83b-9c8e990dc4ce'
                  form={form}
                  formKey='emalitFilm'
                  label='Плівка Емаліт'
                  activeTab={activeTab}
                  hidden={!(specificationType?.type === 'glass' && specificationType.label !== 'Склопакет')}
                />
                <BaseSelect
                  url='/operations/bc3a4fa8-ee8f-4f87-af16-9a49771f1ff9'
                  form={form}
                  formKey='hardening'
                  label='Гартування'
                  activeTab={activeTab}
                  hidden={
                    !(specificationType?.type === 'glass' && specificationType.label !== 'Склопакет') ||
                    !form.getInputProps(`specifications.${activeTab}.tempAllowHardening`).value
                  }
                  require={form.getInputProps(`specifications.${activeTab}.tempRequireHardening`).value}
                />
                <BaseSelect
                  url='/operations/6cbbd1f3-55a3-4b4d-8dfb-d8a2c9fc4eea'
                  form={form}
                  formKey='gasFilling'
                  label='Газонаповнювач'
                  activeTab={activeTab}
                  hidden={specificationType?.type !== 'camera'}
                />
                <BaseSelect
                  url='/operations/85a785bc-0a9d-40b3-9e6b-d61c2db1b787'
                  form={form}
                  formKey='sandBlaster'
                  label='Піскоструй'
                  activeTab={activeTab}
                  hidden={!(specificationType?.type === 'glass' && specificationType.label !== 'Склопакет')}
                />
              </div>
              <div className='flex w-full flex-row gap-2'>
                <Checkbox
                  label='Гідрофоб'
                  {...form.getInputProps(`specifications.${activeTab}.hydrofob`, { type: 'checkbox' })}
                />
                {specificationType?.type === 'glass' && specificationType.label !== 'Склопакет' && (
                  <Checkbox
                    label='HST'
                    {...form.getInputProps(`specifications.${activeTab}.hst`, { type: 'checkbox' })}
                  />
                )}
              </div>
            </>
          ) : (
            <Title order={2} size='h4' className='text-center'>
              Виберіть номенклатуру, щоб продовжити налаштування
            </Title>
          )}
        </>
      ) : (
        <Title order={2} size='h4' className='text-center'>
          Виберіть тип, щоб продовжити налаштування
        </Title>
      )}
    </div>
  );
}
