import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import dayjs from 'dayjs';
import { currencyFormatter } from '@/utils';
import { IIncomeData } from '@/types';

interface Props {
  data: IIncomeData;
  deleteIncomeFunction: (IncomeId: string) => void;
}

const IncomeItem: React.FC<Props> = ({ data, deleteIncomeFunction }) => {
  return (
    <div>
      <div>
        <p className="font-semibold capitalize">{data.description}</p>
        <small className="text-xs">{dayjs(data.createdAt).format('dddd DD MMMM YYYY HH:mm')}</small>
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
