import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export default function oauthErrorRedirect(
  message: string,
  activeSession: boolean
): NextResponse {
  cookies().set('oauth_error', message);
  return NextResponse.json(null, {
    headers: { location: activeSession ? '/profile?tab=link' : '/' },
    status: 302,
  });
}
