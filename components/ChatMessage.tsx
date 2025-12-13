import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { Bot, User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'model';
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[95%] md:max-w-[85%] gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${isBot ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col min-w-0">
           <div
            className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm overflow-hidden ${
              isBot
                ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                : 'bg-indigo-600 text-white rounded-tr-none'
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Styling code blocks
                code({node, inline, className, children, ...props}: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  
                  if (!inline) {
                    // Unique ID for copy state
                    const codeIndex = node?.position?.start?.line || Math.random();

                    return (
                      <div className="relative my-4 rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                           <span className="text-xs font-mono text-slate-400 lowercase">{match ? match[1] : 'code'}</span>
                           <button 
                              onClick={() => handleCopyCode(codeString, codeIndex)}
                              className="text-slate-400 hover:text-white transition-colors"
                              title="Copy code"
                           >
                              {copiedIndex === codeIndex ? <Check size={14} /> : <Copy size={14} />}
                           </button>
                        </div>
                        <div className="overflow-x-auto p-4">
                          <code className="text-sm font-mono text-slate-200 whitespace-pre" {...props}>
                            {children}
                          </code>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <code className={`${isBot ? 'bg-slate-100 text-indigo-600' : 'bg-indigo-700 text-indigo-100'} px-1.5 py-0.5 rounded text-[13px] font-mono`} {...props}>
                      {children}
                    </code>
                  );
                },
                // Styling other markdown elements
                p: ({children}) => <p className="mb-3 last:mb-0 break-words">{children}</p>,
                ul: ({children}) => <ul className="list-disc ml-4 mb-3 space-y-1">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal ml-4 mb-3 space-y-1">{children}</ol>,
                li: ({children}) => <li className="pl-1">{children}</li>,
                h1: ({children}) => <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-md font-bold mb-2 mt-3">{children}</h3>,
                blockquote: ({children}) => (
                   <blockquote className="border-l-4 border-indigo-300 pl-4 py-1 my-3 bg-slate-50 italic text-slate-600 rounded-r">
                      {children}
                   </blockquote>
                ),
                a: ({href, children}) => (
                    <a href={href} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                        {children}
                    </a>
                ),
                table: ({children}) => <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-slate-200 border border-slate-200">{children}</table></div>,
                thead: ({children}) => <thead className="bg-slate-50">{children}</thead>,
                th: ({children}) => <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b">{children}</th>,
                td: ({children}) => <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600 border-b">{children}</td>,
              }}
            >
              {message.text}
            </ReactMarkdown>
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