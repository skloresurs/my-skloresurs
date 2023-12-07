import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export default function oauthErrorRedirect(
  message: string,
  url?: string
): NextResponse {
  cookies().set('oauth_error', message);
  return NextResponse.json(null, {
    headers: { location: url ?? '/' },
    status: 302,
  });
}
