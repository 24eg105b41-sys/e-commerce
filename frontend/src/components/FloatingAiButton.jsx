import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const FloatingAiButton = () => {
  return (
    <Link
      to="/ai-assistant"
      title="Ask ShopSphere AI Assistant"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-campus-600 to-indigo-600 hover:from-campus-700 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
    >
      <Sparkles size={18} className="animate-spin duration-1000 group-hover:scale-110" />
      <span className="text-xs font-bold tracking-wide">Campus AI</span>
    </Link>
  );
};

export default FloatingAiButton;
