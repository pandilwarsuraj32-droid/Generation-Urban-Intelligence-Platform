import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  MapPin, 
  Clock, 
  IndianRupee, 
  BookmarkCheck, 
  Navigation, 
  Share2, 
  Check, 
  Compass,
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { CityProfile, CopilotItinerary, CopilotStop } from '../types';
import { sfx } from '../services/soundFx';
import { ASSET_IMAGES, PROMPT_CHIPS } from '../data/cityData';

interface AiCopilotProps {
  currentCity: CityProfile;
  onShowRouteOnMap: (coords: [number, number][]) => void;
  onSaveItinerary: (itinerary: CopilotItinerary) => void;
  initialQuery?: string;
}

export const AiCopilot: React.FC<AiCopilotProps> = ({
  currentCity,
  onShowRouteOnMap,
  onSaveItinerary,
  initialQuery = '',
}) => {
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [selectedBudget, setSelectedBudget] = useState<number>(500);
  const [selectedVibe, setSelectedVibe] = useState<string>('Cyber-Heritage');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active generated or loaded itinerary
  const [currentItinerary, setCurrentItinerary] = useState<CopilotItinerary>({
    id: 'it-default',
    title: `${currentCity.name} Under-₹500 Cyber & Heritage Odyssey`,
    city: currentCity.name,
    overview: `A curated route exploring ancient stone fortifications, subterranean transit marvels, and authentic back-alley tea houses with zero tourist tax.`,
    estimatedBudget: `₹460 / person`,
    vibes: ['Historical Lore', 'Transit Hacks', 'Culinary Secrets'],
    createdAt: 'Just now',
    stops: [
      {
        time: '09:00 AM',
        placeName: currentCity.name === 'Pune' ? 'Shaniwar Wada Bastion' : 'Historic Old Citadel',
        category: 'Heritage',
        description: 'Atmospheric morning stroll past 18th-century stone bastions, massive iron-spiked doors, and quiet fountain gardens.',
        estimatedCost: '₹50 entry ticket',
        coordinates: [18.5196, 73.8553],
        highlight: 'Morning golden-hour angle looking out of the Delhi Darwaza arch'
      },
      {
        time: '11:30 AM',
        placeName: currentCity.name === 'Pune' ? 'FC Road Legacy Irani Cafe' : 'Centenary Tea Roastery',
        category: 'Culinary',
        description: 'Tuck into double-boiled milky Irani chai, crusty butter-spread bun maska, and authentic berry sodas.',
        estimatedCost: '₹110',
        coordinates: [18.5246, 73.8398],
        highlight: 'Fresh hot bun maska dipped in steaming spiced chai'
      },
      {
        time: '03:45 PM',
        placeName: currentCity.name === 'Pune' ? 'Vetal Tekdi Summit' : 'High Altitude Observation Ridge',
        category: 'Nature & Views',
        description: 'Traverse an easy gravel walking trail up to the city’s highest natural viewpoint. Breezy, tranquil, and bird-rich.',
        estimatedCost: '₹0 (Free access)',
        coordinates: [18.5284, 73.8189],
        highlight: 'Panoramic view of the city basin transitioning to sunset colors'
      },
      {
        time: '06:30 PM',
        placeName: currentCity.name === 'Pune' ? 'JM Road Street Hawker Lane' : 'Artisan Street Food Strip',
        category: 'Night Food',
        description: 'Wind down your adventure tasting piping hot sabudana khichdi, garlic butter dosas, and mango mastani ice cream drink.',
        estimatedCost: '₹180',
        coordinates: [18.5230, 73.8488],
        highlight: 'Signature creamy Mastani ice cream dessert'
      }
    ],
    localTips: [
      'Take the electric underground Metro during afternoon peak hours to beat city congestion.',
      'Carry small change or scan municipal QR codes directly for street vendors.',
      'Wear sturdy walking sneakers for the cobblestone lanes and ridge paths.'
    ]
  });

  const handleGenerate = async (customPrompt?: string) => {
    const promptToRun = customPrompt || inputQuery;
    if (!promptToRun.trim() && !customPrompt) return;

    sfx.playScan();
    setIsGenerating(true);
    setSavedSuccess(false);

    // Multi-phase telemetry steps
    setGenerationStep('Synthesizing urban pedestrian mesh...');
    setTimeout(() => setGenerationStep(`Optimizing budget constraints for ₹${selectedBudget}...`), 600);
    setTimeout(() => setGenerationStep('Retrieving crowd density & micro-climate data...'), 1200);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: promptToRun,
          city: currentCity.name,
          budget: selectedBudget,
          vibe: selectedVibe
        })
      });

      const json = await response.json();
      if (json && json.data) {
        const generated: CopilotItinerary = {
          id: `it-${Date.now()}`,
          title: json.data.title || `${currentCity.name} AI Custom Itinerary`,
          city: currentCity.name,
          overview: json.data.overview || 'Custom generated urban route.',
          estimatedBudget: json.data.estimatedBudget || `Under ₹${selectedBudget}`,
          vibes: json.data.vibes || ['Smart Exploration', 'Local Culture'],
          stops: json.data.stops || currentItinerary.stops,
          localTips: json.data.localTips || ['Stay hydrated and enjoy the smart city!'],
          createdAt: 'Just now'
        };
        setCurrentItinerary(generated);
        sfx.playSuccess();
      }
    } catch (err) {
      console.warn('Copilot call error, keeping active blueprint:', err);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleShowRoute = () => {
    sfx.playClick();
    const coords = currentItinerary.stops.map((s) => s.coordinates);
    onShowRouteOnMap(coords);
    // Smooth scroll to map
    const mapEl = document.getElementById('interactive-map');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSave = () => {
    sfx.playSuccess();
    onSaveItinerary(currentItinerary);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleShare = () => {
    sfx.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `CITYVERSE AI Itinerary for ${currentItinerary.city}: ${currentItinerary.title} (Budget: ${currentItinerary.estimatedBudget})`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section id="ai-copilot" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>SIGNATURE INTELLIGENCE ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI City Copilot
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Your personal generative urban navigator. Formulates verified itineraries tailored to your budget and interests.
          </p>
        </div>

        {/* Budget Pill Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <span className="text-xs text-slate-400 px-2 font-mono">Budget:</span>
          {[300, 500, 1000, 2500].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => {
                sfx.playClick();
                setSelectedBudget(b);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer tabular-nums font-mono ${
                selectedBudget === b
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ₹{b}
            </button>
          ))}
        </div>
      </div>

      {/* Main Glass Panel Card */}
      <div className="relative rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.12)] p-6 sm:p-8">
        {/* Input Bar */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder={`Ask Copilot anything about ${currentCity.name}... (e.g. "Plan an evening budget date with rooftop views")`}
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500 rounded-xl px-4 py-3.5 text-sm outline-none transition-colors"
              />
            </div>
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerate()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-60 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Itinerary'}</span>
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[11px] text-slate-400">Try asking:</span>
            {PROMPT_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setInputQuery(chip);
                  handleGenerate(chip);
                }}
                className="text-xs text-slate-300 hover:text-cyan-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-md px-2.5 py-1 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Animated Thinking Indicator */}
        {isGenerating && (
          <div className="my-6 p-6 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex flex-col items-center justify-center text-center animate-pulse">
            <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-3" />
            <p className="text-cyan-300 font-mono text-sm tracking-wide">
              {generationStep || 'Consulting neural city model...'}
            </p>
            <span className="text-slate-500 text-xs mt-1">Cross-referencing live pedestrian density and micro-transit feeds</span>
          </div>
        )}

        {/* Generated Itinerary Card Showcase */}
        {!isGenerating && currentItinerary && (
          <div className="mt-4 pt-6 border-t border-slate-800/80">
            {/* Header Block */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="text-cyan-400 font-semibold">{currentItinerary.city} Adventure</span>
                  <span>·</span>
                  <span className="text-slate-300 font-mono">Estimated: {currentItinerary.estimatedBudget}</span>
                  <span>·</span>
                  <span>{currentItinerary.stops.length} Verified Stops</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentItinerary.title}
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  {currentItinerary.overview}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleShowRoute}
                  className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Show Route on Map</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Saved!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                      <span>Save Plan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  title="Share Itinerary"
                  className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Timeline Stops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {currentItinerary.stops.map((stop, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1 font-mono text-cyan-300 font-semibold">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{stop.time}</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-300">
                        {stop.estimatedCost}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {stop.placeName}
                    </h4>
                    
                    <span className="inline-block text-[10px] text-cyan-400 uppercase tracking-wider font-semibold my-1">
                      {stop.category}
                    </span>

                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      {stop.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-900 text-[11px] text-slate-400">
                    <span className="text-cyan-400 font-semibold">Highlight: </span>
                    <span>{stop.highlight}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Local Tips Strip */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300">
              <span className="font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                Verified Urban Navigation Tips:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {currentItinerary.localTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
