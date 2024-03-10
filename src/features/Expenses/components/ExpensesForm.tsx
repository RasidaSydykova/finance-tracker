import React, { useState } from 'react';
import { IExpensesData, IExpensesDataMutation } from '@/types';
import { uuidv4 } from '@firebase/util';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface Props {
  expenses: IExpensesData[];
  setExpenses: React.Dispatch<React.SetStateAction<IExpensesData[]>>;
  onClose: (status: boolean) => void;
}
const ExpensesForm: React.FC<Props> = ({ expenses, setExpenses, onClose }) => {
  const [state, setState] = useState<IExpensesDataMutation>({
    color: '',
    title: '',
    total: '',
    items: [
      {
        id: '',
        amount: '',
        createdAt: '',
      },
    ],
  });

  const [selectedCategory, setSelectedCategory] = useState<null | string>(null);
  const [showAddExpense, setShowAddExpense] = useState<boolean>(false);

  const onChangeExpenseAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState((prevState) => {
      return {
        ...prevState,
        items: [
          {
            ...prevState.items[0],
            [name]: value,
          },
        ],
      };
    });
  };

  const onChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const updateExpenseItem = async (
    expenseCategoryId: string,
    newExpense: IExpensesDataMutation,
  ) => {
    const docRef = doc(db, 'expenses', expenseCategoryId);

    try {
      await updateDoc(docRef, {
        ...newExpense,
        total: parseFloat(newExpense.total) + parseFloat(state.items[0].amount),
        items: newExpense.items.map((item) => ({
          ...item,
          createdAt: item.createdAt,
          amount: parseFloat(item.amount),
        })),
      });

      setExpenses((prevState) => {
        const updatedExpenses = [...prevState];

        const foundIndex = updatedExpenses.findIndex((expense) => expense.id === expenseCategoryId);

        updatedExpenses[foundIndex] = {
          id: expenseCategoryId,
          ...newExpense,
          total: parseFloat(newExpense.total) + parseFloat(state.items[0].amount),
          items: newExpense.items.map((item) => ({
            ...item,
            createdAt: item.createdAt,
            amount: parseFloat(item.amount),
          })),
        };

        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  const addExpense = async () => {
    const expenseItem: IExpensesData | undefined = expenses.find((expense) => {
      return expense.id === selectedCategory;
    });

    if (expenseItem) {
      const newExpenses: IExpensesDataMutation = {
        color: expenseItem.color,
        title: expenseItem.title,
        total: expenseItem.total.toString(),
        items: [
          ...expenseItem.items.map((item) => ({
            ...item,
            amount: item.amount.toString(),
            createdAt: item.createdAt,
          })),
          {
            amount: state.items[0].amount,
            createdAt: new Date().toISOString(),
            id: uuidv4(),
          },
        ],
      };

      if (selectedCategory) {
        try {
          await updateExpenseItem(selectedCategory, newExpenses);
          setState({
            color: '',
            title: '',
            total: '',
            items: [{ id: '', amount: '', createdAt: '' }],
          });
          setSelectedCategory(null);
          onClose(false);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const addCategory = async () => {
    try {
      const collectionExpenses = collection(db, 'expenses');

      const newCategory: IExpensesDataMutation = {
        ...state,
        total: '0',
        items: [],
      };

      const docSnap = await addDoc(collectionExpenses, {
        ...newCategory,
      });

      setExpenses((prevState) => [
        ...prevState,
        {
          id: docSnap.id,
          ...newCategory,
          total: parseFloat(newCategory.total),
          items: [],
        },
      ]);

      setShowAddExpense(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="input-group">
        <label htmlFor="amount">Expenses Amount</label>
        <input
          id="amount"
          type="number"
          name="amount"
          min={0.01}
          step={0.01}
          placeholder="Enter expenses amount"
          value={state.items[0].amount}
          onChange={onChangeExpenseAmount}
          required
        />
      </div>

      {parseFloat(state.items[0].amount) > 0 && (
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="capitalize text-2xl">Select expense category</h3>
            <button
              className="text-lime-400"
              onClick={() => {
                setShowAddExpense(true);
              }}
            >
              + New Category
            </button>
          </div>

          {showAddExpense && (
            <div className="flex items-center justify-between">
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Enter Title"
                value={state.title}
                onChange={onChangeCategory}
                required
              />

              <label htmlFor="color">Pick Color</label>
              <input
                className="w-24 h-10"
                id="color"
                type="color"
                name="color"
                value={state.color}
                onChange={onChangeCategory}
                required
              />
              <button className="btn btn-primary-outline" onClick={addCategory}>
                Create
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setShowAddExpense(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
          {expenses.map((expense) => {
            return (
              <button
                key={expense.id}
                onClick={() => {
                  setSelectedCategory(expense.id);
                }}
              >
                <div
                  className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl"
                  style={{ boxShadow: expense.id === selectedCategory ? '1px 1px 4px' : 'none' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-[25px] h-[25px] rounded-full"
                      style={{ backgroundColor: expense.color }}
                    />
                    <h4 className="capitalize">{expense.title}</h4>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {parseFloat(state.items[0].amount) > 0 && (
        <button type="submit" className="btn btn-primary mt-6" onClick={addExpense}>
          Add Expense
        </button>
      )}
    </>
  );
};

export default ExpensesForm;
