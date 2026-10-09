import React, { useState } from 'react';
import { 
  Activity, 
  Wind, 
  Volume2, 
  TreePine, 
  Car, 
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  ThumbsUp, 
  ShieldCheck, 
  TrendingUp,
  MapPin
} from 'lucide-react';
import { CityProfile, CivicReport } from '../types';
import { sfx } from '../services/soundFx';

interface CityPulseProps {
  currentCity: CityProfile;
  reports: CivicReport[];
  onUpvoteReport: (id: string) => void;
}

export const CityPulse: React.FC<CityPulseProps> = ({
  currentCity,
  reports,
  onUpvoteReport,
}) => {
  const [selectedFeedTab, setSelectedFeedTab] = useState<'all' | 'dispatched' | 'resolved'>('all');

  const filteredReports = reports.filter((r) => {
    if (selectedFeedTab === 'dispatched') return r.status === 'Crew Dispatched' || r.status === 'AI Triaged';
    if (selectedFeedTab === 'resolved') return r.status === 'Resolved';
    return true;
  });

  // Transit Hourly Index bar data
  const HOURLY_FLOW = [
    { hour: '06:00', density: 35 },
    { hour: '08:00', density: 88 },
    { hour: '10:00', density: 72 },
    { hour: '12:00', density: 54 },
    { hour: '14:00', density: 60 },
    { hour: '16:00', density: 78 },
    { hour: '18:00', density: 95 },
    { hour: '20:00', density: 82 },
    { hour: '22:00', density: 45 },
  ];

  return (
    <section id="city-pulse" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-500/15">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>REAL-TIME METROPOLITAN TELEMETRY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            City Pulse: Live Urban Visualization
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Aggregated from {currentCity.activeSensors.toLocaleString()} municipal IoT beacons & citizen crowd reports in {currentCity.name}.
          </p>
        </div>

        {/* Source attribution stamp */}
        <div className="text-right text-[11px] font-mono text-slate-400">
          <span className="text-slate-300">Source: PMRDA Smart Grid & Citizen Mesh</span>
          <br />
          <span className="text-cyan-400">Last Synced: 2 mins ago · Verified Telemetry</span>
        </div>
      </div>

      {/* Environmental KPI Strip (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Card 1: Air Quality */}
        <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Air Quality Index</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {currentCity.aqi}
            </span>
            <span className="text-xs text-cyan-300 font-semibold">
              {currentCity.aqi < 50 ? 'Optimal' : currentCity.aqi < 100 ? 'Moderate' : 'Alert'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            PM2.5: 22 µg/m³ · Ozone within safe thresholds
          </p>
        </div>

        {/* Card 2: Acoustic Ambience */}
        <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Acoustic Ambience</span>
            <Volume2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {currentCity.noiseDb} <span className="text-lg">dB</span>
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              Zen Soundscape
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Low horn disturbance recorded across residential zones
          </p>
        </div>

        {/* Card 3: Urban Canopy */}
        <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Urban Canopy</span>
            <TreePine className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {currentCity.greenCoverPct}%
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              Biophilic Index
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            +3.4% micro-forest expansion along hill ridges
          </p>
        </div>

        {/* Card 4: Mobility Flow */}
        <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Mobility Flow</span>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {currentCity.mobilityScore}/100
            </span>
            <span className="text-xs text-cyan-300 font-semibold">
              Fluid Transit
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Electric Metro lines running at 99.4% on-time cadence
          </p>
        </div>
      </div>

      {/* Two Column Layout: Transit Rhythm Chart & Community Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Transit Rhythm Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Hourly Urban Transit Flow
              </h3>
              <p className="text-xs text-slate-400">
                Pedestrian & commuter density rhythm across arterial hubs
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
            {HOURLY_FLOW.map((pt, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div 
                  className={`w-full rounded-t-md transition-all ${
                    pt.density > 80 
                      ? 'bg-gradient-to-t from-cyan-600 to-cyan-400' 
                      : 'bg-slate-700 hover:bg-cyan-500'
                  }`}
                  style={{ height: `${pt.density}%` }}
                />
                <span className="text-[10px] font-mono text-slate-400 -rotate-45 sm:rotate-0 mt-1">
                  {pt.hour.slice(0, 2)}h
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
              <span>Peak Commute Hours</span>
            </span>
            <span className="font-mono text-cyan-300">Avg Speed: 28 km/h</span>
          </div>
        </div>

        {/* Right Column: Community Incident Report Feed */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-white">
                Citizen Action Mesh Feed
              </h3>
              <p className="text-xs text-slate-400">
                Verified community reports resolved via AI dispatch
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setSelectedFeedTab('all');
                }}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                  selectedFeedTab === 'all' ? 'bg-cyan-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({reports.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setSelectedFeedTab('dispatched');
                }}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                  selectedFeedTab === 'dispatched' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dispatched
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setSelectedFeedTab('resolved');
                }}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                  selectedFeedTab === 'resolved' ? 'bg-slate-800 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Incident List */}
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    report.status === 'Resolved' 
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {report.status === 'Resolved' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono text-cyan-300 font-semibold">{report.ticketId}</span>
                      <span>·</span>
                      <span>{report.category}</span>
                      <span>·</span>
                      <span className="text-slate-400">{report.timestamp}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white mt-0.5">
                      {report.summary}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{report.location}</span>
                      </span>
                      <span>·</span>
                      <span className="text-cyan-400">{report.department}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Upvote Action */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md ${
                    report.status === 'Resolved'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {report.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      sfx.playClick();
                      onUpvoteReport(report.id);
                    }}
                    title="Upvote Civic Priority"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/80 transition-colors text-xs cursor-pointer font-mono"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{report.upvotes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
