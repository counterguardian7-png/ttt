
import React from 'react';
import { SimulationResult } from '../types';

interface ResultsDisplayProps {
  result: SimulationResult;
}

const isStandard = (value: number, target: number, tolerance: number = 0.3) => {
    return Math.abs(value - target) / target <= tolerance;
};

const ResultCard: React.FC<{ title: string; value: string; unit: string; standard?: { target: number; currentValue: number; tolerance?: number } }> = ({ title, value, unit, standard }) => {
    let statusClasses = 'bg-gray-700 text-gray-300';
    if (standard) {
        statusClasses = isStandard(standard.currentValue, standard.target, standard.tolerance) ?
            'bg-green-800/50 text-green-300' : 'bg-yellow-800/50 text-yellow-300';
    }

    return (
        <div className="bg-gray-900/50 rounded-lg p-4 flex flex-col justify-between border border-gray-700">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <div className="flex items-baseline">
                <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
                <p className="ml-2 text-lg text-gray-400">{unit}</p>
            </div>
            {standard && <p className={`mt-2 text-xs font-mono px-2 py-1 rounded-md self-start ${statusClasses}`}>Std: {standard.target} {unit}</p>}
        </div>
    );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <ResultCard
        title="Peak Voltage"
        value={result.peakVoltage.toFixed(2)}
        unit="kV"
      />
      <ResultCard
        title="Front Time (T1)"
        value={result.frontTime.toFixed(2)}
        unit="µs"
        standard={{ target: 1.2, currentValue: result.frontTime }}
      />
      <ResultCard
        title="Tail Time (T2)"
        value={result.tailTime.toFixed(2)}
        unit="µs"
        standard={{ target: 50, currentValue: result.tailTime }}
      />
    </div>
  );
};

export default ResultsDisplay;
