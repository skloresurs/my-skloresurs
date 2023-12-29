import { CircleSlash, Loader2, ServerCrash } from 'lucide-react';
import React, { ReactNode } from 'react';

interface IProps {
  isValidating?: boolean;
  error: unknown;
  forbidden?: boolean;
  defaultValue?: ReactNode;
}

export default function AsyncInputRightSections({ isValidating, error, forbidden, defaultValue }: IProps) {
  if (isValidating) {
    return <Loader2 className='animate-spin' />;
  }
  if (error) {
    <ServerCrash />;
  }
  if (forbidden) {
    <CircleSlash />;
  }
  return defaultValue;
}
