export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CulturalInsight {
  detectedLanguage: string;
  englishTranslation: string;
  culturalNote: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedResponses: string[];
}

export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  latestInsight: CulturalInsight | null;
  error: string | null;
}