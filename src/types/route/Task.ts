import type PersonData from "../1c/User";

type Task = {
  id: string;
  description: string;
  manager?: PersonData;
  createAt: string;
  completed: boolean;
  important: boolean;
};

export default Task;
