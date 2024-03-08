import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IIncomeData } from '@/types';
import { currencyFormatter } from '@/utils';
interface Props {
  data: IIncomeData;
  deleteIncomeFunction: (IncomeId: string) => void;
}

const IncomeItem: React.FC<Props> = ({ data, deleteIncomeFunction }) => {
  return (
    <div>
      <div>
        <p className="font-semibold">{data.description}</p>
        <small className="text-xs">{String(data.createdAt)}</small>
      </div>
      <p className="flex items-center gap-2">
        {currencyFormatter(data.amount)}
        <button
          onClick={() => {
            deleteIncomeFunction(data.id);
          }}
        >
          <FaRegTrashAlt />
        </button>
      </p>
    </div>
  );
};

export default IncomeItem;
