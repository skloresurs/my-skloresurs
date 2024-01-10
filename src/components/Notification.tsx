import { CheckCircle, XCircle } from 'lucide-react';
import React from 'react';

const loadingNotificationProps = {
  loading: true,
  autoClose: false,
  withCloseButton: false,
};

const successNotificationProps = {
  autoClose: 3000,
  color: 'green',
  icon: <CheckCircle />,
  loading: false,
  withCloseButton: true,
};

const errorNotificationProps = {
  color: 'red',
  withCloseButton: true,
  autoClose: 3000,
  loading: false,
  icon: <XCircle />,
};

export { errorNotificationProps, loadingNotificationProps, successNotificationProps };
