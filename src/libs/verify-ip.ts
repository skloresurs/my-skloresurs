'server-only';

import { includes, split } from 'lodash';
import { NextRequest } from 'next/server';

import { ForbriddenIpError } from '@/classes/CustomError';

/**
 * Asynchronously verifies the IP address of the request against a list of allowed IP addresses.
 *
 * @param {NextRequest} req - the request object
 * @param {string[] | null} ips - an optional array of IP addresses to compare against
 * @return {Promise<void>} a promise that resolves with no value, or rejects with a ForbiddenIpError
 */
export default async function verifyIp(req: NextRequest, ips?: string[] | null): Promise<void> {
  if (!ips || ips.length === 0) return;

  const userIp = req.ip ?? req.headers.get('x-real-ip') ?? split(req.headers.get('x-forwarded-for'), ',')[0];

  if (!userIp || !includes(ips, userIp)) throw ForbriddenIpError;
}
