import { Alert, Loader } from '@mantine/core';
import React, { memo } from 'react';

interface IProps extends React.ComponentPropsWithoutRef<typeof Alert> {
  title?: string;
  description?: string;
}

function LoadingAlert({ title = 'Завантаження', description = 'Зачекайте, будь ласка', ...otherProps }: IProps) {
  return (
    <Alert title={title} icon={<Loader color='blue' size='sm' />} color='gray' radius='md' {...otherProps}>
      {description}
    </Alert>
  );
}

export default memo(LoadingAlert);
