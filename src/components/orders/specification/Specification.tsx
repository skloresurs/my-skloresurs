import { Fieldset, Tabs, Title } from '@mantine/core';
import { find, forEach, keys, map, some, startsWith } from 'lodash';
import { BadgeMinus, BadgePlus } from 'lucide-react';
import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import useSWR from 'swr';

import { FormType } from '@/types/newOrder/Form';
import IOrderType from '@/types/newOrder/OrderType';
import { defaultSpecificationData } from '@/types/newOrder/Specification';

import SpecificationItem from './SpecificationItem';

interface IProps {
  form: FormType;
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Specification({ form, activeTab, setActiveTab }: IProps) {
  const { data: orderTypes } = useSWR<{ data: IOrderType[] }>(`/api/data/order-types`);
  const activeType = find(orderTypes?.data, ['value', form.getInputProps('type').value]);
  const specificationsInputProps = form.getInputProps('specifications');

  // This hook handle 'new' or 'remove' tab for add or remove specifications
  useEffect(() => {
    const tempArray = Array.from({ length: activeType?.groupSize ?? 1 });
    if (activeTab === 'new') {
      forEach(tempArray, () => form.insertListItem('specifications', { ...defaultSpecificationData }));
      setActiveTab('0');
    } else if (activeTab === 'remove') {
      forEach(tempArray, (_, i) =>
        form.removeListItem('specifications', specificationsInputProps.value.length - i - 1)
      );
      setActiveTab('0');
    }
  }, [activeType, activeTab, form, setActiveTab, specificationsInputProps]);

  return (
    <Fieldset legend='Параметри і склад виробу' className='relative space-y-2'>
      {form.getInputProps('type').value ? (
        <>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              {map(specificationsInputProps.value, (_, i) => (
                <Tabs.Tab
                  key={nanoid()}
                  value={i.toString()}
                  className={
                    some(keys(form.errors), (key) => startsWith(key, `specifications.${i}`)) ? 'text-red-500' : ''
                  }
                >
                  {i}
                </Tabs.Tab>
              ))}
              <Tabs.Tab c='red' value='remove' disabled={specificationsInputProps.value.length <= 1}>
                <BadgeMinus size={18} />
              </Tabs.Tab>
              <Tabs.Tab
                c='green'
                value='new'
                disabled={(activeType?.max ?? 0) <= specificationsInputProps.value.length}
              >
                <BadgePlus size={18} />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <SpecificationItem activeTab={activeTab} form={form} />
        </>
      ) : (
        <div className='flex h-full w-full items-center justify-center'>
          <Title order={2} size='h3'>
            Виберіть вид замовлення, для налаштування специфікацій
          </Title>
        </div>
      )}
    </Fieldset>
  );
}
