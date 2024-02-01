import { Text } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

interface IProps {
  label: string;
  tel?: string | null;
}

export default function TelephoneLink({ label, tel }: IProps) {
  if (!tel) {
    return <Text>{label}</Text>;
  }
  return <Link href={`tel:${tel}`}>{label}</Link>;
}
