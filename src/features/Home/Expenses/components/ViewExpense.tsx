import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { db } from '@/firebaseConfig';
import { currencyFormatter } from '@/utils';
import ModalWindow from '@/components/ModalWindow/ModalWindow';
import { IExpensesData, TExpensesData } from '@/types';

interface Props {
  show: boolean;
  onClose: (status: boolean) => void;
  expense: IExpensesData;
  setExpenses: React.Dispatch<React.SetStateAction<IExpensesData[]>>;
}

const ViewExpense: React.FC<Props> = ({ show, onClose, expense, setExpenses }) => {
  const updateExpenseItem = async (expenseCategoryId: string, updatedExpense: IExpensesData) => {
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

  const deleteExpenseItem = async (item: TExpensesData) => {
    try {
      const updateItems: TExpensesData[] = expense.items.filter((i) => i.id !== item.id);

      const updateExpense: IExpensesData = {
        ...expense,
        total: expense.total - item.amount,
        items: [...updateItems],
      };

      await updateExpenseItem(expense.id, updateExpense);
      toast.success('Expense item deleted successfully!');
    } catch (error) {
      console.log('Error deleting expense item:', error);
      toast.error(`Error deleting expense item: ${error}`);
    }
  };

  const deleteExpenseCategory = async (expenseCategoryId: string) => {
    try {
      const docExpense = doc(db, 'expenses', expenseCategoryId);
      await deleteDoc(docExpense);

      setExpenses((prevExpenses: IExpensesData[]) => {
        const updateExpenses: IExpensesData[] = prevExpenses.filter(
          (expense) => expense.id !== expenseCategoryId,
        );

        return [...updateExpenses];
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteCategory = async () => {
    try {
      await deleteExpenseCategory(expense.id);
      toast.success('Expense category deleted successfully!');
    } catch (error) {
      console.log(error);
      toast.error(`Error deleting expense category: ${error}`);
    }
  };

  return (
    <>
      <ModalWindow show={show} onClose={onClose}>
        <div className="flex items-center justify-between px-5">
          <h2 className="text-4xl capitalize">{expense.title}</h2>
          <button className="btn btn-danger" onClick={deleteCategory}>
            Delete
          </button>
        </div>
        <div style={{ maxHeight: '600px', overflowY: 'auto', marginTop: '20px' }}>
          <h3 className="mb-4 text-2xl px-5">Expense History</h3>
          {expense.items.map((item) => {
            return (
              <div key={item.id} className="flex items-center justify-between px-5">
                <small>{dayjs(item.createdAt).format('dddd DD MMMM YYYY HH:mm')}</small>
                <p className="flex items-center gap-2">{currencyFormatter(item.amount)}</p>
                <button
                  onClick={() => {
                    deleteExpenseItem(item);
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
