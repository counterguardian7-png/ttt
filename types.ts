
export interface SimulationParameters {
  stages: number;
  chargingVoltage: number; // in kV
  stageCapacitance: number; // in nF
  loadCapacitance: number; // in pF
  frontResistor: number; // in Ohm
  tailResistor: number; // in Ohm
}

export interface WaveformPoint {
  time: number; // in µs
  voltage: number; // in kV
}

export interface SimulationResult {
  peakVoltage: number; // in kV
  frontTime: number; // in µs
  tailTime: number; // in µs
}
