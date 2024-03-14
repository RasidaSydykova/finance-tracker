import React, { useCallback, useEffect } from 'react';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '@/firebaseConfig';
import IncomeItem from '@/features/Home/Income/components/IncomeItem';
import { IIncomeData } from '@/types';

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
          createdAt: doc.data().createdAt,
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

  const deleteIncomeItem = async (IncomeId: string) => {
    const income = doc(db, 'income', IncomeId);
    try {
      await deleteDoc(income);
      setIncome((prevState) => {
        return prevState.filter((item) => item.id !== IncomeId);
      });

      toast.success('Income deleted successfully!');
    } catch (error) {
      console.error('Error deleting income data:', error);
      toast.error(`Error deleting income data: ${error}`);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 mt-6 px-5" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h3 className="text-2xl">Income History</h3>

        {income.map((item) => {
          return (
            <div className="flex item-center justify-between" key={item.id}>
              <IncomeItem data={item} deleteIncomeFunction={deleteIncomeItem} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Income;
