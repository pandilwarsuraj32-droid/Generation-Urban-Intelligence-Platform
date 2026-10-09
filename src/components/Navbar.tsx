import React from 'react';
import { Volume2, VolumeX, Eye, BookmarkCheck } from 'lucide-react';
import { sfx } from '../services/soundFx';

interface NavbarProps {
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  savedPlansCount: number;
  onOpenSavedPlans: () => void;
  onOpenCopilot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMuted,
  setIsMuted,
  reducedMotion,
  setReducedMotion,
  savedPlansCount,
  onOpenSavedPlans,
  onOpenCopilot
}) => {
  const toggleAudio = () => {
    const next = !isMuted;
    setIsMuted(next);
    sfx.setMuted(next);
    if (!next) sfx.playClick();
  };

  const toggleMotion = () => {
    sfx.playClick();
    setReducedMotion(!reducedMotion);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#05070e]/85 border-b border-cyan-500/15 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#" 
          onClick={() => sfx.playClick()}
          className="text-lg md:text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 group"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-transform group-hover:scale-125" />
          <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
            CITYVERSE AI
          </span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-300">
          <a 
            href="#interactive-map" 
            onClick={() => sfx.playClick()}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Digital Map
          </a>
          <a 
            href="#city-explorer" 
            onClick={() => sfx.playClick()}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Explore Places
          </a>
          <a 
            href="#ai-copilot" 
            onClick={() => sfx.playClick()}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            AI Copilot
          </a>
          <a 
            href="#snap-city" 
            onClick={() => sfx.playClick()}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Snap & Report
          </a>
          <a 
            href="#city-pulse" 
            onClick={() => sfx.playClick()}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            City Pulse
          </a>
        </nav>

        {/* Zone 3: 1 primary action + subtle accessibility toggles */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Audio toggle */}
          <button
            type="button"
            onClick={toggleAudio}
            title={isMuted ? 'Turn Sound FX On' : 'Mute Sound FX'}
            aria-label="Toggle Sound Effects"
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 border border-transparent hover:border-cyan-500/20 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Reduced motion toggle */}
          <button
            type="button"
            onClick={toggleMotion}
            title={reducedMotion ? 'Enable Full Motion' : 'Reduce Motion'}
            aria-label="Toggle Reduced Motion"
            className={`p-2 rounded-lg border transition-colors ${
              reducedMotion 
                ? 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30' 
                : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 border-transparent hover:border-cyan-500/20'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Saved items trigger */}
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onOpenSavedPlans();
            }}
            title="Saved Itineraries & Reports"
            className="relative p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 border border-transparent hover:border-cyan-500/20 transition-colors"
          >
            <BookmarkCheck className="w-4 h-4" />
            {savedPlansCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-black text-[10px] font-bold flex items-center justify-center font-mono">
                {savedPlansCount}
              </span>
            )}
          </button>

          {/* 1 Primary Action */}
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onOpenCopilot();
            }}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all transform active:scale-95 whitespace-nowrap shrink-0"
          >
            Launch Copilot
          </button>
        </div>

      </div>
    </header>
  );
};
