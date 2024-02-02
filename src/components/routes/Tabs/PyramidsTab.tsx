'use client';

import { Accordion, Badge, Flex, Group, Stack } from '@mantine/core';
import { groupBy, map, orderBy, reduce } from 'lodash';
import { Pyramid, UserRound } from 'lucide-react';
import { nanoid } from 'nanoid';
import plural from 'plurals-cldr';
import React, { memo, useMemo, useState } from 'react';
import useSWR from 'swr';

import DrawerItem from '@/components/ui/DrawerItem';
import ErrorAlert from '@/components/ui/ErrorAlert';
import InfoAlert from '@/components/ui/InfoAlert';
import LoadingAlert from '@/components/ui/LoadingAlert';
import TelephoneButton from '@/components/ui/TelephoneButton';
import plurals from '@/libs/plurals';
import IRoute, { IPyramid } from '@/types/Route';
import IUser1C from '@/types/User1CData';

interface IProps {
  route: IRoute;
}

function PyramidsTab({ route }: IProps) {
  const { data, isValidating, error, mutate } = useSWR<IPyramid[]>(`/api/routes/${route.id}/pyramids`);
  const [mainAccordion, setMainAccordion] = useState<string | null>(null);
  const [subAccordion, setSubAccordion] = useState<string | null>(null);

  const pyramidsGroup = useMemo(() => {
    if (!data) {
      return [];
    }
    return orderBy(
      reduce(
        groupBy(data, 'agent.id'),
        (acc, value) => {
          const v = value[0];
          if (!v || !v.agent) return acc;
          acc.push({
            id: nanoid(),
            agent: v.agent,
            manager: v.manager,
            value,
          });
          return acc;
        },
        [] as {
          id: string;
          agent: IUser1C;
          manager: IUser1C | null;
          value: IPyramid[];
        }[]
      ),
      (e) => e.value.length,
      'desc'
    );
  }, [data]);

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
    <Accordion mt='sm' value={mainAccordion} onChange={setMainAccordion}>
      {map(pyramidsGroup, ({ agent, manager, value: pyramids }) => (
        <div key={agent.id} className={mainAccordion === agent.id ? 'bg-[var(--mantine-color-dark-8)]' : ''}>
          <Accordion.Item value={agent.id}>
            <Accordion.Control icon={<UserRound />}>
              <Flex align='center' justify='space-between'>
                {agent.name}
                <Group mr='xs'>
                  <Badge variant='light'>
                    {pyramids.length} {plurals.pyramid![plural('uk', pyramids.length) ?? '']}
                  </Badge>
                  <TelephoneButton tel={agent.tel} />
                </Group>
              </Flex>
            </Accordion.Control>
            <div className='bg-[var(--mantine-color-dark-8)]'>
              <Accordion.Panel>
                <Stack gap='sm'>
                  <DrawerItem label='Менеджер' value={manager?.name}>
                    <TelephoneButton tel={manager?.tel} />
                  </DrawerItem>
                  <Accordion value={subAccordion} onChange={setSubAccordion}>
                    {map(pyramids, (pyramid) => (
                      <div className={subAccordion === pyramid.id ? 'bg-[var(--mantine-color-dark-9)]' : ''}>
                        <Accordion.Item value={pyramid.id} key={pyramid.id}>
                          <Accordion.Control icon={<Pyramid />}>{pyramid.id}</Accordion.Control>
                          <Accordion.Panel>
                            <Stack gap='sm'>
                              <DrawerItem label='Адреса' value={pyramid.address}></DrawerItem>
                              <DrawerItem label='Телефон' value={pyramid.tel}>
                                <TelephoneButton tel={pyramid.tel} />
                              </DrawerItem>
                            </Stack>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </div>
                    ))}
                  </Accordion>
                </Stack>
              </Accordion.Panel>
            </div>
          </Accordion.Item>
        </div>
      ))}
      {/* {map(pyramids, (pyramid) => (
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
      ))} */}
    </Accordion>
  );
}

export default memo(PyramidsTab);
