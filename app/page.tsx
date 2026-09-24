"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Swords, 
  Copy, 
  Check, 
  Download, 
  SlidersHorizontal, 
  AlertCircle, 
  Crosshair, 
  RefreshCw,
  Zap
} from "lucide-react";

interface CounterAngle {
  angleTitle: string;
  hookHeadline: string;
  bodyCopy: string;
  callToAction: string;
}

interface AnalysisData {
  marketGapAnalysis: string;
  competitorWeaknesses: string[];
  counterAngles: CounterAngle[];
}

const PRESET_ATHLETIC = {
  myBrand: "AuraGlow Naturals",
  targetAudience: "Health-conscious professionals seeking clean morning hydration without sugar crashes",
  competitorName: "HydraBoost Labs",
  competitorAdCopy: "Tired of feeling sluggish? Our electrolyte powder has 10x more electrolytes than sports drinks! Get 30 packets for only $39 today with free shipping. Buy now before stock runs out!"
};

const PRESET_B2B = {
  myBrand: "PipelinePilot AI",
  targetAudience: "B2B SaaS Founders & Heads of Sales struggling with 2% cold email reply rates",
  competitorName: "ColdOutreachMaster",
  competitorAdCopy: "Send 50,000 cold emails per day on autopilot! Our AI blasts thousands of prospects in minutes so your calendar is full. 14-day free trial, no credit card required."
};

export default function CompetitorMatrixPage() {
  const [myBrand, setMyBrand] = useState(PRESET_ATHLETIC.myBrand);
  const [targetAudience, setTargetAudience] = useState(PRESET_ATHLETIC.targetAudience);
  const [competitorName, setCompetitorName] = useState(PRESET_ATHLETIC.competitorName);
  const [competitorAdCopy, setCompetitorAdCopy] = useState(PRESET_ATHLETIC.competitorAdCopy);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          myBrand,
          targetAudience,
          competitorName,
          competitorAdCopy,
        }),
      });

      const json = await res.json();
      if (res.ok && json.counterAngles) {
        setData(json);
      } else {
        alert("Failed to analyze: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportCSV = () => {
    if (!data) return;
    const headers = ["Angle Name", "Hook Headline", "Body Copy", "Call To Action"];
    const rows = data.counterAngles.map((a) => [
      `"${a.angleTitle}"`,
      `"${a.hookHeadline.replace(/"/g, '""')}"`,
      `"${a.bodyCopy.replace(/"/g, '""')}"`,
      `"${a.callToAction.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encoded;
    link.download = `${competitorName.replace(/\s+/g, "_")}_Counter_Attack_Matrix.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" /> High-Ticket Marketing Automation #1
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Competitor Ad Spy & Multi-Angle Copywriting Matrix
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Reverse-engineers competitor ad copy and generates direct-response counter-positioning campaigns via Groq LPU.
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500 font-mono">SPRINT VALUE</p>
          <p className="text-lg font-bold text-indigo-400">$600 - $900 / Sprint</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Competitive Intel Setup
              </h2>

              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setMyBrand(PRESET_ATHLETIC.myBrand);
                    setTargetAudience(PRESET_ATHLETIC.targetAudience);
                    setCompetitorName(PRESET_ATHLETIC.competitorName);
                    setCompetitorAdCopy(PRESET_ATHLETIC.competitorAdCopy);
                  }}
                  className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                >
                  DTC Skincare
                </button>
                <button
                  onClick={() => {
                    setMyBrand(PRESET_B2B.myBrand);
                    setTargetAudience(PRESET_B2B.targetAudience);
                    setCompetitorName(PRESET_B2B.competitorName);
                    setCompetitorAdCopy(PRESET_B2B.competitorAdCopy);
                  }}
                  className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                >
                  B2B SaaS
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Our Brand</label>
                  <input
                    type="text"
                    value={myBrand}
                    onChange={(e) => setMyBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Competitor Name</label>
                  <input
                    type="text"
                    value={competitorName}
                    onChange={(e) => setCompetitorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Customer Persona</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Competitor's Live Ad Copy</label>
                <textarea
                  rows={4}
                  value={competitorAdCopy}
                  onChange={(e) => setCompetitorAdCopy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-[11px]"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-900/30 text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Teardown & Counter-Positioning via Groq...
                  </>
                ) : (
                  <>
                    <Swords className="w-4 h-4" />
                    Generate Counter-Attack Copy Matrix
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-indigo-400" /> Strategic Counter-Attack Angles
            </h2>

            {data && (
              <button
                onClick={handleExportCSV}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                Export Matrix (.CSV)
              </button>
            )}
          </div>

          {!data && !loading && (
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center">
              <Swords className="w-10 h-10 text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-400">No competitor analyzed yet</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Paste competitor copy to diagnose their messaging gaps and generate counter-attack ad angles that win market share.
              </p>
            </div>
          )}

          {data && (
            <div className="space-y-6">
              
              {/* Teardown Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] uppercase font-mono text-indigo-400 font-semibold block">Market Gap Diagnosis</span>
                <p className="text-xs text-slate-200 leading-relaxed">{data.marketGapAnalysis}</p>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Identified Competitor Vulnerabilities</span>
                  <ul className="list-disc list-inside text-xs text-rose-300 space-y-1">
                    {data.competitorWeaknesses.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Counter-Attack Angles */}
              <div className="space-y-4">
                {data.counterAngles.map((angle, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-indigo-400 font-mono flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" /> {angle.angleTitle}
                      </span>
                      <button
                        onClick={() => copyToClipboard(`Hook: "${angle.hookHeadline}"\n\nBody:\n${angle.bodyCopy}\n\nCTA: ${angle.callToAction}`, `angle-${idx}`)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        {copiedKey === `angle-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === `angle-${idx}` ? "Copied" : "Copy Ad"}
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Scroll-Stopping Hook</span>
                        <p className="text-slate-100 font-semibold italic">"{angle.hookHeadline}"</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Direct-Response Body Copy</span>
                        <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          {angle.bodyCopy}
                        </p>
                      </div>

                      <div className="pt-1">
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Recommended CTA</span>
                        <span className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold rounded-lg text-xs mt-1">
                          {angle.callToAction}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}