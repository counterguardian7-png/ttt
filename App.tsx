import React, { useState, useCallback, useEffect } from 'react';
import { SimulationParameters, WaveformPoint, SimulationResult } from './types';
import { runImpulseSimulation } from './services/simulation';
import { explainWaveform } from './services/geminiService';
import Header from './components/Header';
import ParameterControls from './components/ParameterControls';
import ImpulseCircuitDiagram from './components/ImpulseCircuitDiagram';
import WaveformChart from './components/WaveformChart';
import ResultsDisplay from './components/ResultsDisplay';
import { BoltIcon, SparklesIcon, InformationCircleIcon } from './components/Icons';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParameters>({
    stages: 4,
    chargingVoltage: 100, // kV
    stageCapacitance: 500, // nF
    loadCapacitance: 2000, // pF
    frontResistor: 75, // Ohm
    tailResistor: 4000, // Ohm
  });

  const [simulation, setSimulation] = useState<{
    waveform: WaveformPoint[];
    result: SimulationResult;
  } | null>(null);

  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const simulationTimeout = setTimeout(() => {
      try {
        setError(null);
        setExplanation(null); // Clear previous explanation on param change
        const { waveform, result } = runImpulseSimulation(params);
        setSimulation({ waveform, result });
      } catch (e) {
        if (e instanceof Error) {
            setError(`Simulation failed: ${e.message}. Please adjust parameters.`);
        } else {
            setError('An unknown simulation error occurred.');
        }
        setSimulation(null); // Clear simulation view on error
      }
    }, 200); // Debounce simulation to avoid excessive re-renders while sliding

    return () => clearTimeout(simulationTimeout);
  }, [params]);


  const handleExplain = useCallback(async () => {
    if (!simulation) return;
    setIsExplaining(true);
    setError(null);
    try {
        const geminiResponse = await explainWaveform(params, simulation.result);
        setExplanation(geminiResponse);
    } catch (e) {
        if (e instanceof Error) {
            setError(`AI explanation failed: ${e.message}`);
        } else {
            setError('Failed to get explanation from AI.');
        }
    } finally {
        setIsExplaining(false);
    }
  }, [simulation, params]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-8">
            <ParameterControls params={params} setParams={setParams} />
            <ImpulseCircuitDiagram />
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8">
            <div className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 min-h-[600px] flex flex-col backdrop-blur-sm border border-gray-700">
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative animate-fade-in mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              {simulation ? (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold mb-4 text-gray-100">Simulation Output</h2>
                  <ResultsDisplay result={simulation.result} />
                  <div className="h-96 w-full mt-6">
                    <WaveformChart data={simulation.waveform} peakVoltage={simulation.result.peakVoltage} />
                  </div>
                  <div className="mt-8 text-center">
                     <button
                        onClick={handleExplain}
                        disabled={isExplaining}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:bg-indigo-900/50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isExplaining ? (
                          <>
                            <SparklesIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Analyzing...
                          </>
                      ) : (
                          <>
                            <SparklesIcon className="-ml-1 mr-3 h-5 w-5" />
                            Explain Waveform with Gemini AI
                          </>
                      )}
                    </button>
                  </div>
                  {isExplaining && (
                    <div className="mt-6 p-4 rounded-lg bg-gray-900/50 animate-pulse">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    </div>
                  )}
                  {explanation && (
                    <div className="mt-6 p-6 rounded-2xl bg-gray-900/70 border border-gray-700 animate-fade-in">
                      <h3 className="text-xl font-bold mb-3 text-indigo-400 flex items-center"><SparklesIcon className="h-6 w-6 mr-2"/> AI Analysis</h3>
                      <div className="prose prose-invert prose-p:text-gray-300 prose-strong:text-gray-100 whitespace-pre-wrap">{explanation}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-grow flex flex-col justify-center items-center text-center">
                  {error ? (
                    <>
                      <InformationCircleIcon className="h-12 w-12 text-yellow-500" />
                      <h3 className="mt-4 text-xl font-semibold text-gray-400">Invalid Parameters</h3>
                      <p className="mt-1 text-gray-500 max-w-md">
                        The current configuration resulted in an error. Please adjust the values on the left.
                      </p>
                    </>
                  ) : (
                    <>
                      <BoltIcon className="h-16 w-16 text-yellow-400 animate-pulse-fast" />
                      <p className="mt-4 text-lg font-semibold text-gray-400">Calculating Waveform...</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;