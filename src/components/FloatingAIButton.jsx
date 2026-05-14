import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const FloatingAIButton = () => {
  return (
    <Link
      to="/ai-chat"
      className="fixed bottom-6 right-6 z-50"
    >

      <div className="relative group">

        {/* PING EFFECT */}

        <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30"></div>

        {/* BUTTON */}

        <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300">

          <Sparkles className="w-8 h-8" />
        </div>

        {/* TOOLTIP */}

        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">

          Ask AI Tour
        </div>
      </div>
    </Link>
  );
};

export default FloatingAIButton;