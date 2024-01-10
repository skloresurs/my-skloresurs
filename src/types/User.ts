import { permissionsEnum, userSchema } from '@/libs/db/schema';

import ISession from './Session';

type IUser = typeof userSchema.$inferSelect;

export interface IUserRequest extends IUser {
  sessions: ISession[];
}

export interface IUserMeRequest extends IUserRequest {
  thisSession: string;
}

export default IUser;
export type Permission = (typeof permissionsEnum.enumValues)[number];
