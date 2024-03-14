import React, { useCallback, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import ExpensesItem from '@/features/Home/Expenses/components/ExpensesItem';
import Stats from '@/features/Home/Stats/Stats';
import { IExpensesData, TExpensesData } from '@/types';

interface Props {
  expenses: IExpensesData[];
  setExpenses: React.Dispatch<React.SetStateAction<IExpensesData[]>>;
}
const Expenses: React.FC<Props> = ({ expenses, setExpenses }) => {
  const fetchData = useCallback(async () => {
    try {
      const collectionExpenses = collection(db, 'expenses');
      const docsSnap = await getDocs(collectionExpenses);

      const data: IExpensesData[] = docsSnap.docs.map((doc) => {
        return {
          id: doc.id,
          color: doc.data().color,
          title: doc.data().title,
          total: doc.data().total,
          items: doc.data().items.map((item: TExpensesData) => ({
            id: item.id,
            amount: item.amount,
            createdAt: item.createdAt,
          })),
        };
      });

      setExpenses(data);
    } catch (error) {
      console.error('Error fetching income data:', error);
    }
  }, [setExpenses]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <div>
      <h3 className="text-2xl">My Expenses</h3>
      {expenses.length > 0 ? (
        <div>
          <div className="flex flex-col gap-4 mt-6">
            {expenses.map((item) => (
              <ExpensesItem key={item.id} expense={item} setExpenses={setExpenses} />
            ))}
          </div>
          <section className="py-6">
            <Stats data={expenses} />
          </section>
        </div>
      ) : (
        <div className="mt-4">
          <p>No expenses available! Add expense!</p>
        </div>
      )}
    </div>
  );
};

export default Expenses;
