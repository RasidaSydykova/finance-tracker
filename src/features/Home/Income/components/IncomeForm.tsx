import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '@/firebaseConfig';
import Income from '@/features/Home/Income/Income';
import { IIncomeData, IIncomeDataMutation} from '@/types';

interface Props {
  income: IIncomeData[];
  setIncome: React.Dispatch<React.SetStateAction<IIncomeData[]>>;
}
const initialState: IIncomeDataMutation = {
  amount: '',
  description: '',
  createdAt: '',
};
const IncomeForm: React.FC<Props> = ({ income, setIncome }) => {
  const [state, setState] = useState<IIncomeDataMutation>(initialState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const onIncomeFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newIncome: IIncomeDataMutation = {
      ...state,
      createdAt: new Date().toISOString(),
    };

    if (!state.amount || !state.description) {
      toast.error('Please fill in all fields!.');
      return;
    }

    const collectionIncome = collection(db, 'income');

    try {
      const docSnap = await addDoc(collectionIncome, {
        ...newIncome,
        amount: parseFloat(newIncome.amount),
      });

      setIncome((prevState) => [
        ...prevState,
        {
          id: docSnap.id,
          ...newIncome,
          amount: parseFloat(newIncome.amount),
        },
      ]);

      setState(initialState);
      toast.success('Income added successfully!');
    } catch (error) {
      console.error('Firestore Error:', error);
      toast.error(`Firestore Error: ${error}`);
    }
  };

  return (
    <>
      <form className="input-group px-5" onSubmit={onIncomeFormSubmit}>
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
