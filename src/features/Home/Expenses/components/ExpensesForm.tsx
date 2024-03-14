import React, { useState } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import { db } from '@/firebaseConfig';
import { IExpensesData, IExpensesDataMutation } from '@/types';

interface Props {
  expenses: IExpensesData[];
  setExpenses: React.Dispatch<React.SetStateAction<IExpensesData[]>>;
  onClose: (status: boolean) => void;
}

const initialState: IExpensesDataMutation = {
  color: '#000000',
  title: '',
  total: '',
  items: [
    {
      id: '',
      amount: '',
      createdAt: '',
    },
  ],
};

const ExpensesForm: React.FC<Props> = ({ expenses, setExpenses, onClose }) => {
  const [state, setState] = useState<IExpensesDataMutation>(initialState);
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
    const docExpense = doc(db, 'expenses', expenseCategoryId);

    try {
      await updateDoc(docExpense, {
        ...newExpense,
        total: parseFloat(newExpense.total) + parseFloat(state.items[0].amount),
        items: newExpense.items.map((item) => ({
          ...item,
          createdAt: item.createdAt,
          amount: parseFloat(item.amount),
        })),
      });

      setExpenses((prevState) => {
        const updateExpenses = [...prevState];

        const foundIndex = updateExpenses.findIndex((expense) => {
          return expense.id === expenseCategoryId;
        });

        updateExpenses[foundIndex] = {
          id: expenseCategoryId,
          ...newExpense,
          total: parseFloat(newExpense.total) + parseFloat(state.items[0].amount),
          items: newExpense.items.map((item) => ({
            ...item,
            createdAt: item.createdAt,
            amount: parseFloat(item.amount),
          })),
        };

        return updateExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  const addExpenseItem = async () => {
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
            id: nanoid(),
          },
        ],
      };

      if (selectedCategory) {
        try {
          await updateExpenseItem(selectedCategory, newExpenses);
          setState(initialState);
          setSelectedCategory(null);
          onClose(false);
          toast.success('Expense item added! ');
        } catch (error) {
          console.log('Firestore Error:', error);
          toast.error(`Firestore Error: ${error}`);
        }
      }
    }
  };

  const addCategory = async () => {
    if (!state.title) {
      toast.error('Please fill in title field!.');
      return;
    }

    try {
      const collectionExpenses = collection(db, 'expenses');

      const newCategory: IExpensesDataMutation = {
        ...state,
        total: '0',
        items: [],
      };

      const newExpenseDocSnap = await addDoc(collectionExpenses, {
        ...newCategory,
        total: parseFloat('0'),
      });

      setExpenses((prevState) => [
        ...prevState,
        {
          id: newExpenseDocSnap.id,
          ...newCategory,
          total: parseFloat(newCategory.total),
          items: [],
        },
      ]);

      setShowAddExpense(false);
      toast.success('Category created!');
    } catch (error) {
      console.log('Firestore Error:', error);
      toast.error(`Firestore Error: ${error}`);
    }
  };

  return (
    <>
      <div className="input-group px-5">
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
        />
      </div>

      {parseFloat(state.items[0].amount) > 0 && (
        <div
          className="flex flex-col gap-4 mt-6 px-5 py-2"
          style={{ maxHeight: '500px', overflowY: 'auto' }}
        >
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
              />

              <label htmlFor="color">Pick Color</label>
              <input
                className="w-24 h-10"
                id="color"
                type="color"
                name="color"
                value={state.color}
                onChange={onChangeCategory}
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
        <div className="px-5">
          <button type="submit" className="btn btn-primary mt-6" onClick={addExpenseItem}>
            Add Expense
          </button>
        </div>
      )}
    </>
  );
};

export default ExpensesForm;
