export default interface IUser {
  id: string;
  email: string;
  fullname?: string;
  account_type: AccountType;
  permissions: Permission[];
  id_1c_main?: string;
  id_1c_secondary?: string;
}

export type Permission =
  | 'SuperAdmin'
  | 'Admin'
  | 'Manager'
  | 'ManagerAllOrders'
  | 'ManagerFinance'
  | 'Driver';

type AccountType = 'Default' | 'Google';
