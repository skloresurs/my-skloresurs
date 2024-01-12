export default interface IRoute {
  id: string;
  date: string;
  completed: boolean;
  route: string;
  transport: string;
  driver: string;
  responsible: string;
  departure: string;
}

export interface IStation {
  id: number;
  orderId: string;
  order: number;
  time: string;
  agent: string;
  pieces: number;
  amount: number;
  weight: number;
  manager: string;
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
