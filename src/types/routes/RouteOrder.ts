export default interface IRouteOrder {
  position: number;
  id: number;
  order: number;
  time: string;
  agent: string;
  pieces: number;
  amount: number;
  weight: number;
  manager: string;
  address: string;
  comments: {
    main?: string;
    logist?: string;
    delivery?: string;
    manager?: string;
    packer?: string;
  };
}
