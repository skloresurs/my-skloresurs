import { Alert, Button, Stack, Text } from '@mantine/core';
import { RefreshCw, ServerCrash } from 'lucide-react';
import React from 'react';

interface IProps extends React.ComponentPropsWithoutRef<typeof Alert> {
  title?: string;
  description?: string;
  refresh?: () => void;
}

export default function ErrorAlert({
  title = 'Помилка',
  description = 'Помилка завантаження',
  refresh,
  ...otherProps
}: IProps) {
  return (
    <Alert title={title} icon={<ServerCrash />} color='red' radius='md' {...otherProps}>
      <Stack>
        <Text size='sm'>{description}</Text>
        {refresh && (
          <Button variant='subtle' leftSection={<RefreshCw />} color='red' onClick={refresh}>
            Повторити
          </Button>
        )}
      </Stack>
    </Alert>
  );
}
