import type PersonData from "../1c/User";
import type Pyramid from "./Pyramid";
import type RouteData from "./RouteData";
import type Task from "./Task";

type Route = {
  id: string;
  date: string;
  approved: boolean;
  completed: boolean;
  route: string;
  transport: string;
  departure: string;
};

type FullRoute = Route & {
  driver: PersonData;
  responsible: PersonData;
  routes: RouteData[];
  pyramids: Pyramid[];
  tasks: Task[];
};

export type { FullRoute, Route };
