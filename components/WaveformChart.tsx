
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WaveformPoint } from '../types';

interface WaveformChartProps {
  data: WaveformPoint[];
  peakVoltage: number;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800/80 backdrop-blur-sm p-3 border border-gray-600 rounded-lg shadow-lg">
                <p className="label text-gray-300">{`Time: ${label.toFixed(2)} µs`}</p>
                <p className="intro text-cyan-400">{`Voltage: ${payload[0].value.toFixed(2)} kV`}</p>
            </div>
        );
    }
    return null;
};

const WaveformChart: React.FC<WaveformChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
        <XAxis 
            dataKey="time" 
            type="number"
            domain={['dataMin', 'dataMax']}
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            label={{ value: 'Time (µs)', position: 'insideBottom', offset: -15, fill: '#cbd5e0' }}
        />
        <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            label={{ value: 'Voltage (kV)', angle: -90, position: 'insideLeft', offset: -10, fill: '#cbd5e0' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: '#e5e7eb', paddingTop: '20px' }} />
        <Line 
            type="monotone" 
            dataKey="voltage" 
            name="Impulse Voltage"
            stroke="#2dd4bf" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#2dd4bf', stroke: '#ffffff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WaveformChart;
