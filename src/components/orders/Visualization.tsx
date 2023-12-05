'use client';

import { Code, Fieldset, Tabs } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { ValidationSchema } from '@/types/NewOrder';

import VisualizationButton from './VisualizationButton';
import CameraFields from './VisualizationFields/CameraFields';
import FilmFields from './VisualizationFields/FilmFields';
import GlassFields from './VisualizationFields/GlassFields';

interface IProps {
  form: UseFormReturnType<
    ValidationSchema,
    (values: ValidationSchema) => ValidationSchema
  >;
}

export default function Visualization({ form }: IProps) {
  const [activeTab, setActiveTab] = useState<string | null>('0');

  useEffect(() => {
    setActiveTab('0');
  }, [form.values.glass_type]);
  return (
    <div className="flex flex-col gap-2">
      <Fieldset
        legend="Візуалізація"
        className="flex flex-row items-center justify-center rounded-md"
      >
        {form.values.visualization.map((item, i) => {
          if (item.category === 'glass') {
            return (
              <div
                key={nanoid()}
                className={twMerge(
                  'relative',
                  i.toString() === activeTab ? 'w-[55px]' : 'w-[35px]'
                )}
              >
                <Image src="/glass/4.png" alt="" width={90} height={225} />
                <VisualizationButton
                  setActiveTab={setActiveTab}
                  id={i}
                  activeTab={activeTab}
                />
              </div>
            );
          }
          if (item.category === 'film') {
            return (
              <div
                key={nanoid()}
                className={twMerge(
                  'relative',
                  i.toString() === activeTab ? 'w-[55px]' : 'w-[35px]'
                )}
              >
                <Image src="/film/satin.png" alt="" width={90} height={225} />
                <VisualizationButton
                  setActiveTab={setActiveTab}
                  id={i}
                  activeTab={activeTab}
                />
              </div>
            );
          }
          if (item.category === 'camera') {
            return (
              <div
                key={nanoid()}
                className={twMerge(
                  'relative',
                  i.toString() === activeTab ? 'w-[55px]' : 'w-[35px]'
                )}
              >
                <Image src="/camera/6.png" alt="" width={90} height={225} />
                <VisualizationButton
                  setActiveTab={setActiveTab}
                  id={i}
                  activeTab={activeTab}
                />
              </div>
            );
          }

          return null;
        })}
      </Fieldset>
      <Fieldset legend="Налаштування" className="p-2">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            {form.values.visualization.map((item, i) => (
              <Tabs.Tab value={i.toString()} key={nanoid()}>
                {i}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {form.values.visualization.map((item, i) => (
            <Tabs.Panel value={i.toString()} key={nanoid()}>
              {item.category === 'glass' && (
                <GlassFields form={form} index={i} />
              )}
              {item.category === 'film' && <FilmFields form={form} index={i} />}
              {item.category === 'camera' && (
                <CameraFields form={form} index={i} />
              )}
            </Tabs.Panel>
          ))}
        </Tabs>
      </Fieldset>
      <Code block>{JSON.stringify(form.values, null, 2)}</Code>
    </div>
  );
}
