import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
  suggestions?: string[];
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled, suggestions = [] }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="border-t border-slate-200 bg-white p-4 pb-6">
      {suggestions.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center text-xs font-semibold text-indigo-500 uppercase tracking-wider mr-2 shrink-0">
            <Sparkles size={14} className="mr-1" />
            Try saying:
          </div>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(s)}
              disabled={disabled}
              className="shrink-0 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm rounded-full transition-colors border border-indigo-200 whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a greeting like 'Salom' or ask a question..."
          className="w-full bg-transparent border-none focus:ring-0 resize-none text-slate-800 placeholder:text-slate-400 py-3 px-3 min-h-[48px] max-h-[120px]"
          disabled={disabled}
          rows={1}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="mb-1 p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          <Send size={20} />
        </button>
      </form>
      <div className="text-center mt-2">
         <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash • Multilingual & Cultural Expert</p>
      </div>
    </div>
  );
};

export default InputArea;