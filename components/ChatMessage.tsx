import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'model';

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isBot ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col">
           <div
            className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
              isBot
                ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                : 'bg-indigo-600 text-white rounded-tr-none'
            }`}
          >
            {message.text}
          </div>
          <span className={`text-[11px] text-slate-400 mt-1.5 ${isBot ? 'text-left' : 'text-right'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;