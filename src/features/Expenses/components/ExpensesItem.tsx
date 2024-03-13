import React, { useState } from 'react';
import { IExpensesData } from '@/types';
import { currencyFormatter } from '@/utils';
import ViewExpense from '@/features/Expenses/components/ViewExpense';

interface Props {
  expense: IExpensesData;
  setExpenses: React.Dispatch<React.SetStateAction<IExpensesData[]>>;
}

const ExpensesItem: React.FC<Props> = ({ expense, setExpenses }) => {
  const [showViewExpenseModal, setShowViewExpenseModal] = useState<boolean>(false);

  return (
    <>
      <ViewExpense
        show={showViewExpenseModal}
        onClose={setShowViewExpenseModal}
        setExpenses={setExpenses}
        expense={expense}
      />
      <button
        onClick={() => {
          setShowViewExpenseModal(true);
        }}
      >
        <div className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl">
          <div className="flex items-center gap-2">
            <div
              className="w-[25px] h-[25px] rounded-full"
              style={{ backgroundColor: expense.color }}
            />
            <h4 className="capitalize">{expense.title}</h4>
          </div>
          <p>{currencyFormatter(expense.total)}</p>
        </div>
      </button>
    </>
  );
};

export default ExpensesItem;
