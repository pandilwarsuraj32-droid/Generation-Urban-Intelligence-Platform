/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveMap } from './components/InteractiveMap';
import { CityExplorerHub } from './components/CityExplorerHub';
import { PlaceDetailsModal } from './components/PlaceDetailsModal';
import { ComparePlacesModal } from './components/ComparePlacesModal';
import { AiCopilot } from './components/AiCopilot';
import { SnapCity } from './components/SnapCity';
import { CityPulse } from './components/CityPulse';
import { HiddenSide } from './components/HiddenSide';
import { SavedPlansModal } from './components/SavedPlansModal';
import { Footer } from './components/Footer';

import { CityId, CityMarker, CityPlace, CopilotItinerary, CivicReport } from './types';
import { CITIES, INITIAL_CIVIC_REPORTS, EXPANDED_PLACES } from './data/cityData';
import { sfx } from './services/soundFx';

export default function App() {
  const [currentCityId, setCurrentCityId] = useState<CityId>('pune');
  const [isMuted, setIsMuted] = useState(sfx.getMuted());
  const [reducedMotion, setReducedMotion] = useState(false);

  // Map state
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [activeRouteCoords, setActiveRouteCoords] = useState<[number, number][] | null>(null);

  // Copilot initial query triggered from Hero search
  const [copilotQuery, setCopilotQuery] = useState('');

  // Place Details & Comparison Modals
  const [selectedPlaceForDetails, setSelectedPlaceForDetails] = useState<CityPlace | null>(null);
  const [compareList, setCompareList] = useState<CityPlace[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cityverse_favorites');
      return saved ? JSON.parse(saved) : ['pn-hotel-1', 'pn-food-1', 'pn-shop-1'];
    } catch {
      return ['pn-hotel-1', 'pn-food-1', 'pn-shop-1'];
    }
  });

  // Saved Items
  const [savedItineraries, setSavedItineraries] = useState<CopilotItinerary[]>(() => {
    try {
      const saved = localStorage.getItem('cityverse_saved_itineraries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [civicReports, setCivicReports] = useState<CivicReport[]>(() => {
    try {
      const saved = localStorage.getItem('cityverse_reports');
      return saved ? JSON.parse(saved) : INITIAL_CIVIC_REPORTS;
    } catch {
      return INITIAL_CIVIC_REPORTS;
    }
  });

  const [savedPlansOpen, setSavedPlansOpen] = useState(false);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('cityverse_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('cityverse_saved_itineraries', JSON.stringify(savedItineraries));
    } catch {}
  }, [savedItineraries]);

  useEffect(() => {
    try {
      localStorage.setItem('cityverse_reports', JSON.stringify(civicReports));
    } catch {}
  }, [civicReports]);

  const currentCity = CITIES.find((c) => c.id === currentCityId) || CITIES[0];

  // Actions
  const handleTriggerSearch = (query: string) => {
    setCopilotQuery(query);
    const copilotEl = document.getElementById('ai-copilot');
    if (copilotEl) {
      copilotEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreMap = () => {
    const mapEl = document.getElementById('interactive-map');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMeetCopilot = () => {
    const copilotEl = document.getElementById('ai-copilot');
    if (copilotEl) {
      copilotEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShowRouteOnMap = (coords: [number, number][]) => {
    setActiveRouteCoords(coords);
  };

  const handleGetDirections = (place: CityPlace) => {
    sfx.playSuccess();
    setActiveRouteCoords([currentCity.center, place.coordinates]);
    setSelectedMarkerId(place.id);
    const mapEl = document.getElementById('interactive-map');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleFavorite = (placeId: string) => {
    setFavorites((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );
  };

  const handleToggleCompare = (place: CityPlace) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === place.id)) {
        return prev.filter((p) => p.id !== place.id);
      }
      if (prev.length >= 3) {
        // limit to 3 for clean side-by-side display
        return [...prev.slice(1), place];
      }
      return [...prev, place];
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const handleSaveItinerary = (itinerary: CopilotItinerary) => {
    setSavedItineraries((prev) => [itinerary, ...prev.filter((item) => item.id !== itinerary.id)]);
  };

  const handleDeleteItinerary = (id: string) => {
    setSavedItineraries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleNewReportCreated = (report: CivicReport) => {
    setCivicReports((prev) => [report, ...prev]);
  };

  const handleUpvoteReport = (id: string) => {
    setCivicReports((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, upvotes: rep.upvotes + 1 } : rep))
    );
  };

  const handleDiscoverPlace = (coords: [number, number], placeName: string) => {
    setActiveRouteCoords([currentCity.center, coords]);
    const mapEl = document.getElementById('interactive-map');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddStopToCopilot = (marker: CityMarker) => {
    setCopilotQuery(`Plan a stop starting at ${marker.name} in ${marker.address}`);
    const copilotEl = document.getElementById('ai-copilot');
    if (copilotEl) {
      copilotEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-[#05070e] text-slate-100 flex flex-col ${reducedMotion ? 'motion-reduce' : ''}`}>
      {/* 3-Zone Top Navigation */}
      <Navbar
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        savedPlansCount={savedItineraries.length + civicReports.length + favorites.length}
        onOpenSavedPlans={() => setSavedPlansOpen(true)}
        onOpenCopilot={handleMeetCopilot}
      />

      <main className="flex-1 w-full">
        {/* 1. Hero Section (First Impression, 60-70% visual weight) */}
        <Hero
          currentCityId={currentCityId}
          onSelectCity={(id) => {
            setCurrentCityId(id);
            setActiveRouteCoords(null);
          }}
          onTriggerSearch={handleTriggerSearch}
          onExploreMap={handleExploreMap}
          onMeetCopilot={handleMeetCopilot}
          reducedMotion={reducedMotion}
        />

        {/* 2. Interactive Digital City (Map Centerpiece) */}
        <InteractiveMap
          currentCity={currentCity}
          selectedMarkerId={selectedMarkerId}
          onSelectMarker={(m) => setSelectedMarkerId(m ? m.id : null)}
          onAddStopToCopilot={handleAddStopToCopilot}
          activeRouteCoords={activeRouteCoords}
        />

        {/* 3. Comprehensive City Explorer Hub (Hotels, Malls, Food & Places) */}
        <CityExplorerHub
          currentCity={currentCity}
          places={EXPANDED_PLACES}
          onSelectPlace={(place) => setSelectedPlaceForDetails(place)}
          onGetDirections={handleGetDirections}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          compareList={compareList}
          onToggleCompare={handleToggleCompare}
          onOpenCompareModal={() => setIsCompareModalOpen(true)}
        />

        {/* 4. AI City Copilot (Signature Feature) */}
        <AiCopilot
          currentCity={currentCity}
          onShowRouteOnMap={handleShowRouteOnMap}
          onSaveItinerary={handleSaveItinerary}
          initialQuery={copilotQuery}
        />

        {/* 5. Snap The City (Visual AI Civic Tool) */}
        <SnapCity
          currentCity={currentCity}
          onNewReportCreated={handleNewReportCreated}
        />

        {/* 6. City Pulse (Live City Visualization & Telemetry) */}
        <CityPulse
          currentCity={currentCity}
          reports={civicReports}
          onUpvoteReport={handleUpvoteReport}
        />

        {/* 7. Explore Your City's Hidden Side */}
        <HiddenSide
          currentCity={currentCity}
          onDiscoverPlace={handleDiscoverPlace}
        />
      </main>

      {/* Place Details Modal with Similar Places */}
      <PlaceDetailsModal
        place={selectedPlaceForDetails}
        onClose={() => setSelectedPlaceForDetails(null)}
        allPlaces={EXPANDED_PLACES.filter((p) => p.cityId === currentCity.id)}
        isFavorite={selectedPlaceForDetails ? favorites.includes(selectedPlaceForDetails.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onGetDirections={handleGetDirections}
        onSelectPlace={(p) => setSelectedPlaceForDetails(p)}
        isInCompare={selectedPlaceForDetails ? compareList.some((c) => c.id === selectedPlaceForDetails.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      {/* Side-by-side Comparison Modal */}
      <ComparePlacesModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        compareList={compareList}
        onRemoveFromCompare={handleRemoveFromCompare}
        onClearCompare={handleClearCompare}
        onSelectAndRoute={handleGetDirections}
      />

      {/* Saved Itineraries & Tickets Drawer */}
      <SavedPlansModal
        isOpen={savedPlansOpen}
        onClose={() => setSavedPlansOpen(false)}
        savedItineraries={savedItineraries}
        savedReports={civicReports}
        onDeleteItinerary={handleDeleteItinerary}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
