import type PersonData from "../1c/User";

type Message = {
  id: string;
  date: string;
  manager: PersonData;
  agent: PersonData;
  notificationDate: string;
  comment: string;
  status: string;
};

export default Message;
