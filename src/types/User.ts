export default interface IUser {
  id: string;
  email: string;
  fullname?: string;
  permissions: Permission[];
  id_1c_main?: string;
  id_1c_secondary?: string;
  ip: string[];
  google?: string;
}

export type Permission =
  | 'SuperAdmin'
  | 'Admin'
  | 'Manager'
  | 'ManagerAllOrders'
  | 'ManagerFinance'
  | 'Driver';
