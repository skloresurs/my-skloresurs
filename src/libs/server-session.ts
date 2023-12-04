import 'server-only';

import * as context from 'next/headers';

import { auth } from '@/libs/lucia';

export default async function getSession() {
  const authRequest = auth.handleRequest('GET', context);
  return authRequest.validate();
}
