import React from 'react';
import { sfx } from '../services/soundFx';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#03050a] border-t border-cyan-500/15 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <span className="text-lg font-bold text-white tracking-tight">
              CITYVERSE AI
            </span>
          </div>
          <p className="text-xs sm:text-sm text-cyan-300 font-medium tracking-wide mt-1.5 uppercase">
            The City is Yours to Discover.
          </p>
          <p className="text-xs text-slate-300 mt-1 max-w-sm">
            Autonomous urban intelligence mesh blending spatial 3D data, generative itinerary copilots, and civic vision reporting.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
          <a
            href="#interactive-map"
            onClick={() => sfx.playClick()}
            className="hover:text-cyan-400 transition-colors"
          >
            Digital Map
          </a>
          <a
            href="#ai-copilot"
            onClick={() => sfx.playClick()}
            className="hover:text-cyan-400 transition-colors"
          >
            AI Copilot
          </a>
          <a
            href="#snap-city"
            onClick={() => sfx.playClick()}
            className="hover:text-cyan-400 transition-colors"
          >
            Snap the City
          </a>
          <a
            href="#city-pulse"
            onClick={() => sfx.playClick()}
            className="hover:text-cyan-400 transition-colors"
          >
            City Pulse
          </a>
          <a
            href="#hidden-side"
            onClick={() => sfx.playClick()}
            className="hover:text-cyan-400 transition-colors"
          >
            Hidden Gems
          </a>
        </div>

        {/* Copyright & Source Info */}
        <div className="text-center md:text-right text-xs text-slate-300 font-mono">
          <span>Smart City Data © 2026 CITYVERSE AI</span>
          <br />
          <span className="text-[11px] text-slate-300">OpenStreetMap · CartoDB · Gemini 2.5 Flash</span>
        </div>

      </div>
    </footer>
  );
};
