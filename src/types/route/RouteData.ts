import PersonData from '../1c/User';

type RouteData = {
  id: number;
  orderId: string;
  order: number;
  time: string;
  pieces: number;
  amount: number;
  weight: number;
  address: string;
  addressShort: string;
  maxKength: number;
  agent?: PersonData;
  manager?: PersonData;
  contact: string;
  engineer?: PersonData;
  comments: {
    main: string;
    logist?: string;
    delivery?: string;
    packer?: string;
  };
};

export default RouteData;
