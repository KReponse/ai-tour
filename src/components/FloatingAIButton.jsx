import React from 'react';
import { Link } from 'react-router-dom';

import {
  Sparkles,
  ArrowUpRight,
  Bot,
} from 'lucide-react';

const FloatingAIButton = () => {
  return (
    <div className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-50">

      <Link
        to="/ai-chat"
        aria-label="Open AI Tour Assistant"
      >
        <div className="relative group">

          {/* OUTER GLOW */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 blur-3xl opacity-40 group-hover:opacity-80 transition-all duration-500 animate-pulse"></div>

          {/* PULSE RING */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping"></div>

          {/* MAIN BUTTON */}
          <div className="relative overflow-hidden flex items-center gap-3 rounded-full border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] px-4 py-3 md:px-5 md:py-4 transition-all duration-300 group-hover:scale-105 group-active:scale-95">

            {/* ANIMATED BACKGROUND */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">

              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10"></div>

              {/* SHINE EFFECT */}
              <div className="absolute top-0 left-[-120%] h-full w-[120%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[120%] transition-all duration-1000"></div>
            </div>

            {/* ICON */}
            <div className="relative flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-xl">

              <Bot className="w-7 h-7 text-white" />

              {/* LIVE DOT */}
              <div className="absolute bottom-1 right-1 flex h-3 w-3">

                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>

                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 border-2 border-white"></span>
              </div>
            </div>

            {/* TEXT */}
            <div className="hidden sm:block relative">

              <div className="flex items-center gap-2">

                <p className="text-white font-black text-sm tracking-wide">
                  AI Tour Assistant
                </p>

                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              </div>

              <p className="text-white/70 text-xs mt-0.5">
                Smart AI Travel Planner
              </p>
            </div>

            {/* ARROW */}
            <div className="hidden sm:flex items-center justify-center relative">

              <ArrowUpRight className="w-5 h-5 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>

          {/* TOOLTIP */}
          <div className="absolute bottom-24 right-0 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 pointer-events-none hidden md:block">

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl px-4 py-3 shadow-2xl">

              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"></div>

              <div className="relative flex items-center gap-2">

                <Sparkles className="w-4 h-4 text-cyan-300" />

                <span className="text-sm font-medium text-white whitespace-nowrap">
                  Plan trips with AI instantly
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE MINI LABEL */}
          <div className="sm:hidden absolute -top-12 right-0 bg-black text-white text-xs px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">

            AI Travel Assistant
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FloatingAIButton;