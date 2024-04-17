import * as context from "next/headers";

import { facebookAuth } from "@/libs/lucia";

export const GET = async () => {
  const [url, state] = await facebookAuth.getAuthorizationUrl();

  context.cookies().set("facebook_oauth_state", state, {
    httpOnly: true,
    maxAge: 60 * 60,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return new Response(null, {
    headers: {
      Location: url.toString(),
    },
    status: 302,
  });
};
