'server-only';

import { includes, split } from 'lodash';
import { NextRequest } from 'next/server';

import { ForbriddenIpError } from '@/classes/CustomError';

export default async function verifyIp(req: NextRequest, ips: string[]): Promise<void> {
  if (ips.length === 0) return;
  const userIp = req.ip ?? req.headers.get('x-real-ip') ?? split(req.headers.get('x-forwarded-for'), ',')[0];
  if (!userIp) throw ForbriddenIpError;
  if (!includes(ips, userIp)) {
    throw ForbriddenIpError;
  }
}
