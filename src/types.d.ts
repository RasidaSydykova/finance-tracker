export interface IExpensesData {
  id: string;
  color: string;
  title: string;
  total: number;
  items: TExpensesData[];
}

export interface TExpensesData {
  id: string;
  amount: number;
  createdAt: string;
}

export interface IExpensesDataMutation {
  color: string;
  title: string;
  total: string;
  items: TExpensesDataMutation[];
}

export interface TExpensesDataMutation {
  id: string;
  amount: string;
  createdAt: string;
}

export interface IIncomeData {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface IIncomeDataMutation {
  amount: string;
  description: string;
  createdAt: string;
}

export interface IUser {
  uid: string;
  displayName: string;
  photoURL: string;
}
