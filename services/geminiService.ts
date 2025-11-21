import { GoogleGenAI, Type } from "@google/genai";
import { Incident, SensorData } from "../types";

// Initialize Gemini
// Note: In a real production app, this should be proxied through a backend.
// For this demo, we assume the environment variable is set.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeRiskFromSensors = async (sensors: SensorData[], incidents: Incident[]): Promise<string> => {
  if (!apiKey) return "API Key missing. Unable to perform AI analysis.";

  try {
    const prompt = `
      Act as a National Disaster Command Center AI Analyst.
      Analyze the following sensor data and active incidents:
      
      Sensors: ${JSON.stringify(sensors)}
      Incidents: ${JSON.stringify(incidents)}
      
      Provide a concise strategic summary (max 3 sentences) focusing on immediate risks and recommended actions.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI Analysis unavailable due to connection error.";
  }
};

export const extractVictimFromID = async (imageBase64: string): Promise<any> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    // Schema for structured output
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64
            }
          },
          {
            text: "Extract the following details from this National ID card: Full Name, ID Number, Address. If a field is not visible, use empty string."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            nationalId: { type: Type.STRING },
            address: { type: Type.STRING },
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    throw new Error("Failed to extract data from ID.");
  }
};
