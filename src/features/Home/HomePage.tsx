import React, { useEffect, useState } from 'react';
import ModalWindow from '@/components/ModalWindow/ModalWindow';
import IncomeForm from '@/features/Home/Income/components/IncomeForm';
import ExpensesForm from '@/features/Home/Expenses/components/ExpensesForm';
import { currencyFormatter } from '@/utils';
import Expenses from '@/features/Home/Expenses/Expenses';
import { IExpensesData, IIncomeData } from '@/types';

const HomePage = () => {
  const [showAddIncomeModal, setShowAddIncomeModal] = useState<boolean>(false);
  const [showAddExpensesModal, setShowAddExpensesModal] = useState<boolean>(false);

  const [income, setIncome] = useState<IIncomeData[]>([]);
  const [expenses, setExpenses] = useState<IExpensesData[]>([]);

  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const newBalance =
      income.reduce((total, i) => {
        return total + i.amount;
      }, 0) -
      expenses.reduce((total, e) => {
        return total + e.total;
      }, 0);

    setBalance(newBalance);
  }, [income, expenses]);
  return (
    <>
      <ModalWindow show={showAddIncomeModal} onClose={setShowAddIncomeModal}>
        <IncomeForm income={income} setIncome={setIncome} />
      </ModalWindow>

      <ModalWindow show={showAddExpensesModal} onClose={setShowAddExpensesModal}>
        <ExpensesForm
          expenses={expenses}
          setExpenses={setExpenses}
          onClose={setShowAddExpensesModal}
        />
      </ModalWindow>

      <main className="container max-w-6xl px-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-400 text-md">My balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(balance)}</h2>
        </section>

        <section className="flex items-center gap-2 py-3">
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddExpensesModal(true);
            }}
          >
            + Expenses
          </button>
          <button
            className="btn btn-primary-outline"
            onClick={() => {
              setShowAddIncomeModal(true);
            }}
          >
            + Income
          </button>
        </section>

        <section className="py-6">
          <Expenses expenses={expenses} setExpenses={setExpenses} />
        </section>
      </main>
    </>
  );
};

export default HomePage;
