import type PersonData from "../1c/User";
import type Message from "./Message";

type Project = {
  id: string;
  manager: PersonData;
  agent: PersonData;
  title: string;
  description: string;
  comment: string;
  messageCount: number;
  date: string;
  status: string;
};

type ProjectData = {
  id: string;
  title: string;
  description: string;
  messages: Message[];
};

export default Project;
export type { ProjectData };
