import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { EmotionDistItem } from '../types';

interface EmotionChartProps {
  data: EmotionDistItem[];
}

const COLORS = [
  '#a855f7', // Purple
  '#22d3ee', // Cyan
  '#f43f5e', // Rose
  '#fbbf24', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
];

export const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        Write your first journal to see emotional distributions.
      </div>
    );
  }

  return (
    <div className="h-72 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(10, 5, 22, 0.8)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f0720',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-slate-300 text-xs font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
