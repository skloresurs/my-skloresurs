import PersonData from '../1c/User';

type Finance = {
  bill: string;
  total: number;
  pay: number;
  final: number;
  currency: string;
};

type Goods = {
  position: number;
  name: string;
  width: number;
  height: number;
  amount: number;
  pieces: number;
  in: number;
  out: number;
};

type Order = {
  id: string;
  agent: PersonData;
  shipmentAt: string;
  status: string;
  location: string;
  locked: boolean;
  finance?: Finance;
};
type FullOrder = Order & {
  responsible: PersonData;
  manager: PersonData;
  createdAt: string;
  lockedComment: string;
  contact: PersonData;
  goods: Goods[];
};

export type { FullOrder, Order };
