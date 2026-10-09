import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Send, 
  Clock, 
  MapPin, 
  RefreshCw,
  Eye
} from 'lucide-react';
import { CityProfile, CivicReport } from '../types';
import { PRESET_SNAP_EXAMPLES, ASSET_IMAGES } from '../data/cityData';
import { sfx } from '../services/soundFx';

interface SnapCityProps {
  currentCity: CityProfile;
  onNewReportCreated: (report: CivicReport) => void;
}

export const SnapCity: React.FC<SnapCityProps> = ({
  currentCity,
  onNewReportCreated,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(PRESET_SNAP_EXAMPLES[0].previewUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [locationInput, setLocationInput] = useState(PRESET_SNAP_EXAMPLES[0].location);
  const [descriptionInput, setDescriptionInput] = useState(PRESET_SNAP_EXAMPLES[0].description);
  const [selectedCategory, setSelectedCategory] = useState(PRESET_SNAP_EXAMPLES[0].category);
  const [severityLevel, setSeverityLevel] = useState<'High' | 'Medium' | 'Low'>(PRESET_SNAP_EXAMPLES[0].severity);
  const [department, setDepartment] = useState('Smart Road Infrastructure Corps');
  const [turnaround, setTurnaround] = useState('24 Hours');
  const [confidenceScore, setConfidenceScore] = useState(94);
  const [submittedReport, setSubmittedReport] = useState<CivicReport | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle preset sample pick
  const handleSelectPreset = (example: typeof PRESET_SNAP_EXAMPLES[0]) => {
    sfx.playClick();
    setSelectedImage(example.previewUrl);
    setSelectedCategory(example.category);
    setLocationInput(`${example.location} (${currentCity.name})`);
    setDescriptionInput(example.description);
    setSeverityLevel(example.severity);
    setSubmittedReport(null);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sfx.playScan();
    setIsScanning(true);
    setSubmittedReport(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);

      // Perform AI vision analysis
      try {
        const response = await fetch('/api/snap-city', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type,
            location: locationInput,
            city: currentCity.name
          })
        });
        const resJson = await response.json();
        if (resJson && resJson.report) {
          setSelectedCategory(resJson.report.detectedCategory || 'Public Infrastructure Defect');
          setSeverityLevel(resJson.report.severity || 'Medium');
          setDepartment(resJson.report.departmentAssigned || 'Municipal Public Works');
          setTurnaround(resJson.report.estimatedRepairTurnaround || '24-48 Hours');
          setConfidenceScore(resJson.report.confidenceScore || 92);
          if (resJson.report.summary) {
            setDescriptionInput(resJson.report.summary);
          }
          sfx.playSuccess();
        }
      } catch (err) {
        console.warn('Vision analysis fallback:', err);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit report handler
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    sfx.playSuccess();
    const newReport: CivicReport = {
      id: `rep-${Date.now()}`,
      ticketId: `CV-${currentCity.id.toUpperCase().slice(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`,
      category: selectedCategory,
      severity: severityLevel,
      confidenceScore: confidenceScore,
      summary: descriptionInput || 'Civic infrastructure defect logged via visual AI.',
      department: department,
      turnaround: turnaround,
      location: locationInput,
      imageUrl: selectedImage,
      status: 'AI Triaged',
      timestamp: 'Just now',
      upvotes: 1
    };

    setSubmittedReport(newReport);
    onNewReportCreated(newReport);
  };

  return (
    <section id="snap-city" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-500/15">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-medium mb-3">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>VISUAL CIVIC INTELLIGENCE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          See a Problem? Snap It. Report It.
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2">
          Point your lens at road fractures, malfunctioning streetlights, or waste accumulation. 
          Our neural vision model diagnoses severity and auto-dispatches ward crews.
        </p>
      </div>

      {/* Main Two-Column Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/25 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        
        {/* Left Column: Image Upload & Laser Scanner */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden border-2 border-dashed border-cyan-500/40 bg-slate-950/80 group flex flex-col items-center justify-center p-4">
            {selectedImage ? (
              <>
                <img
                  src={selectedImage}
                  alt="Reported civic condition"
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

                {/* Laser scanning beam animation */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2" />
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Retake / Upload</span>
                </button>
              </>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center text-center cursor-pointer p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  Upload Civic Incident Photo
                </h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Drag & drop an image or click to browse. Supports JPG, PNG, WEBP.
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Quick Preset Samples */}
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-2">
              Or test with civic presets:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_SNAP_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPreset(ex)}
                  className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 text-left transition-colors cursor-pointer"
                >
                  <span className="text-[11px] font-semibold text-slate-200 block truncate">
                    {ex.title}
                  </span>
                  <span className="text-[9px] text-cyan-400 font-mono block">
                    {ex.severity} Priority
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Triage & Submission Form */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <form onSubmit={handleSubmitReport} className="space-y-4">
            
            {/* AI Diagnosis Bar */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold block">
                  Vision Model Classification
                </span>
                <span className="text-sm font-bold text-white">
                  {selectedCategory}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Severity</span>
                  <span className={`font-bold ${
                    severityLevel === 'High' ? 'text-rose-400' : severityLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {severityLevel}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Confidence</span>
                  <span className="text-cyan-300 font-bold">{confidenceScore}%</span>
                </div>
              </div>
            </div>

            {/* Location Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Incident Location / Ward Landmark
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="e.g. JM Road near Sambhaji Park Gate 1"
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 text-white text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none transition-colors"
                  required
                />
                <MapPin className="w-4 h-4 text-cyan-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Detected Civic Category (Editable)
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 text-slate-200 text-xs sm:text-sm rounded-lg px-3 py-2.5 outline-none cursor-pointer"
              >
                <option value="Pothole & Road Hazard">Pothole & Road Hazard</option>
                <option value="Sidewalk Obstruction">Sidewalk Obstruction & Damaged Curb</option>
                <option value="Garbage & Waste Accumulation">Garbage & Solid Waste Accumulation</option>
                <option value="Lighting & Electrical Grid">Streetlight / Electrical Grid Breakdown</option>
                <option value="Drainage & Water Stagnation">Drainage Clogging & Water Leak</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                AI Observations & Description
              </label>
              <textarea
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                rows={3}
                placeholder="Describe details for municipal crew..."
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 text-white text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!selectedImage || isScanning}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all transform active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit & Dispatch Civic Ticket</span>
              </button>
            </div>
          </form>

          {/* Success Banner */}
          {submittedReport && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3 animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Ticket Generated: {submittedReport.ticketId}
                </h5>
                <p className="text-xs text-slate-200 mt-0.5">
                  Assigned to <span className="font-semibold text-white">{submittedReport.department}</span>. 
                  Expected repair turnaround: <span className="font-mono text-emerald-300">{submittedReport.turnaround}</span>.
                </p>
                <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                  +50 Civic Karma points credited to your explorer account.
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
