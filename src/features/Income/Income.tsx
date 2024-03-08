import React, { useCallback, useEffect } from 'react';
import { IIncomeData } from '@/types';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import IncomeItem from '@/features/Income/components/IncomeItem';

interface Props {
  income: IIncomeData[];
  setIncome: React.Dispatch<React.SetStateAction<IIncomeData[]>>;
}
const Income: React.FC<Props> = ({ income, setIncome }) => {
  const fetchData = useCallback(async () => {
    try {
      const collectionIncome = collection(db, 'income');
      const docsSnap = await getDocs(collectionIncome);

      const data: IIncomeData[] = docsSnap.docs.map((doc) => {
        return {
          id: doc.id,
          amount: doc.data().amount,
          description: doc.data().description,
          createdAt: new Date(doc.data().createdAt),
        };
      });

      setIncome(data);
    } catch (error) {
      console.error('Error fetching income data:', error);
    }
  }, [setIncome]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const deleteIncome = async (IncomeId: string) => {
    const income = doc(db, 'income', IncomeId);
    try {
      await deleteDoc(income);
      setIncome((prevState) => {
        return prevState.filter((item) => item.id !== IncomeId);
      });
    } catch (error) {
      console.error('Error deleting income data:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 mt-6">
        <h3 className="text-2xl font-bold">Income History</h3>

        {income.map((item) => {
          return (
            <div className="flex items-center justify-between" key={item.id}>
              <IncomeItem data={item} deleteIncomeFunction={deleteIncome} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Income;
