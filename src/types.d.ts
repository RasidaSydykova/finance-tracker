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
  createdAt: string | Date;
}

export interface IIncomeData {
  id: string;
  amount: number;
  description: string;
  createdAt: string | Date;
}

export interface IIncomeDataMutation {
  amount: string;
  description: string;
  createdAt: string;
}
