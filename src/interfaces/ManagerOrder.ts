export default interface IManaderOrder {
  id: string;

  responsible: string;
  manadger: string;
  agent: string;

  createdAt: string;
  shipmentAt: string;

  status: string;
  location: string;
  bill: string;

  locked: boolean;

  total: number;
  pay: number;
  final: number;
  currency: string;

  goods: IGoods[];
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
