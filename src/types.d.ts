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

