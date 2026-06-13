import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Bot, User, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatCompanionProps {
  currentMood?: string;
}

export const ChatCompanion: React.FC<ChatCompanionProps> = ({ currentMood }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: "Hi there! I'm MindMate, your empathetic companion. Whether you're stressed about mock tests or just need to vent, I'm here to support you. How is your study prep going today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // API call to backend AI chat endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mindmate_token') || ''}`
        },
        body: JSON.stringify({ message: userMessage.text, mood: currentMood || 'Neutral' })
      });

      if (!response.ok) {
        throw new Error('Chat API call failed');
      }

      const data = await response.json();
      const botResponse: Message = {
        id: Math.random().toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback message
      const errorResponse: Message = {
        id: Math.random().toString(),
        text: "I'm having a little trouble connecting right now, but remember: your worth is not defined by any subject score. Take a short breath—you're doing great!",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl glass-panel border-glassBorder flex flex-col h-[400px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-glassBorder/60 bg-glassBg/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-neonPurple" />
          <div>
            <h3 className="text-sm font-bold text-slate-200">Empathy Companion Chat</h3>
            <p className="text-[10px] text-slate-500">Live support with MindMate AI</p>
          </div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isBot = m.sender === 'bot';
          return (
            <div key={m.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex items-start space-x-2 max-w-[85%] ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                  isBot ? 'bg-purple-500/10 text-neonPurple border border-purple-500/20' : 'bg-cyan-500/10 text-neonBlue border border-cyan-500/20'
                }`}>
                  {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  isBot 
                    ? 'bg-glassBg border border-glassBorder text-slate-200 rounded-tl-none' 
                    : 'bg-gradient-to-r from-neonPurple/20 to-neonBlue/20 border border-neonPurple/20 text-slate-100 rounded-tr-none'
                }`}>
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/10 text-neonPurple border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-2xl bg-glassBg border border-glassBorder text-slate-400 rounded-tl-none flex items-center space-x-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-neonPurple" />
                <span className="text-[10px] italic">MindMate is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Form Input Footer */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-glassBorder/60 bg-glassBg/20 flex items-center space-x-2">
        <label htmlFor="chat-input" className="sr-only">Type your message here</label>
        <input
          id="chat-input"
          name="chat-input"
          type="text"
          placeholder="I'm feeling stressed about mock scores..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-slate-950/60 border border-glassBorder rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neonPurple/50"
          aria-required="true"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="p-2 rounded-xl bg-gradient-to-r from-neonPurple to-neonBlue text-white hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
