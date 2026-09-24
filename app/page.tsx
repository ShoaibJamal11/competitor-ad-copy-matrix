"use client";

import React, { useState } from "react";
import { Sparkles, ShieldAlert, ArrowRight, Zap, Target, Copy, Check } from "lucide-react";

interface CounterAngle {
  angleTitle: string;
  hookHeadline: string;
  bodyCopy: string;
  callToAction: string;
}

interface AnalysisResult {
  marketGapAnalysis: string;
  competitorWeaknesses: string[];
  counterAngles: CounterAngle[];
}

export default function CompetitorMatrixPage() {
  const [myBrand, setMyBrand] = useState("AuraGlow Naturals");
  const [competitorName, setCompetitorName] = useState("HydraBoost Labs");
  const [targetAudience, setTargetAudience] = useState(
    "Health-conscious professionals seeking clean morning hydration without sugar crash"
  );
  const [competitorAdCopy, setCompetitorAdCopy] = useState(
    "Tired of feeling sluggish? Our electrolyte powder has 10x more electrolytes than sports drinks! Get 30 packets for only $39 today with free shipping. Buy now before stock runs out!"
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const loadPreset = (type: "skincare" | "saas") => {
    if (type === "skincare") {
      setMyBrand("AuraGlow Naturals");
      setCompetitorName("HydraBoost Labs");
      setTargetAudience("Health-conscious professionals seeking clean morning hydration without sugar crash");
      setCompetitorAdCopy("Tired of feeling sluggish? Our electrolyte powder has 10x more electrolytes than sports drinks! Get 30 packets for only $39 today with free shipping. Buy now before stock runs out!");
    } else {
      setMyBrand("OmniFlow CRM");
      setCompetitorName("LegacyHub");
      setTargetAudience("B2B Marketing agency owners managing 10+ retainer clients");
      setCompetitorAdCopy("The all-in-one CRM for large enterprise teams. Starting at $800/mo. Request an enterprise demo to speak with our 5-tier sales pipeline team.");
    }
  };

  const handleAnalyze = async () => {
    if (!competitorAdCopy.trim() || loading) return;
    setLoading(true);
    setResult(null);

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

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert("Analysis Error: " + (data.error || "Failed to analyze copy"));
      }
    } catch (err: any) {
      alert("Network Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" /> High-Ticket Marketing Automation #1
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Competitor Ad Spy & Multi-Angle Copy Matrix
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Reverse-engineers competitor ad copy and generates direct-response counter-positioning angles via Groq LPU.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 font-mono">SPRINT VALUE</p>
          <p className="text-lg font-bold text-cyan-400">$600 - $900 / Sprint</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Column */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
              <Target className="w-4 h-4 text-cyan-400" /> Competitive Intel Setup
            </h2>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => loadPreset("skincare")}
                className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 transition"
              >
                DTC Skincare
              </button>
              <button
                type="button"
                onClick={() => loadPreset("saas")}
                className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-violet-300 rounded border border-slate-700 transition"
              >
                B2B SaaS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 mb-1 block">Our Brand</label>
              <input
                type="text"
                value={myBrand}
                onChange={(e) => setMyBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 mb-1 block">Competitor Name</label>
              <input
                type="text"
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 mb-1 block">Target Customer Persona</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 mb-1 block">Competitor's Live Ad Copy</label>
            <textarea
              rows={4}
              value={competitorAdCopy}
              onChange={(e) => setCompetitorAdCopy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition"
          >
            {loading ? (
              <>
                <Zap className="w-4 h-4 animate-spin" /> Teardown & Counter-Positioning via Groq...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Generate Counter-Attack Copy Matrix
              </>
            )}
          </button>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-5">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
            <Zap className="w-4 h-4 text-cyan-400" /> Strategic Counter-Attack Angles
          </h2>

          {!result && !loading && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-12 text-center text-slate-500 text-xs">
              Configure competitive intel on the left and click Generate to run the AI positioning diagnosis.
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Gap Analysis */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-2">
                  <ShieldAlert className="w-4 h-4" /> Market Gap & Competitor Weakness Teardown
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {result.marketGapAnalysis}
                </p>
                {result.competitorWeaknesses && (
                  <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                    {result.competitorWeaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Angles Grid */}
              <div className="space-y-3">
                {result.counterAngles?.map((angle, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        ANGLE #{idx + 1}: {angle.angleTitle}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `${angle.hookHeadline}\n\n${angle.bodyCopy}\n\n${angle.callToAction}`,
                            idx
                          )
                        }
                        className="text-slate-400 hover:text-cyan-400 text-[11px] flex items-center gap-1 transition"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Ad
                          </>
                        )}
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 mb-2">
                      "{angle.hookHeadline}"
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {angle.bodyCopy}
                    </p>
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                      CTA: {angle.callToAction} <ArrowRight className="w-3 h-3" />
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