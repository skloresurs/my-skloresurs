'server-only';

import axios from 'axios';

import { ForbriddenIpError } from '@/classes/CustomError';

export default async function verifyIp(ips: string[]): Promise<void> {
  const { data } = await axios.get(`https://geolocation-db.com/json/`);
  if (ips.length > 0 && !ips.includes(data.IPv4)) {
    throw ForbriddenIpError;
  }
}
