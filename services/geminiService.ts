import { GoogleGenAI, Type } from "@google/genai";
import { CulturalInsight } from "../types";

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
      description: "A natural, friendly, and conversational response to the user's input in the same language as the input.",
    },
    detectedLanguage: {
      type: Type.STRING,
      description: "The name of the language detected from the user's input.",
    },
    englishTranslation: {
      type: Type.STRING,
      description: "The English translation of the user's input.",
    },
    culturalNote: {
      type: Type.STRING,
      description: "A brief, interesting cultural fact related to the language, the specific greeting used, or the region where it is spoken.",
    },
    sentiment: {
      type: Type.STRING,
      enum: ["positive", "neutral", "negative"],
      description: "The sentiment of the user's message.",
    },
    suggestedResponses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 short suggested follow-up responses the user might want to say next (in the detected language).",
    },
  },
  required: ["reply", "detectedLanguage", "englishTranslation", "culturalNote", "sentiment", "suggestedResponses"],
};

export const sendMessageToGemini = async (message: string): Promise<{ reply: string, insight: CulturalInsight }> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: message,
      config: {
        systemInstruction: "You are Salom AI, a polite, knowledgeable, and multilingual cultural assistant. Your goal is to facilitate connection through language. When a user speaks to you, identify their language, translate it, provide a relevant cultural tidbit, and respond warmly. If the input is 'salomsalom', recognize it as a playful or emphatic Uzbek/Tajik greeting.",
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