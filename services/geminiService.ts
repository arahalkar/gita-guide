import { GoogleGenAI, Type } from "@google/genai";

// Initialize the API client
// Note: In a real production app, ensure API_KEY is handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendGitaQuestion = async (question: string, history: {role: string, parts: {text: string}[]}[] = []) => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct system instruction that grounds the AI in the context of the app
    const systemInstruction = `
      You are a wise, friendly, and approachable guide for middle school and high school students learning about the Srimad Bhagavad Gita.
      
      Your goal is to answer their questions based on the teachings of the Gita. 
      - Keep your language simple, soothing, and easy to understand for teenagers.
      - Use analogies relevant to modern school life where appropriate, but maintain the dignity of the scripture.
      - Always refer to the source material (Gita chapters/verses) when possible.
      - Be succinct. Do not give overly long lectures. 
      - If a question is not about the Gita or moral/ethical dilemmas, politely guide them back to the topic of the Gita.
      - You have access to Google Search to find specific verse numbers or citations if you need to double-check.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history,
        {
          role: 'user',
          parts: [{ text: question }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }], // Enable grounding for citations
        temperature: 0.7,
      }
    });

    // Extract text
    const answer = response.text || "I apologize, I couldn't find an answer to that at the moment. Please try asking differently.";
    
    // Extract grounding chunks (URLs) if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const citations: string[] = [];
    
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        citations.push(chunk.web.uri);
      }
    });

    return {
      text: answer,
      citations: [...new Set(citations)] // unique citations
    };

  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw error;
  }
};