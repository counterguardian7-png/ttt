
import { GoogleGenAI } from "@google/genai";
import { SimulationParameters, SimulationResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // For this context, we assume it's set in the environment.
    console.warn("API_KEY environment variable not set. Gemini features will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const explainWaveform = async (params: SimulationParameters, result: SimulationResult): Promise<string> => {
    const { stages, chargingVoltage, stageCapacitance, loadCapacitance, frontResistor, tailResistor } = params;
    const { peakVoltage, frontTime, tailTime } = result;

    const prompt = `
    You are an expert in high-voltage engineering. Explain the results of a Marx impulse generator simulation in a clear and concise way for an engineering student.
    
    The simulation was run with the following parameters:
    - Number of Stages: ${stages}
    - Charging Voltage per Stage: ${chargingVoltage} kV
    - Stage Capacitance (per stage): ${stageCapacitance} nF
    - Load Capacitance: ${loadCapacitance} pF
    - Front Shaping Resistor (R1): ${frontResistor} Ω
    - Tail Shaping Resistor (R2): ${tailResistor} Ω
    
    The simulation produced the following waveform characteristics:
    - Peak Voltage: ${peakVoltage.toFixed(2)} kV
    - Front Time (T1): ${frontTime.toFixed(2)} µs
    - Tail Time (T2): ${tailTime.toFixed(2)} µs
    
    Based on these inputs and outputs, please provide an analysis covering:
    1.  A brief summary of the resulting waveform, comparing it to the standard lightning impulse (1.2/50 µs).
    2.  How the peak voltage relates to the total charging voltage (${stages * chargingVoltage} kV). Mention the concept of voltage efficiency.
    3.  The role of the front resistor (R1) and load capacitance (C2) in shaping the front time (T1).
    4.  The role of the tail resistor (R2) and the generator's series capacitance in shaping the tail time (T2).
    5.  A concluding remark on whether these parameters produce a standard or non-standard impulse waveform.
    
    Format the response clearly. Do not use markdown code blocks.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to communicate with the Gemini API. Please check your API key and network connection.");
    }
};
