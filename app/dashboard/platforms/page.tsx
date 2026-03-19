"use client";

import React, { useState, useEffect } from "react";
import Skeleton from "@/components/Skeleton";

interface Competitor {
  id: string;
  name: string;
  domain: string;
  rating: number;
}

const allPlatforms = [
  { id: "g2", name: "G2", description: "Software reviews marketplace" },
  { id: "capterra", name: "Capterra", description: "Business software reviews" },
  { id: "trustpilot", name: "Trustpilot", description: "Customer review platform" },
  { id: "google", name: "Google", description: "Business ratings & reviews" },
  { id: "producthunt", name: "Product Hunt", description: "Product discovery platform" },
  { id: "getapp", name: "GetApp", description: "SaaS software reviews" },
  { id: "slashdot", name: "Slashdot", description: "Tech news and reviews" },
  { id: "alternatives", name: "Alternatives", description: "Software alternatives platform" },
  { id: "softwaresuggest", name: "SoftwareSuggest", description: "Software recommendations" },
  { id: "cr", name: "Consumer Reports", description: "Product reviews and ratings" },
  { id: "gartner", name: "Gartner", description: "Tech research and reviews" },
  { id: "trustradius", name: "TrustRadius", description: "B2B software reviews" },
];

export default function PlatformsPage() {
  const [userPlatforms, setUserPlatforms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const response = await fetch("/api/platforms");
      if (response.ok) {
        const data = await response.json();
        setUserPlatforms(data.platforms || []);
      }
    } catch (error) {
      console.error("Error fetching platforms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlatform = async (platformId: string) => {
    const action = userPlatforms.includes(platformId) ? "disable" : "enable";
    
    setIsUpdating(platformId);
    try {
      const response = await fetch("/api/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platformId, action }),
      });

      if (response.ok) {
        if (action === "enable") {
          setUserPlatforms([...userPlatforms, platformId]);
        } else {
          setUserPlatforms(userPlatforms.filter(p => p !== platformId));
        }
      }
    } catch (error) {
      console.error("Error updating platform:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const enabledPlatforms = allPlatforms.filter(p => userPlatforms.includes(p.id));
  const availablePlatforms = allPlatforms.filter(p => !userPlatforms.includes(p.id));

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 border border-slate-200">
                <Skeleton className="w-12 h-12 rounded-full mb-3 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Enabled Platforms */}
      {enabledPlatforms.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Enabled Platforms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enabledPlatforms.map((platform) => (
              <div 
                key={platform.id} 
                className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 mb-3 flex items-center justify-center">
                  <span className="text-2xl">{platform.id === "g2" ? "🟣" : 
                    platform.id === "capterra" ? "🟢" : 
                    platform.id === "trustpilot" ? "⭐" : 
                    platform.id === "google" ? "🔵" : 
                    platform.id === "producthunt" ? "🟠" : 
                    platform.id === "getapp" ? "🟩" : "🔷"}</span>
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-2">
                  Enabled
                </span>
                <h3 className="font-bold text-slate-800 mb-1">{platform.name}</h3>
                <p className="text-slate-500 text-sm">{platform.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Platforms */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Available Platforms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {availablePlatforms.map((platform) => (
            <div 
              key={platform.id} 
              className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <span className="text-2xl">{platform.id === "g2" ? "🟣" : 
                  platform.id === "capterra" ? "🟢" : 
                  platform.id === "trustpilot" ? "⭐" : 
                  platform.id === "google" ? "🔵" : 
                  platform.id === "producthunt" ? "🟠" : 
                  platform.id === "getapp" ? "🟩" : 
                  platform.id === "slashdot" ? "⚫" :
                  platform.id === "alternatives" ? "🔄" :
                  platform.id === "softwaresuggest" ? "💡" :
                  platform.id === "cr" ? "📋" :
                  platform.id === "gartner" ? "📊" :
                  platform.id === "trustradius" ? "✅" : "🔷"}</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{platform.name}</h3>
              <p className="text-slate-500 text-sm mb-3">{platform.description}</p>
              <button 
                onClick={() => togglePlatform(platform.id)}
                disabled={isUpdating === platform.id}
                className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm"
              >
                {isUpdating === platform.id ? "Enabling..." : "Enable"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
