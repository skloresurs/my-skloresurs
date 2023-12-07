import { NextRequest } from 'next/server';

const getUserIp = (request: NextRequest) =>
  request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for');

export default getUserIp;
