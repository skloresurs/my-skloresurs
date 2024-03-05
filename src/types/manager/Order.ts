import PersonData from '../1c/User';
import Finance from './Finance';
import Goods from './Goods';

/**
 * Represents an order.
 * @property {string} id - The ID of the order.
 * @property {PersonData} agent - The agent associated with the order.
 * @property {string} shipmentAt - The shipment date of the order.
 * @property {string} status - The status of the order.
 * @property {string} location - The location of the order.
 * @property {boolean} locked - Indicates if the order is locked.
 * @property {Finance} [finance] - The financial details of the order.
 */
type Order = {
  id: string;
  agent: PersonData;
  shipmentAt: string;
  status: string;
  location: string;
  locked: boolean;
  finance?: Finance;
};

/**
 * Represents a full order with additional information.
 * @property {PersonData} responsible - The person responsible for the order.
 * @property {PersonData} manager - The manager associated with the order.
 * @property {string} createdAt - The creation date of the order.
 * @property {string} lockedComment - The comment when the order is locked.
 * @property {PersonData} contact - The contact person associated with the order.
 * @property {Goods[]} goods - The goods associated with the order.
 */
type FullOrder = Order & {
  responsible: PersonData;
  manager: PersonData;
  createdAt: string;
  lockedComment: string;
  contact: PersonData;
  goods: Goods[];
};

export type { FullOrder, Order };
