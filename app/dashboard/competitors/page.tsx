"use client";

import React, { useState, useEffect } from "react";
import Skeleton from "@/components/Skeleton";

interface Competitor {
  id: string;
  name: string;
  domain: string;
  rating: number;
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customCompetitor, setCustomCompetitor] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      const response = await fetch("/api/competitors");
      if (response.ok) {
        const data = await response.json();
        setCompetitors(data.competitors || []);
      }
    } catch (error) {
      console.error("Error fetching competitors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractDomainFromUrl = (url: string): string => {
    try {
      const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
      const urlObj = new URL(cleanUrl);
      return urlObj.hostname.replace(/^www\./, "");
    } catch {
      return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    }
  };

  const handleAddCompetitor = async () => {
    if (!customCompetitor.trim()) return;

    const domain = extractDomainFromUrl(customCompetitor.trim());
    const exists = competitors.some(c => c.domain === domain);
    if (exists) {
      setShowAddForm(false);
      setCustomCompetitor("");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze-competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: customCompetitor.trim() }),
      });

      let competitorName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

      if (response.ok) {
        const competitorInfo = await response.json();
        if (competitorInfo.name) {
          competitorName = competitorInfo.name;
        }
      }

      const newCompetitor: Competitor = {
        id: domain.replace(/\./g, "-"),
        name: competitorName,
        domain: domain,
        rating: 3.5 + Math.random() * 1.5,
      };

      const saveResponse = await fetch("/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: competitorName,
          url: customCompetitor.trim(),
          domain: domain
        }),
      });

      if (saveResponse.ok) {
        setCompetitors([...competitors, newCompetitor]);
      }
    } catch {
      const newCompetitor: Competitor = {
        id: domain.replace(/\./g, "-"),
        name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
        domain: domain,
        rating: 3.5 + Math.random() * 1.5,
      };
      setCompetitors([...competitors, newCompetitor]);
    } finally {
      setIsAnalyzing(false);
      setShowAddForm(false);
      setCustomCompetitor("");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg p-3 border border-slate-200">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Your competitors</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Competitor
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">Add Competitor</h3>
              <button 
                onClick={() => { setShowAddForm(false); setCustomCompetitor(""); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-2">
              <input 
                type="url" 
                value={customCompetitor} 
                onChange={(e) => setCustomCompetitor(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleAddCompetitor()}
                placeholder="https://competitor.com" 
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 text-sm" 
              />
            </div>
            <p className="text-slate-500 text-xs mb-4">Enter a competitor website URL to add them automatically</p>
            <button 
              onClick={handleAddCompetitor} 
              disabled={!customCompetitor.trim() || isAnalyzing}
              className="w-full py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : "Add Competitor"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {competitors.map((competitor) => (
          <div 
            key={competitor.id} 
            className="bg-white rounded-lg p-3 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm truncate">{competitor.name}</h3>
                <p className="text-slate-400 text-xs truncate">{competitor.domain}</p>
              </div>
              <a 
                href={`https://${competitor.domain}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-xs">{"★".repeat(Math.round(competitor.rating))}</span>
                <span className="text-slate-300 text-xs">{"☆".repeat(5 - Math.round(competitor.rating))}</span>
              </div>
              <span className="text-slate-600 text-xs font-medium">{competitor.rating.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>

      {competitors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm">No competitors added yet. Click "Add Competitor" to get started.</p>
        </div>
      )}
    </div>
  );
}
