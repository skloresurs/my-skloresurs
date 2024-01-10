import { cookies } from 'next/headers';

export default function oauthRedirect(activeSession: boolean): Response {
  return new Response(null, {
    headers: { location: activeSession ? '/profile?tab=link' : '/' },
    status: 302,
  });
}

export function oauthErrorRedirect(message: string, activeSession: boolean): Response {
  cookies().set('oauth_error', message);
  return oauthRedirect(activeSession);
}
