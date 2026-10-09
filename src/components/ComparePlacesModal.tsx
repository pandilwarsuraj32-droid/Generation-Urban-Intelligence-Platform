import React from 'react';
import { X, Star, MapPin, Check, Navigation, SlidersHorizontal, Trash2 } from 'lucide-react';
import { CityPlace } from '../types';
import { sfx } from '../services/soundFx';

interface ComparePlacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareList: CityPlace[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onSelectAndRoute: (place: CityPlace) => void;
}

export const ComparePlacesModal: React.FC<ComparePlacesModalProps> = ({
  isOpen,
  onClose,
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onSelectAndRoute,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-[#090d1a] border border-cyan-500/35 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-lg font-bold text-white">
                Compare City Destinations Side-by-Side
              </h3>
              <p className="text-xs text-slate-400">
                Comparing {compareList.length} destination{compareList.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  onClearCompare();
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table / Columns */}
        <div className="p-6 overflow-y-auto overflow-x-auto flex-1">
          {compareList.length === 0 ? (
            <div className="text-center py-12">
              <SlidersHorizontal className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-medium">No places selected for comparison yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Click "Compare" on any place card or details sheet to add up to 3 options.
              </p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${
              compareList.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : compareList.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
            } gap-4`}>
              {compareList.map((place) => (
                <div
                  key={place.id}
                  className="rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between overflow-hidden relative"
                >
                  {/* Remove pill */}
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playClick();
                      onRemoveFromCompare(place.id);
                    }}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/75 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors"
                    title="Remove from comparison"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Photo & Header */}
                  <div>
                    <div className="h-40 relative overflow-hidden">
                      <img
                        src={place.photoUrl}
                        alt={place.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                        {place.subcategory}
                      </span>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="text-base font-bold text-white leading-tight">
                          {place.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{place.area}</span>
                          <span>·</span>
                          <span>{place.distanceKm} km away</span>
                        </div>
                      </div>

                      {/* Attribute rows */}
                      <div className="space-y-2 text-xs border-t border-slate-900 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Rating</span>
                          <span className="font-bold text-amber-400 flex items-center gap-1 font-mono">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{place.rating}</span>
                            <span className="text-slate-500 font-normal">({place.reviewCount})</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Price Range</span>
                          <span className="font-bold text-cyan-300 font-mono">
                            {place.priceRange}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Operating Hours</span>
                          <span className="text-slate-200 text-right truncate max-w-[160px]">
                            {place.openingHours}
                          </span>
                        </div>
                      </div>

                      {/* Amenities checklist */}
                      <div className="border-t border-slate-900 pt-3">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">
                          Highlights & Amenities
                        </span>
                        <div className="space-y-1">
                          {place.amenities.slice(0, 4).map((am) => (
                            <div key={am} className="flex items-center gap-1.5 text-xs text-slate-300">
                              <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span className="truncate">{am}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Choose this destination button */}
                  <div className="p-4 border-t border-slate-900 bg-slate-950">
                    <button
                      type="button"
                      onClick={() => {
                        sfx.playSuccess();
                        onSelectAndRoute(place);
                        onClose();
                      }}
                      className="w-full py-2.5 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Choose This & Get Route</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Clicking "Choose This" will highlight the venue and draw route on the digital city map.
          </span>
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
