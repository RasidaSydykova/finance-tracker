import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { IExpensesData } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: IExpensesData[];
}

const Stats: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <h3 className="text-2xl">Stats</h3>
      <div className="w-full mx-auto">
        <Doughnut
          data={{
            labels: data.map((item) => item.title),
            datasets: [
              {
                label: 'Expenses',
                data: data.map((item) => item.total),
                backgroundColor: data.map((item) => item.color),
                borderColor: ['#18181b'],
                borderWidth: 5,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
          }}
          width={400}
          height={400}
        />
      </div>
    </div>
  );
};

export default Stats;
