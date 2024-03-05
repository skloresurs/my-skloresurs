import { cookies } from 'next/headers';

/**
 * Create an OAuth redirect response.
 *
 * @param {boolean} activeSession - indicates if the session is active
 * @return {Response} the redirect response
 */
export default function oauthRedirect(activeSession: boolean): Response {
  return new Response(null, {
    headers: { location: activeSession ? '/profile?tab=link' : '/' },
    status: 302,
  });
}

/**
 * Redirects to the OAuth error page and sets the error message in a cookie.
 *
 * @param {string} message - The error message to be set in the cookie
 * @param {boolean} activeSession - Indicates whether the user has an active session
 * @return {Response} The response object for the OAuth redirect
 */
export function oauthErrorRedirect(message: string, activeSession: boolean): Response {
  cookies().set('oauth_error', message);
  return oauthRedirect(activeSession);
}
