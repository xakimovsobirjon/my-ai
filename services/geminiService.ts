import { GoogleGenAI, Type } from "@google/genai";
import { CulturalInsight, ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

// Schema for structured output
const insightSchema = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: "A comprehensive, helpful, and intelligent response to the user's question. Can be code, explanation, creative writing, or conversation.",
    },
    detectedLanguage: {
      type: Type.STRING,
      description: "The name of the language detected from the user's input.",
    },
    englishTranslation: {
      type: Type.STRING,
      description: "If the input is non-English, provide the English translation. If the input is ALREADY English, provide a 3-5 word summary or 'Key Topic' of the query.",
    },
    culturalNote: {
      type: Type.STRING,
      description: "A 'Did you know?' fact, a technical 'Pro Tip' (if coding), a historical context, or a deeper insight related to the topic. Do not limit this to culture; make it relevant to the specific query (Math, Science, Tech, etc.).",
    },
    sentiment: {
      type: Type.STRING,
      enum: ["positive", "neutral", "negative"],
      description: "The sentiment of the user's message.",
    },
    suggestedResponses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 short follow-up questions or responses the user might want to ask next.",
    },
  },
  required: ["reply", "detectedLanguage", "englishTranslation", "culturalNote", "sentiment", "suggestedResponses"],
};

export const sendMessageToGemini = async (history: ChatMessage[], message: string): Promise<{ reply: string, insight: CulturalInsight }> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  try {
    // Format history for Gemini
    const contents = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    // Add the current new message to the conversation
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: "You are Salom AI, a powerful, versatile, and intelligent AI assistant powered by Google Gemini. You can help with ANY task: coding, mathematics, creative writing, analysis, translation, or general conversation. Your goal is to provide accurate and helpful answers. Use the 'culturalNote' field to provide extra value: for coding questions, give a best practice tip; for history, give a date or context; for general chat, give a fun fact.",
        responseMimeType: "application/json",
        responseSchema: insightSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(jsonText);

    return {
      reply: data.reply,
      insight: {
        detectedLanguage: data.detectedLanguage,
        englishTranslation: data.englishTranslation,
        culturalNote: data.culturalNote,
        sentiment: data.sentiment as 'positive' | 'neutral' | 'negative',
        suggestedResponses: data.suggestedResponses,
      },
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};