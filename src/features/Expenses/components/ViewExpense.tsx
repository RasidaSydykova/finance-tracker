import React from 'react';
import ModalWindow from '@/components/ModalWindow/ModalWindow';
import { IExpensesData, TExpensesData } from '@/types';
import { currencyFormatter } from '@/utils';
import { FaRegTrashAlt } from 'react-icons/fa';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface Props {
  show: boolean;
  onClose: (status: boolean) => void;
  expense: IExpensesData;
  setExpenses: React.Dispatch<React.SetStateAction<IExpensesData[]>>;
}

const ViewExpense: React.FC<Props> = ({ show, onClose, expense, setExpenses }) => {
  const deleteExpenseItem = async (expenseCategoryId: string, updatedExpense: IExpensesData) => {
    try {
      const docExpenses = doc(db, 'expenses', expenseCategoryId);

      await updateDoc(docExpenses, { ...updatedExpense });

      setExpenses((prevState: IExpensesData[]) => {
        const updatedExpenses: IExpensesData[] = [...prevState];

        const foundIndex = updatedExpenses.findIndex((expense) => expense.id === expenseCategoryId);

        updatedExpenses[foundIndex].items = [...updatedExpense.items];
        updatedExpenses[foundIndex].total = updatedExpense.total;

        return updatedExpenses;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteExpense = async (item: TExpensesData) => {
    try {
      const updatedItems: TExpensesData[] = expense.items.filter((i) => i.id !== item.id);

      const updatedExpense: IExpensesData = {
        ...expense,
        total: expense.total - item.amount,
        items: [...updatedItems],
      };

      await deleteExpenseItem(expense.id, updatedExpense);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteExpenseCategory = async (expenseCategoryId: string) => {
    try {
      const docRef = doc(db, 'expenses', expenseCategoryId);
      await deleteDoc(docRef);

      setExpenses((prevExpenses: IExpensesData[]) => {
        const updatedExpenses: IExpensesData[] = prevExpenses.filter(
          (expense) => expense.id !== expenseCategoryId,
        );

        return [...updatedExpenses];
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteCategory = async () => {
    try {
      await deleteExpenseCategory(expense.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ModalWindow show={show} onClose={onClose}>
        <div className="flex items-center justify-between">
          <h2 className="text-4xl capitalize">{expense.title}</h2>
          <button className="btn btn-danger" onClick={deleteCategory}>
            Delete
          </button>
        </div>
        <div>
          <h3 className="my-4 text-2xl">Expense History</h3>
          {expense.items.map((item) => {
            return (
              <div key={item.id} className="flex items-center justify-between">
                <small>{item.createdAt}</small>
                <p className="flex items-center gap-2">{currencyFormatter(item.amount)}</p>
                <button
                  onClick={() => {
                    deleteExpense(item);
                  }}
                >
                  {' '}
                  <FaRegTrashAlt />
                </button>
              </div>
            );
          })}
        </div>
      </ModalWindow>
    </>
  );
};

export default ViewExpense;
