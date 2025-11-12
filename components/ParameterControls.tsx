import React from 'react';
import { SimulationParameters } from '../types';

interface ParameterControlsProps {
  params: SimulationParameters;
  setParams: React.Dispatch<React.SetStateAction<SimulationParameters>>;
}

const ParameterInput: React.FC<{
    label: string;
    id: keyof SimulationParameters | string; // Allow string for custom IDs
    value: number;
    unit: string;
    onChange: (id: keyof SimulationParameters, value: number) => void;
    min: number;
    max: number;
    step: number;
}> = ({ label, id, value, unit, onChange, min, max, step }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-400">
            {label}
        </label>
        <div className="mt-1 flex items-center space-x-3">
            <input
                type="range"
                id={`${id}-slider`}
                name={`${id}-slider`}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(id as keyof SimulationParameters, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <input
                type="number"
                id={id}
                name={id}
                value={value}
                onChange={(e) => onChange(id as keyof SimulationParameters, parseFloat(e.target.value) || 0)}
                className="w-28 text-center bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <span className="text-gray-500 w-8">{unit}</span>
        </div>
    </div>
);

const ParameterControls: React.FC<ParameterControlsProps> = ({ params, setParams }) => {
  const handleChange = (id: keyof SimulationParameters, value: number) => {
    setParams(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-gray-100">Configuration</h2>
      <div className="space-y-6">
        <ParameterInput label="Number of Stages" id="stages" value={params.stages} unit="" onChange={handleChange} min={1} max={20} step={1} />
        <ParameterInput label="Charging Voltage" id="chargingVoltage" value={params.chargingVoltage} unit="kV" onChange={handleChange} min={10} max={500} step={10} />
        <ParameterInput label="Stage Capacitance" id="stageCapacitance" value={params.stageCapacitance} unit="nF" onChange={handleChange} min={10} max={2000} step={10} />
        <ParameterInput label="Load Capacitance" id="loadCapacitance" value={params.loadCapacitance} unit="pF" onChange={handleChange} min={100} max={10000} step={100} />
        <ParameterInput label="Front Resistor (R1)" id="frontResistor" value={params.frontResistor} unit="Ω" onChange={handleChange} min={1} max={500} step={1} />
        <ParameterInput 
            label="Tail Resistor (R2)" 
            id="tailResistor" 
            value={params.tailResistor / 1000} 
            unit="kΩ" 
            onChange={(_id, val) => handleChange('tailResistor', val * 1000)}
            min={1} 
            max={10} 
            step={0.1} 
        />
      </div>
      <div className="mt-8 text-center border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-500 italic">
          Waveform updates in real-time as you adjust parameters.
        </p>
      </div>
    </div>
  );
};

export default ParameterControls;