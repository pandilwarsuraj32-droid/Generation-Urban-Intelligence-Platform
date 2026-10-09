import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Maximize2, 
  RotateCcw, 
  Navigation, 
  Sparkles, 
  ShieldCheck, 
  Wind, 
  Users, 
  X,
  ExternalLink,
  PlusCircle,
  Eye
} from 'lucide-react';
import { CityMarker, PlaceCategory, CityProfile } from '../types';
import { CITY_MARKERS } from '../data/cityData';
import { sfx } from '../services/soundFx';

interface InteractiveMapProps {
  currentCity: CityProfile;
  selectedMarkerId?: string | null;
  onSelectMarker?: (marker: CityMarker | null) => void;
  onAddStopToCopilot?: (marker: CityMarker) => void;
  activeRouteCoords?: [number, number][] | null;
}

const CATEGORY_CONFIG: Record<PlaceCategory, { label: string; color: string; ringColor: string }> = {
  stays: { label: 'Hotels & Stays', color: '#38bdf8', ringColor: 'rgba(56, 189, 248, 0.4)' },
  shopping: { label: 'Malls & Retail', color: '#c084fc', ringColor: 'rgba(192, 132, 252, 0.4)' },
  food: { label: 'Food & Cafes', color: '#ec4899', ringColor: 'rgba(236, 72, 153, 0.4)' },
  heritage: { label: 'Heritage & History', color: '#f59e0b', ringColor: 'rgba(245, 158, 11, 0.4)' },
  greenery: { label: 'Parks & Nature', color: '#10b981', ringColor: 'rgba(16, 185, 129, 0.4)' },
  entertainment: { label: 'Cinemas & Leisure', color: '#f43f5e', ringColor: 'rgba(244, 63, 94, 0.4)' },
  photography: { label: 'Photo Spots', color: '#e879f9', ringColor: 'rgba(232, 121, 249, 0.4)' },
  education: { label: 'Colleges & Libraries', color: '#818cf8', ringColor: 'rgba(129, 140, 248, 0.4)' },
  health: { label: 'Hospitals & Pharmacies', color: '#ef4444', ringColor: 'rgba(239, 68, 68, 0.4)' },
  transit: { label: 'Transit & Metro', color: '#06b6d4', ringColor: 'rgba(6, 182, 212, 0.4)' },
  accessibility: { label: 'Accessible Hubs', color: '#14b8a6', ringColor: 'rgba(20, 184, 166, 0.4)' },
  issue: { label: 'Civic Reports', color: '#fb7185', ringColor: 'rgba(251, 113, 133, 0.4)' },
  sensor: { label: 'Sensor Grid', color: '#a855f7', ringColor: 'rgba(168, 85, 247, 0.4)' },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  currentCity,
  selectedMarkerId,
  onSelectMarker,
  onAddStopToCopilot,
  activeRouteCoords,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeCategory, setActiveCategory] = useState<PlaceCategory | 'all'>('all');
  const [activePlace, setActivePlace] = useState<CityMarker | null>(null);
  const [isPerspectiveTilted, setIsPerspectiveTilted] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Filter markers by current city and active category
  const filteredMarkers = CITY_MARKERS.filter((m) => {
    const matchesCity = m.cityId === currentCity.id;
    const matchesCat = activeCategory === 'all' || m.category === activeCategory;
    return matchesCity && matchesCat;
  });

  // Watch selectedMarkerId from outside (e.g. from CityExplorerHub or Copilot)
  useEffect(() => {
    if (selectedMarkerId) {
      const match = CITY_MARKERS.find((m) => m.id === selectedMarkerId);
      if (match) {
        setActivePlace(match);
        mapInstanceRef.current?.flyTo(match.coordinates, 15, { duration: 1.2 });
      }
    }
  }, [selectedMarkerId]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: currentCity.center,
        zoom: currentCity.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Dark Matter tiles (sleek, high-contrast, cyberpunk ready)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: 'CITYVERSE Mesh' }).addTo(map);

      markersLayerGroupRef.current = L.layerGroup().addTo(map);
      routeLayerGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.flyTo(currentCity.center, currentCity.zoom, { duration: 1.5 });
    }
  }, [currentCity]);

  // Update Markers on filter / city change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

    markersLayerGroupRef.current.clearLayers();

    filteredMarkers.forEach((marker) => {
      const config = CATEGORY_CONFIG[marker.category];
      const isSelected = activePlace?.id === marker.id || selectedMarkerId === marker.id;

      // Custom Glowing Cyber DivIcon
      const iconHtml = `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${config.ringColor}; animation: radar-pulse 2s infinite; opacity: ${isSelected ? '1' : '0.6'};"></div>
          <div style="
            width: ${isSelected ? '24px' : '18px'}; 
            height: ${isSelected ? '24px' : '18px'}; 
            border-radius: 50%; 
            background: ${config.color}; 
            border: 2px solid #ffffff; 
            box-shadow: 0 0 16px ${config.color}, 0 0 8px #ffffff;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: #000000;"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-city-marker',
        html: iconHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const leafletMarker = L.marker(marker.coordinates, { icon: customIcon });

      leafletMarker.on('click', () => {
        sfx.playClick();
        setActivePlace(marker);
        if (onSelectMarker) onSelectMarker(marker);
        mapInstanceRef.current?.flyTo(marker.coordinates, Math.max(14, mapInstanceRef.current.getZoom()), {
          duration: 0.8,
        });
      });

      leafletMarker.bindTooltip(marker.name, {
        direction: 'top',
        offset: [0, -14],
        className: 'bg-slate-900/90 text-cyan-300 font-semibold px-2 py-1 rounded text-xs border border-cyan-500/30',
      });

      markersLayerGroupRef.current?.addLayer(leafletMarker);
    });
  }, [filteredMarkers, activePlace, selectedMarkerId]);

  // Handle active route polyline rendering
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerGroupRef.current) return;
    routeLayerGroupRef.current.clearLayers();

    if (activeRouteCoords && activeRouteCoords.length > 1) {
      // Draw neon path
      const polyline = L.polyline(activeRouteCoords, {
        color: '#06b6d4',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      });

      const glowLine = L.polyline(activeRouteCoords, {
        color: '#38bdf8',
        weight: 8,
        opacity: 0.25,
      });

      routeLayerGroupRef.current.addLayer(glowLine);
      routeLayerGroupRef.current.addLayer(polyline);

      // Fit bounds
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  }, [activeRouteCoords]);

  // Re-center handler
  const handleRecenter = () => {
    sfx.playClick();
    mapInstanceRef.current?.flyTo(currentCity.center, currentCity.zoom, { duration: 1 });
  };

  // Zoom handlers
  const handleZoomIn = () => {
    sfx.playClick();
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    sfx.playClick();
    mapInstanceRef.current?.zoomOut();
  };

  // Geolocation trigger
  const handleLocateMe = () => {
    sfx.playClick();
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserCoords(coords);
        mapInstanceRef.current?.flyTo(coords, 15, { duration: 1.2 });
        sfx.playSuccess();
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <section id="interactive-map" className="relative w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>METROPOLITAN DIGITAL TWIN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interactive Digital City
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time multi-layered spatial explorer for {currentCity.name} ({currentCity.tagline})
          </p>
        </div>

        {/* Category Filter Tabs (Single-line interactive buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              setActiveCategory('all');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Layers
          </button>
          {(Object.keys(CATEGORY_CONFIG) as PlaceCategory[]).map((cat) => {
            const isAct = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isAct
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {CATEGORY_CONFIG[cat].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Viewport Frame */}
      <div 
        className={`relative w-full h-[620px] rounded-2xl overflow-hidden border border-cyan-500/25 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_25px_rgba(6,182,212,0.1)] transition-transform duration-500 ${
          isPerspectiveTilted ? 'transform perspective-[1000px] rotate-x-6' : ''
        }`}
      >
        {/* Leaflet map container */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Cyber Map HUD Overlay Grids */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>MESH NODE: {currentCity.name.toUpperCase()} // LAT {currentCity.center[0]}°</span>
        </div>

        {/* Floating Map Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-9 h-9 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-lg transition-all cursor-pointer font-bold"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-9 h-9 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-lg transition-all cursor-pointer font-bold"
          >
            -
          </button>
          <button
            type="button"
            onClick={handleRecenter}
            title="Re-center City"
            className="w-9 h-9 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleLocateMe}
            title="Locate Me"
            className={`w-9 h-9 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-lg transition-all cursor-pointer ${
              isLocating ? 'animate-pulse' : ''
            }`}
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              setIsPerspectiveTilted(!isPerspectiveTilted);
            }}
            title={isPerspectiveTilted ? 'Reset 2D Flat View' : 'Toggle 3D Perspective Tilt'}
            className={`w-9 h-9 rounded-lg border text-cyan-300 flex items-center justify-center backdrop-blur-md shadow-lg transition-all cursor-pointer ${
              isPerspectiveTilted 
                ? 'bg-cyan-950/80 border-cyan-400' 
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 hover:border-cyan-400'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Place Detail HUD Drawer */}
        {activePlace && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-30 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_CONFIG[activePlace.category].color }} />
                  <span>{CATEGORY_CONFIG[activePlace.category].label}</span>
                  {activePlace.rating && (
                    <>
                      <span className="text-slate-600">·</span>
                      <span className="text-amber-400 font-mono">★ {activePlace.rating}</span>
                    </>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white leading-tight mt-0.5">
                  {activePlace.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setActivePlace(null);
                  if (onSelectMarker) onSelectMarker(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo preview if available */}
            {activePlace.photoUrl && (
              <div className="w-full h-32 rounded-lg overflow-hidden my-2 relative">
                <img
                  src={activePlace.photoUrl}
                  alt={activePlace.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[11px] font-mono text-cyan-200 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-md">
                  {activePlace.address}
                </span>
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed my-2">
              {activePlace.description}
            </p>

            {/* Insider tip */}
            {activePlace.insiderTip && (
              <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 my-2">
                <span className="font-semibold text-cyan-300">Insider Intel: </span>
                <span>{activePlace.insiderTip}</span>
              </div>
            )}

            {/* Accessibility Perks */}
            {activePlace.accessibilityFeatures && activePlace.accessibilityFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1.5 my-2">
                {activePlace.accessibilityFeatures.map((feat) => (
                  <span key={feat} className="text-[10px] text-slate-300 bg-slate-800/80 border border-slate-700/60 rounded px-2 py-0.5">
                    ✓ {feat}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800 mt-2">
              <button
                type="button"
                onClick={() => {
                  sfx.playSuccess();
                  if (onAddStopToCopilot) onAddStopToCopilot(activePlace);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add to Copilot</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  mapInstanceRef.current?.flyTo(activePlace.coordinates, 16, { duration: 1 });
                }}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>Focus Node</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
