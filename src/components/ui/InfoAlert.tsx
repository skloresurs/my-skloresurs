import { Alert } from '@mantine/core';
import { Info } from 'lucide-react';
import React from 'react';

interface IProps extends React.ComponentPropsWithoutRef<typeof Alert> {
  title: string;
  description: string;
}

export default function InfoAlert({ title, description, ...otherProps }: IProps) {
  return (
    <Alert title={title} icon={<Info />} radius='md' {...otherProps}>
      {description}
    </Alert>
  );
}
