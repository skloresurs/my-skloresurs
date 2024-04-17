import type PersonData from "../1c/User";

type Project = {
  id: string;
  responsible: PersonData;
  title: string;
  description: string;
  messagesCount: number;
};

export default Project;
