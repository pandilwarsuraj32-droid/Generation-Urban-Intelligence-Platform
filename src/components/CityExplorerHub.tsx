import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Heart, 
  Navigation, 
  Eye, 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  Check, 
  ArrowUpDown,
  Building2,
  ShoppingBag,
  UtensilsCrossed,
  Landmark,
  TreePine,
  Film,
  GraduationCap,
  Hospital,
  Train,
  Shuffle
} from 'lucide-react';
import { CityPlace, PlaceCategory, CityProfile, PriceLevel } from '../types';
import { sfx } from '../services/soundFx';

interface CityExplorerHubProps {
  currentCity: CityProfile;
  places: CityPlace[];
  onSelectPlace: (place: CityPlace) => void;
  onGetDirections: (place: CityPlace) => void;
  favorites: string[];
  onToggleFavorite: (placeId: string) => void;
  compareList: CityPlace[];
  onToggleCompare: (place: CityPlace) => void;
  onOpenCompareModal: () => void;
}

export const CityExplorerHub: React.FC<CityExplorerHubProps> = ({
  currentCity,
  places,
  onSelectPlace,
  onGetDirections,
  favorites,
  onToggleFavorite,
  compareList,
  onToggleCompare,
  onOpenCompareModal,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [selectedBudget, setSelectedBudget] = useState<'all' | 'budget' | 'moderate' | 'premium' | 'luxury'>('all');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [onlyOpenNow, setOnlyOpenNow] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'nearest' | 'highest_rated' | 'lowest_price'>('recommended');
  
  // Pagination / Load More State
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Available Areas for active city
  const cityPlaces = useMemo(() => {
    return places.filter((p) => p.cityId === currentCity.id);
  }, [places, currentCity]);

  const availableAreas = useMemo(() => {
    const set = new Set<string>();
    cityPlaces.forEach((p) => set.add(p.area));
    return Array.from(set).sort();
  }, [cityPlaces]);

  // Main Filtering Logic
  const filteredPlaces = useMemo(() => {
    return cityPlaces.filter((place) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = place.name.toLowerCase().includes(q);
        const matchesCategory = place.category.toLowerCase().includes(q);
        const matchesSubcategory = place.subcategory.toLowerCase().includes(q);
        const matchesArea = place.area.toLowerCase().includes(q);
        const matchesDesc = place.description.toLowerCase().includes(q);
        const matchesAmenities = place.amenities.some((a) => a.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesSubcategory && !matchesArea && !matchesDesc && !matchesAmenities) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'all' && place.category !== selectedCategory) {
        return false;
      }

      // 3. Budget Tier
      if (selectedBudget !== 'all') {
        if (selectedBudget === 'budget' && place.priceLevel !== 'budget') return false;
        if (selectedBudget === 'moderate' && place.priceLevel !== 'moderate') return false;
        if ((selectedBudget === 'premium' || selectedBudget === 'luxury') && 
            place.priceLevel !== 'premium' && place.priceLevel !== 'luxury') {
          return false;
        }
      }

      // 4. Rating
      if (selectedRating > 0 && place.rating < selectedRating) {
        return false;
      }

      // 5. Area
      if (selectedArea !== 'all' && place.area !== selectedArea) {
        return false;
      }

      // 6. Open Now
      if (onlyOpenNow) {
        const isOpen = place.openingHours.includes('24 Hours') || !place.openingHours.includes('Closed');
        if (!isOpen) return false;
      }

      return true;
    });
  }, [cityPlaces, searchQuery, selectedCategory, selectedBudget, selectedRating, selectedArea, onlyOpenNow]);

  // Sorting Logic
  const sortedPlaces = useMemo(() => {
    const list = [...filteredPlaces];
    if (sortBy === 'highest_rated') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'nearest') {
      return list.sort((a, b) => (a.distanceKm || 99) - (b.distanceKm || 99));
    }
    if (sortBy === 'lowest_price') {
      const rank: Record<PriceLevel, number> = { budget: 1, moderate: 2, premium: 3, luxury: 4 };
      return list.sort((a, b) => rank[a.priceLevel] - rank[b.priceLevel]);
    }
    // 'recommended' default: balanced by rating & review count
    return list.sort((a, b) => (b.rating * Math.log10(b.reviewCount + 10)) - (a.rating * Math.log10(a.reviewCount + 10)));
  }, [filteredPlaces, sortBy]);

  const displayedPlaces = sortedPlaces.slice(0, visibleCount);
  const hasMore = visibleCount < sortedPlaces.length;

  const handleShufflePick = () => {
    if (sortedPlaces.length === 0) return;
    sfx.playScan();
    const randomPick = sortedPlaces[Math.floor(Math.random() * sortedPlaces.length)];
    onSelectPlace(randomPick);
  };

  const handleResetFilters = () => {
    sfx.playClick();
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBudget('all');
    setSelectedRating(0);
    setSelectedArea('all');
    setOnlyOpenNow(false);
    setSortBy('recommended');
    setVisibleCount(9);
  };

  return (
    <section id="city-explorer" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-500/15">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>AUTHENTIC URBAN DIRECTORY & PLACES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore Every Corner of {currentCity.name}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Discover verified hotels, luxury stays, shopping malls, legacy cafes, hospitals and transit with genuine local choices.
          </p>
        </div>

        {/* Quick action triggers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShufflePick}
            className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="Try an unexpected AI recommendation"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Try Another Recommendation</span>
          </button>
        </div>
      </div>

      {/* Main Search Bar & Quick Categories */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/25 mb-8 shadow-xl">
        
        {/* Search Input Row */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hotels, malls, restaurants, parks, heritage and places..."
            className="w-full bg-slate-950/90 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-400 text-sm sm:text-base rounded-xl pl-11 pr-4 py-3.5 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Primary Category Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Destinations', icon: Building2 },
            { id: 'stays', label: 'Hotels & Stays', icon: Building2 },
            { id: 'shopping', label: 'Shopping Malls', icon: ShoppingBag },
            { id: 'food', label: 'Food & Dining', icon: UtensilsCrossed },
            { id: 'heritage', label: 'Historical Places', icon: Landmark },
            { id: 'greenery', label: 'Parks & Nature', icon: TreePine },
            { id: 'entertainment', label: 'Cinemas & Leisure', icon: Film },
            { id: 'education', label: 'Colleges & Libraries', icon: GraduationCap },
            { id: 'health', label: 'Hospitals & Pharmacies', icon: Hospital },
            { id: 'transit', label: 'Public Transit', icon: Train },
          ].map((cat) => {
            const isAct = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setSelectedCategory(cat.id as any);
                  setVisibleCount(9);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isAct
                    ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row: Budget, Rating, Area, Open Now, Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80 mt-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Budget filter */}
            <select
              value={selectedBudget}
              onChange={(e) => {
                sfx.playClick();
                setSelectedBudget(e.target.value as any);
              }}
              className="bg-slate-950/90 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg outline-none cursor-pointer"
            >
              <option value="all">Budget: All</option>
              <option value="budget">Budget (₹)</option>
              <option value="moderate">Moderate (₹₹)</option>
              <option value="premium">Premium / Luxury (₹₹₹+)</option>
            </select>

            {/* Rating filter */}
            <select
              value={selectedRating}
              onChange={(e) => {
                sfx.playClick();
                setSelectedRating(Number(e.target.value));
              }}
              className="bg-slate-950/90 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg outline-none cursor-pointer"
            >
              <option value={0}>Rating: Any</option>
              <option value={4.0}>Rating: 4.0+ Stars</option>
              <option value={4.5}>Rating: 4.5+ Stars</option>
              <option value={4.8}>Rating: 4.8+ Top Tier</option>
            </select>

            {/* Area filter */}
            <select
              value={selectedArea}
              onChange={(e) => {
                sfx.playClick();
                setSelectedArea(e.target.value);
              }}
              className="bg-slate-950/90 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg outline-none cursor-pointer"
            >
              <option value="all">Neighborhood: All Areas</option>
              {availableAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>

            {/* Open Now toggle */}
            <button
              type="button"
              onClick={() => {
                sfx.playClick();
                setOnlyOpenNow(!onlyOpenNow);
              }}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                onlyOpenNow 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50' 
                  : 'bg-slate-950/90 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              Open Now
            </button>
          </div>

          {/* Sort By selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                sfx.playClick();
                setSortBy(e.target.value as any);
              }}
              className="bg-slate-950/90 border border-cyan-500/30 text-cyan-300 text-xs px-2.5 py-1.5 rounded-lg outline-none cursor-pointer font-semibold"
            >
              <option value="recommended">Recommended</option>
              <option value="highest_rated">Highest Rated</option>
              <option value="nearest">Nearest First</option>
              <option value="lowest_price">Lowest Price</option>
            </select>

            {(searchQuery || selectedCategory !== 'all' || selectedBudget !== 'all' || selectedRating > 0 || selectedArea !== 'all' || onlyOpenNow) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-slate-400 hover:text-cyan-400 text-xs underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
        <span>
          Showing <span className="font-mono text-cyan-300 font-bold">{displayedPlaces.length}</span> of{' '}
          <span className="font-mono text-white font-bold">{sortedPlaces.length}</span> verified places in {currentCity.name}
        </span>
        <span className="text-slate-500 font-mono text-[11px]">
          Live OpenStreetMap & Municipal Registry
        </span>
      </div>

      {/* Places Cards Grid (Multiple places per category) */}
      {displayedPlaces.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No matching destinations found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try loosening your filters or clear the search keywords to explore more options.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold text-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPlaces.map((place) => {
            const isFav = favorites.includes(place.id);
            const inCompare = compareList.some((c) => c.id === place.id);
            const isOpen = place.openingHours.includes('24 Hours') || !place.openingHours.includes('Closed');

            return (
              <div
                key={place.id}
                className="group rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[0_15px_40px_rgba(6,182,212,0.12)]"
              >
                {/* Photo Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={place.photoUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.82]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  {/* Top Tags */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
                      {place.subcategory}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                      isOpen ? 'bg-emerald-950/80 text-emerald-300' : 'bg-rose-950/80 text-rose-300'
                    }`}>
                      {isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  {/* Top Right Action Buttons: Favorite & Compare */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        sfx.playSuccess();
                        onToggleFavorite(place.id);
                      }}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        isFav 
                          ? 'bg-rose-900/90 text-rose-300' 
                          : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sfx.playClick();
                        onToggleCompare(place);
                      }}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        inCompare 
                          ? 'bg-cyan-900/90 text-cyan-300 border border-cyan-400' 
                          : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
                      }`}
                      title={inCompare ? 'Remove from comparison' : 'Compare with others'}
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rating & Distance Chip */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-slate-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white font-mono">{place.rating}</span>
                      <span className="text-slate-400 text-[10px] font-mono">({place.reviewCount.toLocaleString()})</span>
                    </div>

                    <span className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-cyan-300 font-mono text-[11px]">
                      {place.distanceKm} km
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                      {place.name}
                    </h3>

                    {/* Area & Hours */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 mb-2 font-medium">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{place.area}</span>
                      <span>·</span>
                      <span className="text-slate-400 truncate">{place.openingHours}</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {place.description}
                    </p>
                  </div>

                  {/* Price & Amenities */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Estimated Budget</span>
                      <span className="font-bold text-cyan-300 font-mono text-xs">
                        {place.priceRange}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          sfx.playClick();
                          onSelectPlace(place);
                        }}
                        className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>View Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          sfx.playSuccess();
                          onGetDirections(place);
                        }}
                        className="py-2 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Directions</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Show More Options / Pagination */}
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              setVisibleCount((prev) => prev + 6);
            }}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] cursor-pointer"
          >
            Show More Options ({sortedPlaces.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* Floating Bottom Comparison Dock */}
      {compareList.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/50 rounded-2xl px-5 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white font-mono">
              Comparing {compareList.length} Venue{compareList.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            {compareList.map((p) => (
              <span key={p.id} className="text-[11px] text-cyan-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 truncate max-w-[130px]">
                {p.name}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onOpenCompareModal();
            }}
            className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            View Comparison Table
          </button>
        </div>
      )}

    </section>
  );
};
