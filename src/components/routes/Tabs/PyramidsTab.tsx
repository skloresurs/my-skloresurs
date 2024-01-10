'use client';

import { Accordion, Stack, Text } from '@mantine/core';
import { map } from 'lodash';
import { Pyramid } from 'lucide-react';
import Link from 'next/link';
import React, { memo } from 'react';
import useSWR from 'swr';

import ErrorAlert from '@/components/ui/ErrorAlert';
import InfoAlert from '@/components/ui/InfoAlert';
import LoadingAlert from '@/components/ui/LoadingAlert';
import IRoute, { IPyramid } from '@/types/Route';

interface IProps {
  route: IRoute;
}

function PyramidsTab({ route }: IProps) {
  const { data, isValidating, error, mutate } = useSWR<IPyramid[]>(`/api/routes/${route.id}/pyramids`);

  if (isValidating) {
    return <LoadingAlert title='Завантаженя' description='Завантаження пірамід, будь ласка зачекайте...' mt='sm' />;
  }

  if (error) {
    return (
      <ErrorAlert
        title='Помилка завантаження'
        description='Не вдалось завантажити список пірамід'
        refresh={mutate}
        mt='sm'
      />
    );
  }

  if (!data || data.length === 0) {
    return <InfoAlert title='Немає пірамід' description='Не знадено жодної піраміди' mt='sm' />;
  }

  return (
    <Accordion mt='sm'>
      {map(data, (pyramid) => (
        <Accordion.Item value={pyramid.id} key={pyramid.id}>
          <Accordion.Control icon={<Pyramid />}>{pyramid.id}</Accordion.Control>
          <Accordion.Panel>
            <Stack gap='sm'>
              <Text>
                <Text span fw={600}>
                  Контагент:
                </Text>
                {` ${pyramid.agent}`}
              </Text>
              <Text>
                <Text span fw={600}>
                  Менеджер:
                </Text>
                {` ${pyramid.manager}`}
              </Text>
              <Text>
                <Text span fw={600}>
                  Адреса:
                </Text>
                {` ${pyramid.address}`}
              </Text>
              <Text>
                <Text span fw={600}>
                  {`Телефон: `}
                </Text>
                <Link href={`tel:${pyramid.tel}`}>{`${pyramid.tel}`}</Link>
              </Text>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default memo(PyramidsTab);
