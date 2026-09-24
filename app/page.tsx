"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  SlidersHorizontal, 
  Mail, 
  RefreshCw,
  Layers
} from "lucide-react";

interface OutreachStep {
  step: number;
  title: string;
  subjects: string[];
  body: string;
  strategicRationale: string;
}

interface AuditSummary {
  primaryBottleneck: string;
  financialImpact: string;
  auditHealthScore: number;
}

const PRESET_DTC = {
  companyName: "Novara Aesthetics",
  websiteUrl: "novara-aesthetics.example.com",
  niche: "E-Commerce / Skincare DTC",
  prospectRole: "Founder / Head of Growth",
  detectedLeaks: [
    "Meta Pixel missing Conversion API (CAPI) server-side tracking (losing 25% purchase signals)",
    "Mobile Page Speed: Largest Contentful Paint (LCP) is 4.8s on product pages",
    "Missing sticky 'Add to Bag' button on mobile viewport",
    "No post-purchase SMS or loyalty retention trigger"
  ]
};

const PRESET_B2B = {
  companyName: "HyperLeads CRM",
  websiteUrl: "hyperleadscrm.example.io",
  niche: "B2B SaaS / Enterprise Software",
  prospectRole: "Chief Marketing Officer (CMO)",
  detectedLeaks: [
    "Above-the-fold CTA requires 7-field form instead of frictionless work email capture",
    "No LinkedIn Insight Tag detected (wasting retargeting audience pools)",
    "Customer case studies lack verifiable revenue metrics or ROI proof",
    "Pricing page lacks an interactive tier calculator or FAQ accordion"
  ]
};

export default function OutreachPipelinePage() {
  const [companyName, setCompanyName] = useState(PRESET_DTC.companyName);
  const [websiteUrl, setWebsiteUrl] = useState(PRESET_DTC.websiteUrl);
  const [niche, setNiche] = useState(PRESET_DTC.niche);
  const [prospectRole, setProspectRole] = useState(PRESET_DTC.prospectRole);
  const [leaksInput, setLeaksInput] = useState(PRESET_DTC.detectedLeaks.join("\n"));

  const [loading, setLoading] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState(0);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [sequence, setSequence] = useState<OutreachStep[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const leaksArray = leaksInput.split("\n").filter((l) => l.trim().length > 0);
      const res = await fetch("/api/generate-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          websiteUrl,
          niche,
          prospectRole,
          detectedLeaks: leaksArray,
        }),
      });

      const data = await res.json();
      if (res.ok && data.sequence) {
        setSummary(data.auditSummary);
        setSequence(data.sequence);
        setActiveStepTab(0);
      } else {
        alert("Failed to generate: " + (data.error || "Unknown error"));
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
    if (!sequence.length) return;
    const headers = ["Step", "Title", "Subject Line", "Email Body", "Strategy"];
    const rows = sequence.map((s) => [
      `"Step ${s.step}"`,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.subjects[0]?.replace(/"/g, '""') || ""}"`,
      `"${s.body.replace(/"/g, '""')}"`,
      `"${s.strategicRationale.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encoded;
    link.download = `${companyName.replace(/\s+/g, "_")}_Cold_Outreach_Sequence.csv`;
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
            <Sparkles className="w-3.5 h-3.5" /> High-Ticket Marketing Automation #4
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Audit-Driven B2B Cold Outreach Pipeline
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Turns prospect website & ad leaks into hyper-personalized, 3-touch cold email sequences that convert.
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500 font-mono">OUTREACH RETAINER VALUE</p>
          <p className="text-lg font-bold text-emerald-400">$800 - $1,200 / Mo</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Configuration (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> Target Prospect Audit Signals
              </h2>

              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setCompanyName(PRESET_DTC.companyName);
                    setWebsiteUrl(PRESET_DTC.websiteUrl);
                    setNiche(PRESET_DTC.niche);
                    setProspectRole(PRESET_DTC.prospectRole);
                    setLeaksInput(PRESET_DTC.detectedLeaks.join("\n"));
                  }}
                  className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                >
                  DTC Skincare
                </button>
                <button
                  onClick={() => {
                    setCompanyName(PRESET_B2B.companyName);
                    setWebsiteUrl(PRESET_B2B.websiteUrl);
                    setNiche(PRESET_B2B.niche);
                    setProspectRole(PRESET_B2B.prospectRole);
                    setLeaksInput(PRESET_B2B.detectedLeaks.join("\n"));
                  }}
                  className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                >
                  B2B SaaS
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Website URL</label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Persona</label>
                  <input
                    type="text"
                    value={prospectRole}
                    onChange={(e) => setProspectRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Niche / Category</label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Detected Leaks / Audit Friction Points (1 per line)
                </label>
                <textarea
                  rows={4}
                  value={leaksInput}
                  onChange={(e) => setLeaksInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
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
                    Generating Audit Sequence via Groq...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Generate 3-Touch Sequence
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Sequence (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Outreach Campaign Decks
            </h2>

            {sequence.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Export CSV Deck
              </button>
            )}
          </div>

          {/* Audit Health Summary Strip (if available) */}
          {summary && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Audit Health Score</span>
                <span className="text-2xl font-bold font-mono text-amber-400">{summary.auditHealthScore} / 100</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Estimated Revenue Leak</span>
                <span className="text-xs font-medium text-rose-400 block mt-0.5">{summary.financialImpact}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{summary.primaryBottleneck}</span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {sequence.length === 0 && !loading && (
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center">
              <Mail className="w-10 h-10 text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-400">No outreach sequences generated</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Pick a preset or input your prospect's leaks and click "Generate 3-Touch Sequence" to build audit-driven cold emails.
              </p>
            </div>
          )}

          {/* Sequence Tabs & Content */}
          {sequence.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Step Navigation Tabs */}
              <div className="flex border-b border-slate-800 pb-3 gap-2 overflow-x-auto">
                {sequence.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStepTab(idx)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                      activeStepTab === idx
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    Touch {step.step}: {step.step === 1 ? "Audit Hook" : step.step === 2 ? "Case Proof" : "Breakup"}
                  </button>
                ))}
              </div>

              {/* Active Step Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200">
                    {sequence[activeStepTab].title}
                  </h3>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Subject: ${sequence[activeStepTab].subjects[0]}\n\n${sequence[activeStepTab].body}`,
                        `email-${activeStepTab}`
                      )
                    }
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 transition"
                  >
                    {copiedKey === `email-${activeStepTab}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied Email</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Complete Email</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Subject Lines */}
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Tested Subject Lines</span>
                  <div className="space-y-1.5">
                    {sequence[activeStepTab].subjects.map((subj, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 px-3 py-1.5 rounded-lg text-xs text-slate-300 font-mono"
                      >
                        <span>{subj}</span>
                        <button
                          onClick={() => copyToClipboard(subj, `subj-${activeStepTab}-${sIdx}`)}
                          className="text-[11px] text-slate-500 hover:text-slate-300 ml-2"
                        >
                          {copiedKey === `subj-${activeStepTab}-${sIdx}` ? "Copied" : "Copy"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Body */}
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Email Body Copy</span>
                  <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                    {sequence[activeStepTab].body}
                  </div>
                </div>

                {/* Strategic Rationale Box */}
                <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs space-y-1">
                  <span className="text-emerald-400 font-semibold text-[11px] uppercase tracking-wider block">
                    Why This Touch Works
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {sequence[activeStepTab].strategicRationale}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}