'server-only';

import axios from 'axios';

export default async function verifyIp(ips: string[]): Promise<boolean> {
  const { data } = await axios.get(`https://geolocation-db.com/json/`);
  return ips.length === 0 || ips.includes(data.IPv4);
}
