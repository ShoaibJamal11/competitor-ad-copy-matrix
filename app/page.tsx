"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  SlidersHorizontal, 
  RefreshCw, 
  Video, 
  Layers, 
  Target, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from "lucide-react";

interface AdAngle {
  framework: "AIDA" | "PAS" | "Hook-Story-Offer" | "Objection Crusher";
  targetPainPoint: string;
  headline: string;
  primaryText: string;
  callToAction: string;
  creativeBrief: {
    format: string;
    visualHook: string;
    onScreenText: string;
  };
}

const PRESET_DTC = {
  brandName: "Lumina Rosemary Hair Oil",
  niche: "DTC Haircare & Wellness",
  productDescription: "Cold-pressed organic rosemary hair density oil that reduces hair fall by 60% in 30 days without greasy residue.",
  competitorAngle: "Competitors use heavy mineral oils that clog scalp pores and cost $45 with fake reviews.",
  targetAudience: "Women aged 22-45 dealing with postpartum thinning and chemical damage.",
};

const PRESET_B2B = {
  brandName: "PipelinePro AI",
  niche: "B2B Sales Automation",
  productDescription: "Autonomous outbound engine that crawls target leads, writes personalized audit pitches, and books calls into HubSpot.",
  competitorAngle: "Competitors charge $1,200/mo for manual VAs who send generic, spammy templates that damage domain reputation.",
  targetAudience: "B2B SaaS Founders and Agency Owners doing $20k-$100k MRR.",
};

export default function AdCopyMatrixPage() {
  const [brandName, setBrandName] = useState(PRESET_DTC.brandName);
  const [niche, setNiche] = useState(PRESET_DTC.niche);
  const [productDescription, setProductDescription] = useState(PRESET_DTC.productDescription);
  const [competitorAngle, setCompetitorAngle] = useState(PRESET_DTC.competitorAngle);
  const [targetAudience, setTargetAudience] = useState(PRESET_DTC.targetAudience);

  const [loading, setLoading] = useState(false);
  const [angles, setAngles] = useState<AdAngle[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          niche,
          productDescription,
          competitorAngle,
          targetAudience,
        }),
      });

      const data = await res.json();
      if (res.ok && data.angles) {
        setAngles(data.angles);
      } else {
        alert("Failed to generate: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportCSV = () => {
    if (!angles.length) return;

    const headers = ["Framework", "Pain Point", "Headline", "Primary Text", "CTA", "Format", "Visual Hook", "On Screen Text"];
    const rows = angles.map((a) => [
      `"${a.framework}"`,
      `"${a.targetPainPoint.replace(/"/g, '""')}"`,
      `"${a.headline.replace(/"/g, '""')}"`,
      `"${a.primaryText.replace(/"/g, '""')}"`,
      `"${a.callToAction}"`,
      `"${a.creativeBrief.format}"`,
      `"${a.creativeBrief.visualHook.replace(/"/g, '""')}"`,
      `"${a.creativeBrief.onScreenText.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${brandName.replace(/\s+/g, "_")}_Ad_Matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" /> High-Ticket Marketing Automation #3
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Competitor Ad Spy & Multi-Angle Copywriting Matrix
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Engineers battle-tested direct response ad copy, counter-competitor hooks, and video briefs across 4 psychological angles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-500 font-mono">STANDALONE VALUE</p>
            <p className="text-lg font-bold text-emerald-400">$600 - $900</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Config Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> Campaign Input Signals
              </h2>
              
              {/* Presets */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setBrandName(PRESET_DTC.brandName);
                    setNiche(PRESET_DTC.niche);
                    setProductDescription(PRESET_DTC.productDescription);
                    setCompetitorAngle(PRESET_DTC.competitorAngle);
                    setTargetAudience(PRESET_DTC.targetAudience);
                  }}
                  className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                >
                  DTC Brand
                </button>
                <button
                  onClick={() => {
                    setBrandName(PRESET_B2B.brandName);
                    setNiche(PRESET_B2B.niche);
                    setProductDescription(PRESET_B2B.productDescription);
                    setCompetitorAngle(PRESET_B2B.competitorAngle);
                    setTargetAudience(PRESET_B2B.targetAudience);
                  }}
                  className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                >
                  B2B SaaS
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Brand / Product Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Niche / Industry</label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Core Value Proposition / Mechanism</label>
                <textarea
                  rows={3}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Competitor Vulnerability / Ad Clichés</label>
                <textarea
                  rows={2}
                  value={competitorAngle}
                  onChange={(e) => setCompetitorAngle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Persona</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/30 text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Synthesizing Creative Matrix...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Ad Angles
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Multi-Angle Ad Angles ({angles.length})
            </h2>

            {angles.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Export CSV Sheet
              </button>
            )}
          </div>

          {angles.length === 0 && !loading && (
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center">
              <Zap className="w-10 h-10 text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-400">No ad angles generated yet</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select a preset or enter your client details and click "Generate Ad Angles" to build AIDA, PAS, and UGC angles.
              </p>
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-1/4" />
                  <div className="h-6 bg-slate-800 rounded w-3/4" />
                  <div className="h-16 bg-slate-800 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {angles.map((angle, idx) => (
            <div 
              key={idx} 
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl transition space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    angle.framework === "AIDA" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    angle.framework === "PAS" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    angle.framework === "Hook-Story-Offer" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {angle.framework}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Target className="w-3 h-3 text-slate-500" /> {angle.targetPainPoint}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyText(`${angle.headline}\n\n${angle.primaryText}\n\nCTA: ${angle.callToAction}`, idx)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 transition"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Ad Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Headline */}
              <div>
                <p className="text-[11px] font-mono text-slate-500 uppercase">Click Headline</p>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">{angle.headline}</h3>
              </div>

              {/* Primary Text */}
              <div>
                <p className="text-[11px] font-mono text-slate-500 uppercase">Primary Copy</p>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed mt-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  {angle.primaryText}
                </p>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-mono">Suggested CTA:</span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  {angle.callToAction}
                </span>
              </div>

              {/* Visual Creative Brief */}
              <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
                  <Video className="w-3.5 h-3.5" /> Creative Brief (For Designer / Editor)
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Format</span>
                    <span className="font-medium">{angle.creativeBrief.format}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Text Overlay</span>
                    <span className="font-medium text-emerald-300">"{angle.creativeBrief.onScreenText}"</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono mt-1">0-3s Visual Hook Action</span>
                  <p className="text-slate-400 text-[11px] italic mt-0.5">{angle.creativeBrief.visualHook}</p>
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}