import { Fieldset, Tabs } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { find, keys, map, some, startsWith } from 'lodash';
import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';

import types from '@/data/order/types';
import { defaultData, ValidationSchema } from '@/types/NewOrder';

import SpecificationItem from './SpecificationItem';

interface IProps {
  form: UseFormReturnType<ValidationSchema, (values: ValidationSchema) => ValidationSchema>;
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Specification({ form, activeTab, setActiveTab }: IProps) {
  const type = find(types, ['value', form.values.type]);

  useEffect(() => {
    if (activeTab === 'new') {
      form.insertListItem('specification', { ...defaultData.specification[0], key: nanoid() });
      if (type?.twoGrops) {
        form.insertListItem('specification', { ...defaultData.specification[0], key: nanoid() });
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
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          {map(form.values.specification, (e, i) => (
            <Tabs.Tab
              key={nanoid()}
              value={i.toString()}
              className={some(keys(form.errors), (key) => startsWith(key, `specification.${i}`)) ? 'text-red-500' : ''}
            >
              {i}
            </Tabs.Tab>
          ))}
          <Tabs.Tab value='remove' disabled={form.values.specification?.length < 2}>
            -
          </Tabs.Tab>
          <Tabs.Tab
            value='new'
            disabled={type?.maxElements ? type?.maxElements <= form.values.specification?.length : true}
          >
            +
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <SpecificationItem activeTab={activeTab} form={form} />
    </Fieldset>
  );
}
