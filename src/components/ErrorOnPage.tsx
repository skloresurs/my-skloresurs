import { Accordion, Center, Flex, Space, Text, Title } from '@mantine/core';
import React from 'react';

interface IProps {
  title?: string;
  description: string;
  code: number;
  detailedMessage?: string;
}

export default function ErrorOnPage({ title, description, code, detailedMessage }: IProps) {
  return (
    <Center maw={576} mx='auto'>
      <Flex align='center' justify='center' direction='column' gap='xs'>
        <Title order={2} size='h1'>
          {title ?? 'Помилка'}
        </Title>
        <Text>{description}</Text>
        <Text size='xs' c='dimmed'>
          Код помилки: {code}
        </Text>
        <Space h='xl' />
        {detailedMessage && (
          <Accordion variant='filled' w='100%'>
            <Accordion.Item value='error-message'>
              <Accordion.Control c='dimmed'>
                <Center>Детальніше</Center>
              </Accordion.Control>
              <Accordion.Panel>{detailedMessage}</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}
      </Flex>
    </Center>
  );
}
