"server-only";

import * as context from "next/headers";
import type { NextRequest } from "next/server";
import UAParser from "ua-parser-js";

import { UnauthorizedError } from "@/classes/CustomError";
import type ISession from "@/types/Session";
import type IUser from "@/types/User";

import { auth } from "./lucia";

/**
 * Asynchronously generates a session for a user based on the incoming request and user ID.
 *
 * @param {NextRequest} request - the incoming request object
 * @param {string} userId - the ID of the user for whom the session is being generated
 * @return {Promise<ISession>} a promise that resolves to the generated session
 */
export default async function generateSession(request: NextRequest, userId: string): Promise<ISession> {
  const parser = new UAParser(request.headers.get("user-agent") ?? "");
  return auth.createSession({
    attributes: {
      browser: `${parser.getBrowser().name} ${parser.getBrowser().version}`,
      os: parser.getOS().name,
    },
    userId,
  });
}

/**
 * Sets the session for a specific user based on the provided request and user ID.
 *
 * @param {NextRequest} request - The request object containing the necessary information.
 * @param {string} userId - The unique identifier of the user.
 * @return {Promise<void>} A promise indicating the completion of the session setting process.
 */
export async function setSession(request: NextRequest, userId: string): Promise<void> {
  const session = await generateSession(request, userId);
  const authRequest = auth.handleRequest(request.method, context);
  await auth.deleteDeadUserSessions(userId);
  authRequest.setSession(session);
}

interface ISessionExtended extends ISession {
  user: IUser;
}

/**
 * Retrieves the session information for the given request.
 *
 * @param {NextRequest} request - the request object
 * @return {Promise<ISessionExtended>} the extended session information
 */
export async function getSession(request: NextRequest): Promise<ISessionExtended> {
  const authRequest = auth.handleRequest(request.method, context);
  const session = await authRequest.validate();

  if (!session) {
    throw UnauthorizedError;
  }
  return session;
}
