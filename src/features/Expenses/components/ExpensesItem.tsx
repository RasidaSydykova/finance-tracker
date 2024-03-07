import React from 'react';
import { IExpensesData } from '@/types';
import { currencyFormatter } from '@/utils';

interface Props {
  data: IExpensesData;
}

const ExpensesItem: React.FC<Props> = ({ data }) => {
  return (
    <button>
      <div className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl">
        <div className="flex items-center gap-2">
          <div className="w-[25px] h-[25px] rounded-full" style={{ backgroundColor: data.color }} />
          <h4 className="capitalize">{data.title}</h4>
        </div>
        <p>{currencyFormatter(data.total)}</p>
      </div>
    </button>
  );
};

export default ExpensesItem;
