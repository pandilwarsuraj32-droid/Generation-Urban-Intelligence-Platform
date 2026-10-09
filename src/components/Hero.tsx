import React, { useState } from 'react';
import { Search, Sparkles, Compass, Bot, ArrowRight, Activity, MapPin } from 'lucide-react';
import { ASSET_IMAGES, PROMPT_CHIPS, CITIES } from '../data/cityData';
import { sfx } from '../services/soundFx';
import { CityId } from '../types';

interface HeroProps {
  currentCityId: CityId;
  onSelectCity: (id: CityId) => void;
  onTriggerSearch: (query: string) => void;
  onExploreMap: () => void;
  onMeetCopilot: () => void;
  reducedMotion: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  currentCityId,
  onSelectCity,
  onTriggerSearch,
  onExploreMap,
  onMeetCopilot,
  reducedMotion,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const currentCity = CITIES.find((c) => c.id === currentCityId) || CITIES[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    sfx.playSuccess();
    onTriggerSearch(searchInput.trim());
  };

  const handleChipClick = (chipText: string) => {
    sfx.playClick();
    setSearchInput(chipText);
    onTriggerSearch(chipText);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-cyan-500/15">
      {/* 60-70% Cinematic Visual Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSET_IMAGES.hero}
          alt="Cinematic Futuristic Smart City Skyline at Twilight"
          className={`w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] ${
            reducedMotion ? '' : 'scale-105 transition-transform duration-1000'
          }`}
          referrerPolicy="no-referrer"
        />
        {/* Measured scrims & glowing data overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070e] via-[#05070e]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070e]/80 via-transparent to-[#05070e]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />

        {/* Subtle grid line overlay */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:4rem_4rem]"
        />
      </div>

      {/* Top Telemetry Strip */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 px-4 rounded-xl bg-slate-900/60 backdrop-blur-md border border-cyan-500/20 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-cyan-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart City Mesh</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 font-mono tabular-nums">
              {currentCity.activeSensors.toLocaleString()} active nodes
            </span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="hidden sm:inline text-slate-300 font-mono tabular-nums">
              AQI {currentCity.aqi} ({currentCity.weather.condition})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Active Metropolis:</span>
            <select
              value={currentCityId}
              onChange={(e) => {
                sfx.playClick();
                onSelectCity(e.target.value as CityId);
              }}
              className="bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-md border border-cyan-500/30 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.name} ({c.country})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Hero Centerpiece Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col items-center text-center">
        {/* Subtle kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-medium mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Urban Intelligence Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 uppercase [text-wrap:balance]">
          Your City.{' '}
          <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            Reimagined by AI.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-normal">
          Discover hidden places. Understand urban life. Navigate your world intelligently.
        </p>

        {/* Large Floating AI Search Panel */}
        <div className="w-full max-w-3xl mb-8">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-cyan-400/30 shadow-[0_15px_50px_-10px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.2)] focus-within:border-cyan-400 transition-all p-2 group"
          >
            <div className="pl-3 pr-2 text-cyan-400">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Ask anything about your city… (e.g. peaceful sunset spots, ₹500 budget quest)"
              className="w-full bg-transparent text-white text-sm sm:text-base placeholder-slate-400 px-2 py-3 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Ask AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Example prompt chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Try prompts:</span>
            {PROMPT_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-xs text-slate-300 hover:text-cyan-300 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/40 rounded-lg px-3 py-1.5 transition-all backdrop-blur-sm cursor-pointer whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onExploreMap();
            }}
            className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore the City</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onMeetCopilot();
            }}
            className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-white font-semibold text-sm flex items-center gap-2 border border-cyan-500/30 hover:border-cyan-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all transform active:scale-95 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Meet Your AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Bottom City Status Indicator strip */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-slate-300 font-medium">Telemetry Online:</span>
            <span>{currentCity.name} Live Pulse Mesh</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 font-mono tabular-nums">Sensors Verified 100%</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>GRID: LAT {currentCity.center[0]}° N</span>
            <span>LNG {currentCity.center[1]}° E</span>
            <span className="text-cyan-400">SYSTEM STABLE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
