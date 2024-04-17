/// <reference types="lucia" />

import type IUser from "./types/User";

declare namespace Lucia {
  type Auth = import("@/libs/lucia").Auth;
  type DatabaseUserAttributes = IUser;
  type DatabaseSessionAttributes = object;
}
