import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from './services/geminiService';
import { ChatMessage as ChatMessageType, CulturalInsight } from './types';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import InsightPanel from './components/InsightPanel';
import { Sparkles, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [latestInsight, setLatestInsight] = useState<CulturalInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    // On mobile, keep sidebar closed until result comes back, then maybe show a hint?
    // Actually, on desktop we show it always. On mobile it's a drawer.

    try {
      const { reply, insight } = await sendMessageToGemini(text);

      const botMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setLatestInsight(insight);
      
      // If on mobile, maybe auto-open sidebar briefly or show a notification? 
      // For now, let's just update the state. User can open sidebar to see info.
      
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessageType = {
         id: Date.now().toString(),
         role: 'model',
         text: "I'm having trouble connecting to my linguistic database right now. Please try again.",
         timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar (Desktop: Static, Mobile: Drawer) */}
      <div 
        className={`fixed inset-y-0 right-0 z-30 w-80 bg-white border-l border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-96 shadow-xl lg:shadow-none ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-100">
                <span className="font-semibold text-slate-700">Context & Insights</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                    <X size={20} />
                </button>
            </div>
            <InsightPanel insight={latestInsight} isLoading={isLoading} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <Sparkles size={18} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Salom AI
            </h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-2 scroll-smooth">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-fade-in">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Salom! Hello! Bonjour!</h2>
                    <p className="text-slate-500 max-w-md text-lg leading-relaxed mb-8">
                        I am your cultural companion. Speak to me in any language, and I will help you understand not just the words, but the world behind them.
                    </p>
                    <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
                        <button onClick={() => handleSendMessage("Salom salom! Ishlar qalay?")} className="p-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-xl text-sm text-slate-600 transition-all text-left">
                            🇺🇿 Salom salom!
                        </button>
                         <button onClick={() => handleSendMessage("Hola, ¿cómo estás hoy?")} className="p-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-xl text-sm text-slate-600 transition-all text-left">
                            🇪🇸 Hola, ¿qué tal?
                        </button>
                         <button onClick={() => handleSendMessage("Kon'nichiwa, genki desu ka?")} className="p-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-xl text-sm text-slate-600 transition-all text-left">
                            🇯🇵 Kon'nichiwa
                        </button>
                         <button onClick={() => handleSendMessage("Marhaba! Kayf al-hal?")} className="p-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-xl text-sm text-slate-600 transition-all text-left">
                            🇸🇦 Marhaba
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto w-full pb-4">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex w-full mb-6 justify-start">
                             <div className="flex max-w-[75%] gap-3 flex-row">
                                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                                    <Sparkles size={18} className="animate-pulse" />
                                </div>
                                <div className="flex items-center space-x-1.5 px-4 py-3 bg-white rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                             </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            )}
        </div>

        {/* Input */}
        <div className="shrink-0 z-20">
            <InputArea 
                onSendMessage={handleSendMessage} 
                disabled={isLoading} 
                suggestions={latestInsight?.suggestedResponses}
            />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}
      </div>
    </div>
  );
};

export default App;