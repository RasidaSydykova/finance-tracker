import React, { useState } from 'react';
import { IIncomeData, IIncomeDataMutation } from '@/types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Income from '@/features/Income/Income';

interface Props {
  income: IIncomeData[];
  setIncome: React.Dispatch<React.SetStateAction<IIncomeData[]>>;
}
const IncomeForm: React.FC<Props> = ({ income, setIncome }) => {
  const [state, setState] = useState<IIncomeDataMutation>({
    amount: '',
    description: '',
    createdAt: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState((prevState) => {
      return {
        ...prevState,
        [name]: name === 'amount' ? parseFloat(value) : value,
      };
    });
  };

  const onIncomeFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newIncome: IIncomeDataMutation = {
      ...state,
      createdAt: new Date().toISOString(),
    };

    const collectionIncome = collection(db, 'income');

    try {
      const docSnap = await addDoc(collectionIncome, newIncome);
      setIncome((prevState) => [
        ...prevState,
        {
          id: docSnap.id,
          ...newIncome,
          amount: parseFloat(newIncome.amount),
        },
      ]);
      setState({
        amount: '',
        description: '',
        createdAt: '',
      });
    } catch (error) {
      console.error('Firestore Error:', error);
    }
  };

  return (
    <>
      <form className="input-group" onSubmit={onIncomeFormSubmit}>
        <div className="input-group">
          <label htmlFor="amount">Income Amount</label>
          <input
            id="amount"
            type="number"
            name="amount"
            min={0.01}
            step={0.01}
            placeholder="Enter income amount"
            value={state.amount}
            onChange={onChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            name="description"
            placeholder="Enter income description"
            value={state.description}
            onChange={onChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Income
        </button>
      </form>
      <Income income={income} setIncome={setIncome} />
    </>
  );
};

export default IncomeForm;
