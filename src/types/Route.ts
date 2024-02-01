export default interface IRoute {
  id: string;
  date: string;
  approved: boolean;
  completed: boolean;
  route: string;
  transport: string;
  driver: {
    name: string;
    tel: string | null;
  } | null;
  responsible: string;
  departure: string;
}

export interface IStation {
  id: number;
  orderId: string;
  order: number;
  time: string;
  agent: {
    name: string;
    tel: string | null;
  } | null;
  pieces: number;
  amount: number;
  weight: number;
  manager: {
    name: string;
    tel: string | null;
  } | null;
  address: string;
  addressShort: string;
  maxLength: number;
  comments: {
    main: string;
    logist: string;
    delivery: string;
    packer: string;
  };
}

export interface IPyramid {
  id: string;
  agent: string;
  address: string;
  tel: string;
  manager: string;
}

export interface ITask {
  id: string;
  description: string;
  manager: string;
}
