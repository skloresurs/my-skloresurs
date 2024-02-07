import { Center, Divider, Flex, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { map } from 'lodash';
import React, { memo } from 'react';
import useSWR from 'swr';

import { IUserMeRequest } from '@/types/User';

function ProfileTabSecurity() {
  const { data: user } = useSWR<IUserMeRequest>('/api/user');

  return (
    <Flex direction='column' gap='md' maw='576px'>
      <Paper withBorder shadow='md' radius='md' p='md'>
        <Title order={2} size='h3'>
          Дозволені IP адреси
        </Title>
        <Text size='sm' my='sm'>
          Список дозволених IP адрес для використання вашого аккаунту
        </Text>
        {user?.allowed_ips.length === 0 && (
          <Center>
            <Title order={3} size='h5'>
              Не вказано жодної ip адреси. Вхід дозволено з будь-якого IP
            </Title>
          </Center>
        )}
        <Stack gap='xs' my='sm'>
          {map(user?.allowed_ips, (ip) => (
            <TextInput key={ip} value={ip} readOnly w='100%' />
          ))}
        </Stack>
        <Divider mt='md' />
        <Text size='sm' mt='sm' c='dimmed'>
          Зазвичай не вказано жодної ip адреси
        </Text>
      </Paper>
    </Flex>
  );
}

export default memo(ProfileTabSecurity);
