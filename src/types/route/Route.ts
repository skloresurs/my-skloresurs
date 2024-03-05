import PersonData from '../1c/User';
import Pyramid from './Pyramid';
import RouteData from './RouteData';
import Task from './Task';

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
