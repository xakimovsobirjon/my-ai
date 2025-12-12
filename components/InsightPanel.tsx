import React from 'react';
import { CulturalInsight } from '../types';
import { Globe, Languages, Quote, Info } from 'lucide-react';

interface InsightPanelProps {
  insight: CulturalInsight | null;
  isLoading: boolean;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ insight, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 p-8 space-y-4 animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
        <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
        <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <Globe size={40} className="text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Ready to Explore</h3>
        <p className="text-sm leading-relaxed max-w-xs mx-auto">
          Start a conversation in any language. I'll detect it, translate it, and share interesting cultural facts!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Languages size={24} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">{insight.detectedLanguage}</h2>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Detected Language</p>
        </div>
      </div>

      {/* Translation Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full opacity-50 -mr-8 -mt-8"></div>
         <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
            <Quote size={12} className="mr-1.5" /> Translation
         </h3>
         <p className="text-xl text-slate-800 font-serif italic">"{insight.englishTranslation}"</p>
      </div>

      {/* Cultural Fact Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Globe size={64} />
        </div>
        <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3 flex items-center">
          <Info size={12} className="mr-1.5" /> Cultural Insight
        </h3>
        <p className="text-sm leading-relaxed text-slate-200 font-light">
          {insight.culturalNote}
        </p>
      </div>

      {/* Sentiment Indicator */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
        <span className="text-sm font-medium text-slate-600">Tone Analysis</span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
          insight.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
          insight.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {insight.sentiment}
        </span>
      </div>
    </div>
  );
};

export default InsightPanel;