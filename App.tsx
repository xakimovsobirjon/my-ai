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

    try {
      // Pass existing messages (history) + the new text to the service
      const { reply, insight } = await sendMessageToGemini(messages, text);

      const botMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setLatestInsight(insight);
      
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessageType = {
         id: Date.now().toString(),
         role: 'model',
         text: "I'm having trouble connecting to the network right now. Please try again.",
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
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Salom! How can I help?</h2>
                    <p className="text-slate-500 max-w-md text-lg leading-relaxed mb-8">
                        I am your intelligent assistant. Ask me to write code, translate languages, explain complex topics, or just have a friendly chat.
                    </p>
                    <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
                        <button onClick={() => handleSendMessage("Write a Javascript function to reverse a string.")} className="p-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-xl text-sm text-slate-600 transition-all text-left">
                            💻 Write Code
                        </button>
                         <button onClick={() => handleSendMessage("Explain Quantum Entanglement simply.")} className="p-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-xl text-sm text-slate-600 transition-all text-left">
                            🧠 Explain Science
                        </button>
                         <button onClick={() => handleSendMessage("Salom! Ishlar qalay?")} className="p-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-xl text-sm text-slate-600 transition-all text-left">
                            🇺🇿 Chat in Uzbek
                        </button>
                         <button onClick={() => handleSendMessage("Give me a recipe for Italian Pasta.")} className="p-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-xl text-sm text-slate-600 transition-all text-left">
                            🍝 Cooking Ideas
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