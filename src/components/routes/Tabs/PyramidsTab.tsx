'use client';

import { Accordion, Badge, Divider, Flex, Group, Stack } from '@mantine/core';
import { groupBy, map, orderBy, reduce, uniq } from 'lodash';
import { Globe, UserRound } from 'lucide-react';
import { nanoid } from 'nanoid';
import plural from 'plurals-cldr';
import React, { memo, useMemo, useState } from 'react';
import useSWR from 'swr';

import DrawerItem from '@/components/ui/DrawerItem';
import ErrorAlert from '@/components/ui/ErrorAlert';
import InfoAlert from '@/components/ui/InfoAlert';
import LoadingAlert from '@/components/ui/LoadingAlert';
import OutsideLinkButton from '@/components/ui/OutsideLinkButton';
import TelephoneButton from '@/components/ui/TelephoneButton';
import { getGoogleMapsRouteUrl } from '@/libs/maps-api';
import plurals from '@/libs/plurals';
import IRoute, { IPyramid } from '@/types/Route';
import IUser1C from '@/types/User1CData';

interface IProps {
  route: IRoute;
}

function groupByAddress(pyramids: IPyramid[]) {
  return reduce(
    groupBy(pyramids, 'address'),
    (acc, value) => {
      const v = value[0];
      if (!v) return acc;
      acc.push({
        id: nanoid(),
        address: v.address,
        pyramids: map(value, 'id').join(', '),
        tels: uniq(map(value, 'tel')),
      });
      return acc;
    },
    [] as {
      id: string;
      address: string;
      pyramids: string;
      tels: string[];
    }[]
  );
}

function PyramidsTab({ route }: IProps) {
  const { data, isValidating, error, mutate } = useSWR<IPyramid[]>(`/api/routes/${route.id}/pyramids`);
  const [mainAccordion, setMainAccordion] = useState<string | null>(null);

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
                </Group>
              </Flex>
            </Accordion.Control>
            <div className='bg-[var(--mantine-color-dark-8)]'>
              <Accordion.Panel>
                <Stack gap='sm'>
                  <DrawerItem label='Менеджер' value={manager?.name}>
                    <TelephoneButton tel={manager?.tel} />
                  </DrawerItem>
                  <Divider />
                  {map(groupByAddress(pyramids), (e) => (
                    <Stack id={e.id} gap='4px'>
                      <DrawerItem label='Адреса' value={e.address}>
                        <OutsideLinkButton
                          icon={<Globe size={20} />}
                          target='_blank'
                          link={getGoogleMapsRouteUrl([e.address])}
                        />
                      </DrawerItem>
                      <DrawerItem label='Піраміди' value={e.pyramids} />
                      {map(e.tels, (tel, i) => (
                        <DrawerItem label={`Телефон №${i + 1}`} value={tel}>
                          <TelephoneButton tel={tel} />
                        </DrawerItem>
                      ))}
                      <Divider mt='sm' />
                    </Stack>
                  ))}
                </Stack>
              </Accordion.Panel>
            </div>
          </Accordion.Item>
        </div>
      ))}
    </Accordion>
  );
}

export default memo(PyramidsTab);
