import React from 'react';
import { Compass, ArrowRight, Sparkles, MapPin, Star } from 'lucide-react';
import { ASSET_IMAGES } from '../data/cityData';
import { CityProfile } from '../types';
import { sfx } from '../services/soundFx';

interface HiddenSideProps {
  currentCity: CityProfile;
  onDiscoverPlace: (coords: [number, number], placeName: string) => void;
}

interface CuratedCard {
  id: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  secretIntel: string;
  imageUrl: string;
  coordinates: [number, number];
  timing: string;
  rating: number;
}

export const HiddenSide: React.FC<HiddenSideProps> = ({
  currentCity,
  onDiscoverPlace,
}) => {
  const CARDS: CuratedCard[] = [
    {
      id: 'hs-1',
      category: 'Heritage & Ancient Lore',
      title: 'Midnight Citadel & Delhi Gate Bastion',
      tagline: '18th-century stone archways with cybernetic night illumination',
      description: 'Towering teak bastions with authentic iron elephant spikes, illuminated by ambient cyan ground-uplights and quiet moonlit courtyards.',
      secretIntel: 'Enter right at dusk to witness the stone reflections on the ancient fountain moat.',
      imageUrl: ASSET_IMAGES.heritage,
      coordinates: [18.5196, 73.8553],
      timing: '06:00 PM – 09:00 PM',
      rating: 4.9
    },
    {
      id: 'hs-2',
      category: 'Secret Food & Laneway Culture',
      title: 'Neon Steam Laneway & Legacy Irani Bakeries',
      tagline: 'Authentic double-boiled chai and crisp buttery bun maska',
      description: 'A subterranean labyrinth of bustling artisan street kitchens, wood-fired bakeries, and steaming tea cauldrons away from tourist thoroughfares.',
      secretIntel: 'Ask for the secret berry soda and hand-crushed mawa cake behind the wooden billing counter.',
      imageUrl: ASSET_IMAGES.lanewayFood,
      coordinates: [18.5246, 73.8398],
      timing: '07:00 AM – 11:30 PM',
      rating: 4.8
    },
    {
      id: 'hs-3',
      category: 'Zen Sanctuaries & Biophilia',
      title: 'Biophilic Vertical Forest & Water Garden',
      tagline: 'A silent green lung nestled within the high-density metropolis',
      description: 'Multi-tiered cascading living walls, native bamboo groves, and crystal-clear koi streams engineered for meditative acoustic solace.',
      secretIntel: 'The upper gallery has solar-powered acoustic benches with near-zero decibel street noise.',
      imageUrl: ASSET_IMAGES.zenGarden,
      coordinates: [18.5145, 73.8967],
      timing: '06:30 AM – 06:00 PM',
      rating: 4.9
    },
    {
      id: 'hs-4',
      category: 'High-Altitude Viewpoints',
      title: 'Vetal Ridge Cyber-Observation Skydeck',
      tagline: 'Panoramic 360-degree overlook across the illuminated urban basin',
      description: 'The highest natural summit of the metropolis offering unobstructed horizon vistas, cool hilltop drafts, and sunset photography perches.',
      secretIntel: 'Take the eastern quarry trail 20 minutes before twilight for violet atmospheric gradients.',
      imageUrl: ASSET_IMAGES.skyDeck,
      coordinates: [18.5284, 73.8189],
      timing: '05:30 AM – 07:30 PM',
      rating: 4.9
    }
  ];

  return (
    <section id="hidden-side" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-500/15">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>UNSEEN METROPOLIS ARCHIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore Your City's Hidden Side
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Curated secret sanctuaries, twilight bastions, and subterranean culinary alleys in {currentCity.name}.
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-300">
          Curated by City AI Mesh · Verified Locations
        </span>
      </div>

      {/* Cinematic Bento Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CARDS.map((card) => (
          <div
            key={card.id}
            className="group relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-cyan-500/20 hover:border-cyan-400 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
          >
            {/* Cinematic Image Background */}
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.75] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Scrims for perfect legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors" />

            {/* Content Container */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
              
              {/* Top Unboxed Metadata */}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-cyan-300 font-semibold tracking-wide uppercase">
                    {card.category}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300 font-mono">{card.timing}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{card.rating}</span>
                </div>
              </div>

              {/* Bottom Card Copy & Hover Reveal */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-cyan-100/90 font-medium mt-1">
                  {card.tagline}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-2 group-hover:line-clamp-none transition-all">
                  {card.description}
                </p>

                {/* Secret Intel Snippet */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-xs text-slate-200 backdrop-blur-md">
                  <span className="text-cyan-300 font-semibold">Insider Secret: </span>
                  <span>{card.secretIntel}</span>
                </div>

                {/* Discover Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Coordinates Verified</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      sfx.playSuccess();
                      onDiscoverPlace(card.coordinates, card.title);
                    }}
                    className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                  >
                    <span>Discover on Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
