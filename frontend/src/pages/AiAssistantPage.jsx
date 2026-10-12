import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, ShoppingCart, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import PriceDisplay from '../components/PriceDisplay';
import { Link } from 'react-router-dom';

const AiAssistantPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ASSISTANT',
      text: "Hello! I'm the ShopSphere Campus AI Assistant. Describe what you're looking for (e.g., your academic course, engineering laptop requirements, hostel study gear, or store policies), and I'll match verified items from our database.",
      products: [],
      citations: [],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const samplePrompts = [
    "I need a laptop for Java programming under ₹60,000",
    "Ergonomic mechanical keyboard for coding",
    "Noise cancelling headphones for library study",
    "What is the hostel return and refund policy?",
    "Prescribed algorithms textbook for AU-R24 CSE",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    if (!isAuthenticated) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'USER', text: query },
        {
          id: Date.now() + 1,
          sender: 'ASSISTANT',
          text: "Please log in to your student account to record conversations and receive personalized campus recommendations.",
          products: [],
          citations: [],
        },
      ]);
      setInputMessage('');
      return;
    }

    const userTurn = { id: Date.now(), sender: 'USER', text: query };
    setMessages((prev) => [...prev, userTurn]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/api/ai/chat', {
        sessionId: sessionId,
        message: query,
      });

      if (res.success && res.data) {
        setSessionId(res.data.sessionId);
        const assistantTurn = {
          id: Date.now() + 1,
          sender: 'ASSISTANT',
          text: res.data.answer,
          products: res.data.recommendedProducts || [],
          citations: res.data.policyCitations || [],
        };
        setMessages((prev) => [...prev, assistantTurn]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ASSISTANT',
          text: "Sorry, I had trouble processing that query: " + (err.message || 'Network error') + ". You can also browse items directly in the Catalog.",
          products: [],
          citations: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Architecture Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-campus-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              ShopSphere AI Assistant
              <span className="campus-badge bg-campus-50 text-campus-700 border border-campus-200 text-[10px]">
                Catalog Grounded
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Natural language shopping powered by real database catalog records and campus store policies
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Try asking:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-campus-50 text-slate-700 hover:text-campus-700 border border-slate-200 hover:border-campus-300 font-medium transition-all shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[560px] overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ASSISTANT' && (
                <div className="w-8 h-8 rounded-full bg-campus-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Bot size={18} />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'USER'
                    ? 'bg-campus-600 text-white rounded-br-none shadow-sm'
                    : 'bg-slate-50 border border-slate-200/60 text-slate-800 rounded-bl-none space-y-4'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Grounded Recommended Products Grid */}
                {msg.products && msg.products.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Matching Real Catalog Products:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.products.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                              />
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-campus-700">
                                  {p.brand}
                                </span>
                                <Link
                                  to={`/products/${p.slug || p.id}`}
                                  className="block font-bold text-slate-900 text-xs hover:text-campus-600 line-clamp-1"
                                >
                                  {p.name}
                                </Link>
                              </div>
                            </div>
                            <PriceDisplay amount={p.price} className="text-sm font-extrabold text-slate-900" />
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-emerald-600 font-bold">
                              {p.stockQuantity > 0 ? `In Stock (${p.stockQuantity})` : 'Out of Stock'}
                            </span>
                            <button
                              onClick={() => addToCart(p.id, 1)}
                              className="campus-btn-primary !py-1 !px-2.5 text-[10px] font-bold"
                            >
                              <ShoppingCart size={11} />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grounded Policy Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                    {msg.citations.map((cite, i) => (
                      <span
                        key={i}
                        className="campus-badge bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-mono"
                      >
                        {cite}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'USER' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm font-bold text-xs">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3.5 justify-start">
              <div className="w-8 h-8 rounded-full bg-campus-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
                <Bot size={18} />
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl rounded-bl-none p-3.5 text-xs text-slate-500 flex items-center gap-2">
                <Sparkles size={14} className="text-campus-600 animate-spin" />
                <span>Searching catalog and grounding recommendations...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Query Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Laptop with dedicated GPU under 55000', 'Study lamps for hostel')..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="campus-input bg-white text-xs"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="campus-btn-primary !px-4 !py-2.5 flex-shrink-0"
            >
              <Send size={15} />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
