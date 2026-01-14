
import { GoogleGenAI } from "@google/genai";

/**
 * World-class service for interacting with Gemini AI.
 * Grounds responses in the context of the Bhagavad Gita for students.
 */
export const sendGitaQuestion = async (question: string, history: {role: string, parts: {text: string}[]}[] = []) => {
  try {
    // Initialize the AI client directly before use
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview for high speed and up-to-date grounding
    const modelName = 'gemini-3-flash-preview';
    
    const systemInstruction = `
      You are the official "Gita AI Assistant" — a wise, friendly, and encouraging mentor for students globally.
      
      Your goal is to provide guidance based on the Srimad Bhagavad Gita to help students (ages 12-18) navigate life's challenges.
      - Keep your tone positive, inclusive, and easy to understand.
      - Frame your answers around common student themes: concentration, handling stress, understanding duty (Dharma), and building character.
      - Refer to specific Gita chapters or core concepts to ground your wisdom.
      - Be succinct (under 150 words).
      - Use Google Search grounding to provide links to respected Gita sources or scholarly articles for further reading.
      - If a user expresses extreme distress, kindly advise them to speak with a trusted adult or professional in addition to seeking spiritual guidance.
    `;

    // Perform content generation
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        ...history,
        {
          role: 'user',
          parts: [{ text: question }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      }
    });

    const answer = response.text || "I'm reflecting on your question. Could you try asking in a slightly different way?";
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const citations: string[] = [];
    
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        citations.push(chunk.web.uri);
      }
    });

    return {
      text: answer,
      citations: [...new Set(citations)]
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
