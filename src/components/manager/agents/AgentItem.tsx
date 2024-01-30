import { Card, Flex, Group, Text, Title } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import plural from 'plurals-cldr';
import React from 'react';

import plurals from '@/libs/plurals';
import { IAgent } from '@/types/ManagerOrder';

interface IProps {
  agent: IAgent;
}

export default function AgentItem({ agent }: IProps) {
  const query = useSearchParams();
  const router = useRouter();
  function onClick() {
    const current = new URLSearchParams([...query.entries()]);

    current.delete('page');
    current.delete('group-by-agents');
    current.set('agent', agent.id);

    const filter = current.toString();
    const newQuery = filter ? `?${filter}` : '';

    router.replace(`/manager${newQuery}`);
  }
  return (
    <Card
      shadow='sm'
      radius='md'
      onClick={onClick}
      p='md'
      h='100%'
      className='cursor-pointer select-none duration-300 hover:bg-[var(--mantine-color-dark-5)]'
    >
      <Flex align='center' gap='xs' direction='row' justify='space-between'>
        <Group>
          <Title order={2} size='h3'>
            {agent.name}
          </Title>
          <Text c='dimmed' size='xs'>
            {agent.id}
          </Text>
        </Group>
        <Flex mt='xs' direction='row-reverse'>{`${agent.orders} ${
          plurals.order[plural('uk', agent.orders) ?? '']
        }`}</Flex>
      </Flex>
    </Card>
  );
}
