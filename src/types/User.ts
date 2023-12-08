import ISession from './Session';

export default interface IUser {
  id: string;
  email: string;
  fullname?: string;
  permissions: Permission[];
  id_1c_main?: string;
  id_1c_secondary?: string;
  ip: string[];
  google?: string;
  googleId?: string;
  facebook?: string;
  facebookId?: string;
  twitter?: string;
  twitterId?: string;
}

export interface IUserRequest extends IUser {
  sessions: ISession[];
}

export interface IUserMeRequest extends IUserRequest {
  thisSession: string;
}

export type Permission =
  | 'SuperAdmin'
  | 'Admin'
  | 'Manager'
  | 'ManagerAllOrders'
  | 'ManagerFinance'
  | 'Driver';
