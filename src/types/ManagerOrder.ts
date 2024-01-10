import Server from './Server';

export default interface IManaderOrder {
  id: string;
  server: Server;

  responsible: string;
  manager: string;
  agent: string;

  createdAt: string;
  shipmentAt: string;

  status: string;
  location: string;

  locked: boolean;

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
