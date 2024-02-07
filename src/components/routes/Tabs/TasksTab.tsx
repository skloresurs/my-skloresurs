'use client';

import { Accordion, Flex, Stack, Text } from '@mantine/core';
import { map } from 'lodash';
import { AlarmClockCheck } from 'lucide-react';
import React, { memo } from 'react';
import useSWR from 'swr';

import DrawerItem from '@/components/ui/DrawerItem';
import ErrorAlert from '@/components/ui/ErrorAlert';
import InfoAlert from '@/components/ui/InfoAlert';
import LoadingAlert from '@/components/ui/LoadingAlert';
import TelephoneButton from '@/components/ui/TelephoneButton';
import { phoneRegexp } from '@/libs/regexp';
import IRoute, { ITask } from '@/types/Route';

interface IProps {
  route: IRoute;
}

function TasksTab({ route }: IProps) {
  const { data, isValidating, error, mutate } = useSWR<ITask[]>(`/api/routes/${route.id}/tasks`);

  if (isValidating) {
    return <LoadingAlert title='Завантаженя' description='Завантаження завдань, будь ласка зачекайте...' mt='sm' />;
  }

  if (error) {
    return (
      <ErrorAlert
        title='Помилка завантаження'
        description='Не вдалось завантажити список завдань'
        refresh={mutate}
        mt='sm'
      />
    );
  }

  if (!data || data.length === 0) {
    return <InfoAlert title='Немає завдань' description='Не знадено жодного завдання' mt='sm' />;
  }

  return (
    <Accordion mt='sm'>
      {map(data, (task) => (
        <Accordion.Item value={task.id} key={task.id}>
          <Accordion.Control icon={<AlarmClockCheck />}>Завдання №{task.id}</Accordion.Control>
          <Accordion.Panel>
            <Stack gap='sm'>
              <DrawerItem label='Менеджер' value={task.manager} />
              <Flex align='center' gap='xs'>
                <Text>{task.description}</Text>
                <TelephoneButton tel={task.description.match(phoneRegexp)?.at(0)} />
              </Flex>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default memo(TasksTab);
