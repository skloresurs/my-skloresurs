import Server from './Server';
import IUser1C from './User1CData';

export default interface IManaderOrder {
  id: string;
  server: Server;

  responsible: IUser1C | null;
  manager: IUser1C | null;
  agent: IUser1C | null;
  contact: IUser1C | null;

  createdAt: string;
  shipmentAt: string;

  status: string;
  location: string;

  locked: boolean;
  lockedComment: string;

  finance?: {
    bill: string;
    total: number;
    pay: number;
    final: number;
    currency: string;
  };
}

export interface IGoods {
  position: number;
  name: string;
  width: number;
  height: number;
  amount: number;
  pieces: number;
  in: number;
  out: number;
}

export interface IAgent {
  id: string;
  name: string;
  orders: number;
}
