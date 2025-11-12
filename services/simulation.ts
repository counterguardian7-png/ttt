
import { SimulationParameters, WaveformPoint, SimulationResult } from '../types';

/**
 * Runs the impulse voltage simulation.
 * The output voltage of a Marx generator can be modeled by a double-exponential function:
 * V(t) = V_peak * k * (e^(-alpha*t) - e^(-beta*t))
 * This function calculates the parameters alpha and beta from the circuit components,
 * generates the waveform data, and calculates key metrics like front time and tail time.
 */
export const runImpulseSimulation = (params: SimulationParameters) => {
  // Convert units to base SI units for calculation
  const Vc = params.chargingVoltage * 1e3; // V
  const n = params.stages;
  const C1_series = (params.stageCapacitance * 1e-9) / n; // F
  const C2 = params.loadCapacitance * 1e-12; // F
  const R1 = params.frontResistor; // Ohm
  const R2 = params.tailResistor; // Ohm

  if (C1_series <= 0 || C2 <= 0 || R1 <= 0 || R2 <= 0) {
      throw new Error("Component values must be positive.");
  }

  // Calculate alpha and beta, the roots of the characteristic equation of the equivalent RLC circuit
  const a = 1 / (R1 * C2) + 1 / (R2 * C1_series);
  const b = 1 / (R1 * R2 * C1_series * C2);

  const radical = a * a - 4 * b;
  if (radical < 0) {
      throw new Error("Oscillatory circuit detected. Parameters result in a non-standard impulse. Please increase resistance or decrease capacitance.");
  }
  
  const sqrtRadical = Math.sqrt(radical);
  
  const beta = (a + sqrtRadical) / 2;
  const alpha = (a - sqrtRadical) / 2;

  if (alpha >= beta) {
      throw new Error("Invalid waveform parameters (alpha >= beta). Check component values.");
  }

  const V0 = Vc * n;
  const V_peak_factor = V0 / (R1 * C2 * (beta - alpha));

  const t_peak = (1 / (beta - alpha)) * Math.log(beta / alpha);
  const v_peak_value = V_peak_factor * (Math.exp(-alpha * t_peak) - Math.exp(-beta * t_peak));

  const waveform: WaveformPoint[] = [];
  const time_end_us = Math.max(200, 10 * (1/alpha) * 1e6); // simulate for a sufficiently long time
  const time_step_us = time_end_us / 2000;

  let t10 = -1, t90 = -1, t50_tail = -1;
  let found_t10 = false, found_t90 = false, found_t50_tail = false;

  for (let t_us = 0; t_us <= time_end_us; t_us += time_step_us) {
    const t_s = t_us * 1e-6;
    const voltage_v = V_peak_factor * (Math.exp(-alpha * t_s) - Math.exp(-beta * t_s));
    const voltage_kv = voltage_v / 1000;
    waveform.push({ time: t_us, voltage: voltage_kv });

    // Find key time points for T1 and T2 calculation
    if (voltage_v >= 0.1 * v_peak_value && !found_t10) {
        t10 = t_us;
        found_t10 = true;
    }
    if (voltage_v >= 0.9 * v_peak_value && !found_t90) {
        t90 = t_us;
        found_t90 = true;
    }
    if (t_s > t_peak && voltage_v <= 0.5 * v_peak_value && !found_t50_tail) {
        t50_tail = t_us;
        found_t50_tail = true;
    }
  }

  // IEC 60060-1 standard definition for lightning impulse front time
  const frontTime = (t90 > 0 && t10 > 0) ? 1.25 * (t90 - t10) : 0;
  // Tail time is time from virtual origin (approx 0) to 50% peak on the tail
  const tailTime = t50_tail > 0 ? t50_tail : 0;

  const result: SimulationResult = {
    peakVoltage: v_peak_value / 1000, // in kV
    frontTime: frontTime,
    tailTime: tailTime,
  };

  return { waveform, result };
};
