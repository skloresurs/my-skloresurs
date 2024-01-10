'server-only';

import * as context from 'next/headers';
import { NextRequest } from 'next/server';
import UAParser from 'ua-parser-js';

import { UnauthorizedError } from '@/classes/CustomError';
import ISession from '@/types/Session';
import IUser from '@/types/User';

import { auth } from './lucia';

export default async function generateSession(request: NextRequest, userId: string): Promise<ISession> {
  const parser = new UAParser(request.headers.get('user-agent') ?? '');
  return auth.createSession({
    attributes: {
      browser: `${parser.getBrowser().name} ${parser.getBrowser().version}`,
      os: parser.getOS().name,
    },
    userId,
  });
}

export async function setSession(request: NextRequest, userId: string) {
  const session = await generateSession(request, userId);
  const authRequest = auth.handleRequest(request.method, context);
  await auth.deleteDeadUserSessions(userId);
  authRequest.setSession(session);
}

interface ISessionExtended extends ISession {
  user: IUser;
}

export async function getSession(request: NextRequest): Promise<ISessionExtended> {
  const authRequest = auth.handleRequest(request.method, context);
  const session = await authRequest.validate();

  if (!session) {
    throw UnauthorizedError;
  }
  return session;
}
