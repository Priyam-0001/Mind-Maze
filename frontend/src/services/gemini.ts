
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getIntelligentHint(questTitle: string, questContent: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user is participating in a puzzle competition called MindMaze 3.0. 
      The current puzzle is titled "${questTitle}".
      Puzzle Content: "${questContent}".
      Give a cryptic, mysterious, but helpful hint to lead them closer to the answer without giving it away directly. Keep it under 50 words.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The maze is dense... I cannot see clearly right now.";
  }
}
