import * as context from "next/headers";

import { googleAuth } from "@/libs/lucia";

export const GET = async () => {
  const [url, state] = await googleAuth.getAuthorizationUrl();

  context.cookies().set("google_oauth_state", state, {
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
