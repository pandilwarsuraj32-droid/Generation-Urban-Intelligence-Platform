import React from 'react';
import { X, BookmarkCheck, Calendar, Download, Trash2, MapPin, IndianRupee, ShieldCheck } from 'lucide-react';
import { CopilotItinerary, CivicReport } from '../types';
import { sfx } from '../services/soundFx';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItineraries: CopilotItinerary[];
  savedReports: CivicReport[];
  onDeleteItinerary: (id: string) => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  savedItineraries,
  savedReports,
  onDeleteItinerary,
}) => {
  if (!isOpen) return null;

  const handleExportAll = () => {
    sfx.playSuccess();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ itineraries: savedItineraries, reports: savedReports }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'cityverse_saved_plans.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">
              Saved Itineraries & Civic Tickets
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: Itineraries */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Bookmarked AI Itineraries ({savedItineraries.length})
            </h4>
            {savedItineraries.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                No itineraries saved yet. Click "Save Plan" inside the AI Copilot to store your custom routes.
              </p>
            ) : (
              <div className="space-y-3">
                {savedItineraries.map((it) => (
                  <div
                    key={it.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <span className="font-semibold text-cyan-300">{it.city}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-300">{it.estimatedBudget}</span>
                        <span>·</span>
                        <span>{it.createdAt}</span>
                      </div>
                      <h5 className="text-sm font-bold text-white">
                        {it.title}
                      </h5>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                        {it.overview}
                      </p>
                      <span className="text-[11px] font-mono text-cyan-400 mt-2 block">
                        {it.stops.length} Stops planned: {it.stops.map(s => s.placeName).join(' → ')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sfx.playClick();
                        onDeleteItinerary(it.id);
                      }}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Submitted Civic Tickets */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Your Civic Tickets ({savedReports.length})
            </h4>
            {savedReports.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                No civic tickets logged. Use the "Snap the City" tool to report infrastructure issues.
              </p>
            ) : (
              <div className="space-y-2">
                {savedReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-300 font-bold">{rep.ticketId}</span>
                        <span>·</span>
                        <span className="text-white font-medium">{rep.category}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] block mt-0.5">{rep.location}</span>
                    </div>

                    <span className="font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[11px]">
                      {rep.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleExportAll}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Offline Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
