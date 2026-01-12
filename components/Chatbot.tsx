import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

interface ChatbotProps {
  onLeadCapture?: (info: { name?: string; interest?: string }) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onLeadCapture }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', sender: 'bot', text: 'Hello! I\'m Lumi. How can I help you achieve your wellness goals today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessageStream({ message: input });
      
      let botResponseText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      // Add empty bot message placeholder
      setMessages(prev => [...prev, { id: botMsgId, sender: 'bot', text: '' }]);

      for await (const chunk of response) {
         const c = chunk as GenerateContentResponse;
         if (c.text) {
             botResponseText += c.text;
             setMessages(prev => 
               prev.map(msg => msg.id === botMsgId ? { ...msg, text: botResponseText } : msg)
             );
         }
      }

      // Simple heuristic for lead capture (in a real app, use function calling)
      if (input.toLowerCase().includes('booking') || input.toLowerCase().includes('appointment')) {
          onLeadCapture?.({ interest: 'General Inquiry (Chat)' });
      }

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: "I'm having trouble connecting right now. Please call our office directly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-custom hover:scale-105 flex items-center justify-center ${
          isOpen ? 'bg-slate-200 text-slate-800 rotate-90' : 'bg-teal-600 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
        {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3 animate-pop-in">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-scale-in font-sans">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 flex items-center justify-between text-white animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-1.5 rounded-full animate-pop-in">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Lumi Assistant</h3>
                <p className="text-xs text-teal-100 opacity-90">Online • Typically replies instantly</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-slate-50 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed transition-custom ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex items-center space-x-2">
                   <Loader2 size={16} className="animate-spin text-teal-500" />
                   <span className="text-xs text-slate-400">Lumi is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 animate-fade-in">
            <div className="flex items-center bg-slate-50 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-custom">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about treatments..."
                className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 transition-custom"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="ml-2 text-teal-600 hover:text-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-custom"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};