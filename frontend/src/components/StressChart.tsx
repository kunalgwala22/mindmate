import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StressTrendItem } from '../types';

interface StressChartProps {
  data: StressTrendItem[];
}

export const StressChart: React.FC<StressChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        Record your first journal to see stress trends.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={11}
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f0720',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
            formatter={((value: any, _name: any, props: any) => {
              const emotion = props.payload?.emotion ? ` (${props.payload.emotion})` : '';
              return [`${value}%${emotion}`, 'Stress Level'];
            }) as any}
          />
          <Area
            type="monotone"
            dataKey="stressScore"
            stroke="#a855f7"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#stressGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
