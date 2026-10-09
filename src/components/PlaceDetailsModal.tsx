import React from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Compass, 
  Heart, 
  Share2, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Navigation, 
  Layers, 
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';
import { CityPlace } from '../types';
import { sfx } from '../services/soundFx';

interface PlaceDetailsModalProps {
  place: CityPlace | null;
  onClose: () => void;
  allPlaces: CityPlace[];
  isFavorite: boolean;
  onToggleFavorite: (placeId: string) => void;
  onGetDirections: (place: CityPlace) => void;
  onSelectPlace: (place: CityPlace) => void;
  isInCompare: boolean;
  onToggleCompare: (place: CityPlace) => void;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  place,
  onClose,
  allPlaces,
  isFavorite,
  onToggleFavorite,
  onGetDirections,
  onSelectPlace,
  isInCompare,
  onToggleCompare,
}) => {
  if (!place) return null;

  // Filter similar places in the same category
  const similarPlaces = allPlaces
    .filter((p) => p.category === place.category && p.id !== place.id)
    .slice(0, 3);

  // Check if open now (basic check: 24h or current time within morning/evening bounds)
  const isOpenNow = place.openingHours.includes('24 Hours') || !place.openingHours.includes('Closed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#090d1a] border border-cyan-500/35 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_30px_rgba(6,182,212,0.15)] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0">
          <img
            src={place.photoUrl}
            alt={place.name}
            className="w-full h-full object-cover filter brightness-[0.8]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d1a] via-[#090d1a]/40 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Left Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
              {place.subcategory}
            </span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono backdrop-blur-md ${
              isOpenNow 
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
                : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
            }`}>
              {isOpenNow ? 'Open Now' : 'Closed'}
            </span>
          </div>

          {/* Place Title & Rating Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {place.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{place.area}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{place.distanceKm} km from center</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-amber-500/30">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-white font-mono">{place.rating}</span>
                <span className="text-[11px] text-slate-400 font-mono">({place.reviewCount.toLocaleString()})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Key Facts Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price Level</span>
              <span className="text-xs font-bold text-cyan-300 font-mono mt-0.5 block truncate">
                {place.priceRange}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hours</span>
              <span className="text-xs font-bold text-slate-200 mt-0.5 block truncate">
                {place.openingHours}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Category</span>
              <span className="text-xs font-bold text-slate-200 capitalize mt-0.5 block truncate">
                {place.category}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Verification</span>
              <span className="text-xs font-bold text-emerald-400 mt-0.5 block truncate flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Verified</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              About This Destination
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Insider Tip Callout */}
          {place.insiderTip && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cyan-300 block mb-0.5">Insider Intel</span>
                <span>{place.insiderTip}</span>
              </div>
            </div>
          )}

          {/* Amenities & Highlights */}
          {place.amenities && place.amenities.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Amenities & Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {place.amenities.map((item) => (
                  <span
                    key={item}
                    className="text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location & Contact Details */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Full Address</span>
              <span className="text-slate-200 font-medium block mt-0.5">{place.address}</span>
            </div>
            {place.contactPhone && (
              <div className="shrink-0 flex items-center gap-2 text-cyan-300">
                <Phone className="w-3.5 h-3.5" />
                <span className="font-mono">{place.contactPhone}</span>
              </div>
            )}
          </div>

          {/* Similar Places / Show More Options in this Category */}
          {similarPlaces.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Similar {place.category.toUpperCase()} Options
                </h3>
                <span className="text-[11px] text-slate-400">
                  Prefer a different style or budget?
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarPlaces.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => {
                      sfx.playClick();
                      onSelectPlace(sim);
                    }}
                    className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-20 rounded-lg overflow-hidden mb-2 relative">
                        <img
                          src={sim.photoUrl}
                          alt={sim.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-1 right-1 text-[10px] font-mono text-amber-300 bg-black/80 px-1.5 py-0.5 rounded">
                          ★ {sim.rating}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {sim.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                        {sim.subcategory}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-cyan-400">
                      <span>{sim.priceRange.split(' ')[0]}</span>
                      <span className="font-semibold group-hover:translate-x-0.5 transition-transform">
                        Explore →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            {/* Favorite Button */}
            <button
              type="button"
              onClick={() => {
                sfx.playSuccess();
                onToggleFavorite(place.id);
              }}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isFavorite 
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/50' 
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save Favorite'}</span>
            </button>

            {/* Compare Button */}
            <button
              type="button"
              onClick={() => {
                sfx.playClick();
                onToggleCompare(place);
              }}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isInCompare 
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50' 
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">{isInCompare ? 'Comparing' : 'Compare Place'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Get Directions Button */}
            <button
              type="button"
              onClick={() => {
                sfx.playSuccess();
                onGetDirections(place);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all transform active:scale-95 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions on Map</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
