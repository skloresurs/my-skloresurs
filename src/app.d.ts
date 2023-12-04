/// <reference types="lucia" />

import IUser from './interfaces/User';

declare namespace Lucia {
  type Auth = import('@/libs/lucia').Auth;
  type DatabaseUserAttributes = IUser;
  type DatabaseSessionAttributes = object;
}
