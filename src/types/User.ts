/**
 * Represents a user object.
 */
import type { permissionsEnum, userSchema } from "@/libs/db/schema";

import type ISession from "./Session";

type IUser = typeof userSchema.$inferSelect;

/**
 * Interface for the user request.
 */
export interface IUserRequest extends IUser {
  sessions: ISession[];
}

/**
 * Interface for the current user request.
 */
export interface IUserMeRequest extends IUserRequest {
  thisSession: string;
}

export default IUser;

/**
 * Represents a permission type.
 */
export type Permission = (typeof permissionsEnum.enumValues)[number];
