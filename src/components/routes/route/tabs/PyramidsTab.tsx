'use client';

import { Accordion, Badge, Divider, Flex, Group, Stack } from '@mantine/core';
import { groupBy, map, orderBy, reduce, uniq } from 'lodash';
import { Globe, UserRound } from 'lucide-react';
import { nanoid } from 'nanoid';
import plural from 'plurals-cldr';
import React, { memo, useMemo, useState } from 'react';

import DrawerItem from '@/components/ui/DrawerItem';
import OutsideLinkButton from '@/components/ui/OutsideLinkButton';
import TelephoneButton from '@/components/ui/TelephoneButton';
import { getGoogleMapsRouteUrl } from '@/libs/maps-api';
import plurals from '@/libs/plurals';
import PersonData from '@/types/1c/User';
import Pyramid from '@/types/route/Pyramid';
import { FullRoute } from '@/types/route/Route';

interface IProps {
  route: FullRoute;
}

function groupByAddress(pyramids: Pyramid[]) {
  return reduce(
    groupBy(pyramids, 'address'),
    (acc, value) => {
      const v = value[0];
      if (!v) return acc;
      acc.push({
        id: nanoid(),
        city: v.city,
        address: v.address,
        pyramids: map(value, 'id').join(', '),
        tels: uniq(map(value, 'tel')),
      });
      return acc;
    },
    [] as {
      id: string;
      city: string;
      address: string;
      pyramids: string;
      tels: string[];
    }[]
  );
}

function PyramidsTab({ route }: IProps) {
  const [mainAccordion, setMainAccordion] = useState<string | null>(null);

  const pyramidsGroup = useMemo(() => {
    return orderBy(
      reduce(
        groupBy(route.pyramids, 'agent.id'),
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
          agent: PersonData;
          manager: PersonData;
          value: Pyramid[];
        }[]
      ),
      (e) => e.value.length,
      'desc'
    );
  }, [route]);

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
                      <DrawerItem label='Адреса' value={`${e.city}, ${e.address}`}>
                        <OutsideLinkButton
                          icon={<Globe size={20} />}
                          target='_blank'
                          link={getGoogleMapsRouteUrl([`${e.city}, ${e.address}`])}
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
