"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface OnboardingData {
  websiteUrl: string;
  category: string;
  competitors: string[];
  customCompetitors: string[];
  platforms: string[];
  goals: string[];
  alertFrequency: string;
  alertDelivery: string;
  email: string;
}

interface CustomCompetitor {
  url: string;
  name: string;
  domain: string;
  logoUrl: string;
}

interface Competitor {
  name: string;
  domain: string;
  logoUrl: string;
}

interface AnalysisResult {
  productName: string;
  description: string;
  category: string;
  targetCustomers: string;
  keyFeatures: string[];
  pricing: string;
  competitors: Competitor[];
}

const initialData: OnboardingData = {
  websiteUrl: "",
  category: "",
  competitors: [],
  customCompetitors: [],
  platforms: [],
  goals: [],
  alertFrequency: "",
  alertDelivery: "email",
  email: "",
};

const competitorOptions = [
  { 
    name: "Hubspot", 
    domain: "hubspot.com",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#FF7A59"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">HS</text>
      </svg>
    )
  },
  { 
    name: "Pipedrive", 
    domain: "pipedrive.com",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#00B67A"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">PD</text>
      </svg>
    )
  },
  { 
    name: "Salesforce", 
    domain: "salesforce.com",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#00A1E0"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">SF</text>
      </svg>
    )
  },
  { 
    name: "Zoho CRM", 
    domain: "zoho.com/crm",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#E31937"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Z</text>
      </svg>
    )
  },
  { 
    name: "Freshsales", 
    domain: "freshsales.io",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#FF6B35"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">FS</text>
      </svg>
    )
  },
];

const platformOptions = [
  { 
    id: "g2", 
    name: "G2", 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#5B2C6F"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">G2</text>
      </svg>
    )
  },
  { 
    id: "capterra", 
    name: "Capterra", 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#008060"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">C</text>
      </svg>
    )
  },
  { 
    id: "trustpilot", 
    name: "Trustpilot", 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.4 8.8H21.6L16 13.2L18.4 20L12 15.6L5.6 20L8 13.2L2.4 8.8H9.6L12 2Z" fill="#00B67A"/>
      </svg>
    )
  },
  { 
    id: "google", 
    name: "Google", 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#4285F4"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">G</text>
      </svg>
    )
  },
  { 
    id: "producthunt", 
    name: "Product Hunt", 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#DA552F"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">PH</text>
      </svg>
    )
  },
  { 
    id: "getapp", 
    name: "GetApp", 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1A73E8"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">GA</text>
      </svg>
    )
  },
];

const goalOptions = [
  { id: "weaknesses", label: "Find competitor weaknesses" },
  { id: "features", label: "Improve product features" },
  { id: "marketing", label: "Generate marketing ideas" },
  { id: "positioning", label: "Improve positioning" },
  { id: "unmet", label: "Discover unmet needs" },
];

const frequencyOptions = [
  { id: "realtime", name: "Real-time", description: "Get notified instantly" },
  { id: "daily", name: "Daily digest", description: "Once a day summary" },
  { id: "weekly", name: "Weekly report", description: "Once a week roundup" },
];

const deliveryOptions = [
  { 
    id: "email", 
    name: "Email", 
    description: "Send to your inbox",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#3B82F6">
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#3B82F6"/>
        <path d="M22 6L12 13L2 6" stroke="white" strokeWidth="2" fill="none"/>
      </svg>
    )
  },
  { 
    id: "slack", 
    name: "Slack", 
    description: "Connect your workspace",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" fill="#E01E5A"/>
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#E01E5A"/>
        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" fill="#36C5F0"/>
        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" fill="#36C5F0"/>
        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" fill="#2EB67D"/>
        <path d="M14 20.5V19h1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z" fill="#2EB67D"/>
        <path d="M10 9.5c0 .83-.67 1.5-1.5 1.5h-5C2.67 11 2 10.33 2 9.5S2.67 8 3.5 8h5c.83 0 1.5.67 1.5 1.5z" fill="#ECB22E"/>
        <path d="M10 3.5V5H8.5C7.67 5 7 4.33 7 3.5S7.67 2 8.5 2 10 2.67 10 3.5z" fill="#ECB22E"/>
      </svg>
    )
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [customCompetitor, setCustomCompetitor] = useState("");
  const [customCompetitorsWithDetails, setCustomCompetitorsWithDetails] = useState<CustomCompetitor[]>([]);
  const [isAnalyzingCustom, setIsAnalyzingCustom] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const isPaid = session?.user?.plan === "starter" || session?.user?.plan === "growth";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !isPaid) {
      router.push("/pricing");
    }
  }, [status, router, isPaid]);

  if (status === "loading" || status === "unauthenticated" || !isPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const dynamicCompetitorOptions = analysisResult?.competitors?.map((comp, index) => ({
    name: comp.name,
    domain: comp.domain,
    logoUrl: comp.logoUrl,
    icon: (
      <img 
        src={comp.logoUrl} 
        alt={comp.name}
        className="w-8 h-8 object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.nextElementSibling?.classList.remove('hidden');
        }}
      />
    ),
    fallbackIcon: (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <span className="text-white text-xs font-bold">{comp.name.slice(0, 2).toUpperCase()}</span>
      </div>
    )
  })) || [];
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 7;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users/complete-onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            websiteUrl: data.websiteUrl,
            productName: analysisResult?.productName,
            productDescription: analysisResult?.description,
            category: analysisResult?.category,
            targetCustomers: analysisResult?.targetCustomers,
            keyFeatures: analysisResult?.keyFeatures,
            pricing: analysisResult?.pricing,
            competitors: data.competitors,
            customCompetitors: customCompetitorsWithDetails.map(c => ({ name: c.name, url: c.url, domain: c.domain })),
            platforms: data.platforms,
            goals: data.goals,
            alertFrequency: data.alertFrequency,
            alertDelivery: data.alertDelivery,
            email: data.email,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to save onboarding data");
        }

        setTimeout(() => {
          router.push("/login?from_onboarding=1");
        }, 500);
      } catch (error) {
        console.error("Error saving onboarding:", error);
        alert("Failed to save your data. Please try again.");
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return analysisResult !== null;
      case 2:
        return data.competitors.length + data.customCompetitors.length > 0;
      case 3:
        return data.platforms.length > 0;
      case 4:
        return data.goals.length > 0;
      case 5:
        return data.alertDelivery === "slack" || (data.alertDelivery === "email" && data.email.includes("@") && data.email.includes("."));
      case 6:
        return data.alertFrequency !== "";
      default:
        return true;
    }
  };

  const handleAnalyze = async () => {
    if (!data.websiteUrl.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.websiteUrl }),
      });
      
      if (!response.ok) {
        throw new Error("Analysis failed");
      }
      
      const result = await response.json();
      setAnalysisResult(result);
      setData({ ...data, category: result.category });
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Failed to analyze website. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleCompetitor = (competitor: string) => {
    if (data.competitors.includes(competitor)) {
      setData({ ...data, competitors: data.competitors.filter(c => c !== competitor) });
    } else {
      setData({ ...data, competitors: [...data.competitors, competitor] });
    }
  };

  const addCustomCompetitor = async () => {
    if (!customCompetitor.trim()) return;
    
    const exists = data.customCompetitors.includes(customCompetitor.trim()) || 
                   customCompetitorsWithDetails.some(c => c.url === customCompetitor.trim());
    if (exists) return;
    
    setIsAnalyzingCustom(true);
    
    try {
      const response = await fetch("/api/analyze-competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: customCompetitor.trim() }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze competitor");
      }
      
      const competitorInfo = await response.json();
      
      const newCustomCompetitor: CustomCompetitor = {
        url: customCompetitor.trim(),
        name: competitorInfo.name || extractDomainFromUrl(customCompetitor.trim()),
        domain: competitorInfo.domain || extractDomainFromUrl(customCompetitor.trim()),
        logoUrl: competitorInfo.logoUrl || `https://logo.clearbit.com/${extractDomainFromUrl(customCompetitor.trim())}`,
      };
      
      setCustomCompetitorsWithDetails([...customCompetitorsWithDetails, newCustomCompetitor]);
      setData({ ...data, customCompetitors: [...data.customCompetitors, competitorInfo.name] });
      setCustomCompetitor("");
    } catch (error) {
      console.error("Error analyzing competitor:", error);
      const domain = extractDomainFromUrl(customCompetitor.trim());
      const newCustomCompetitor: CustomCompetitor = {
        url: customCompetitor.trim(),
        name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
        domain: domain,
        logoUrl: `https://logo.clearbit.com/${domain}`,
      };
      setCustomCompetitorsWithDetails([...customCompetitorsWithDetails, newCustomCompetitor]);
      setData({ ...data, customCompetitors: [...data.customCompetitors, newCustomCompetitor.name] });
      setCustomCompetitor("");
    } finally {
      setIsAnalyzingCustom(false);
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

  const togglePlatform = (platform: string) => {
    if (data.platforms.includes(platform)) {
      setData({ ...data, platforms: data.platforms.filter(p => p !== platform) });
    } else {
      setData({ ...data, platforms: [...data.platforms, platform] });
    }
  };

  const toggleGoal = (goal: string) => {
    if (data.goals.includes(goal)) {
      setData({ ...data, goals: data.goals.filter(g => g !== goal) });
    } else {
      setData({ ...data, goals: [...data.goals, goal] });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-[80%] bg-white rounded" style={{ height: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Progress Bar - Fixed at top */}
        <div className="shrink-0" style={{ padding: "1.5rem 1.5rem 1rem" }}>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
          </div>
          <p className="text-slate-500 text-sm mt-2">Step {currentStep} of {totalSteps}</p>
        </div>

        {/* Scrollable Content - Middle */}
        <div className="flex-1 overflow-y-auto" style={{ padding: "0 1.5rem" }}>
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #a1a1a1;
            }
            @keyframes progress {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .animate-progress {
              animation: progress 1.5s ease-in-out infinite;
            }
          `}</style>

          {/* Step 1: Website URL */}
          {currentStep === 1 && (
            <div style={{ padding: "1.5rem 0" }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">What&apos;s your website?</h2>
                <p className="text-slate-500">Enter your website URL to analyze</p>
              </div>
              
              {!analysisResult ? (
                <div className="max-w-lg mx-auto">
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      value={data.websiteUrl} 
                      onChange={(e) => setData({ ...data, websiteUrl: e.target.value })} 
                      placeholder="https://yourproduct.com" 
                      className="flex-1 px-4 py-3 rounded border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500" 
                    />
                    <button 
                      onClick={handleAnalyze} 
                      disabled={!data.websiteUrl.trim() || isAnalyzing}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded hover:opacity-90 disabled:opacity-50"
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyse"}
                    </button>
                  </div>
                  {isAnalyzing && (
                    <div className="mt-4 text-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-slate-500 text-sm">Analyzing your website...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <div className="p-6 rounded-lg border border-green-200 bg-green-50 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-700 font-bold text-lg">Analysis Complete!</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-green-800 font-bold text-xl mb-1">{analysisResult.productName}</h3>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">{analysisResult.category}</span>
                      </div>
                      <p className="text-green-700 text-sm">{analysisResult.description}</p>
                      
                      <div className="border-t border-green-200 pt-3">
                        <h4 className="text-green-800 font-semibold text-sm mb-2">Target Customers</h4>
                        <p className="text-green-600 text-sm">{analysisResult.targetCustomers}</p>
                      </div>
                      
                      <div className="border-t border-green-200 pt-3">
                        <h4 className="text-green-800 font-semibold text-sm mb-2">Key Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.keyFeatures.map((feature, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white text-green-700 text-xs rounded border border-green-200">{feature}</span>
                          ))}
                        </div>
                      </div>
                      
                      {analysisResult.pricing && analysisResult.pricing !== "Not specified" && (
                        <div className="border-t border-green-200 pt-3">
                          <h4 className="text-green-800 font-semibold text-sm mb-1">Pricing</h4>
                          <p className="text-green-600 text-sm">{analysisResult.pricing}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm text-center">We found {analysisResult.competitors.length} potential competitors for you. Select the ones you want to monitor.</p>
                </div>
              )}
            </div>
          )}

{/* Step 2: Competitors */}
          {currentStep === 2 && (
            <div style={{ padding: "1.5rem 0" }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Who are your competitors?</h2>
                <p className="text-slate-500">Select the competitors you want to monitor</p>
              </div>
              
              <div className="max-w-md mx-auto mb-8">
                <label className="block text-slate-700 text-lg font-bold mb-2">Add custom competitor</label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    value={customCompetitor} 
                    onChange={(e) => setCustomCompetitor(e.target.value)} 
                    placeholder="https://competitor.com" 
                    className="flex-1 px-4 py-2 rounded border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500" 
                  />
                  <button 
                    onClick={addCustomCompetitor} 
                    disabled={!customCompetitor.trim() || isAnalyzingCustom}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded hover:opacity-90 disabled:opacity-50"
                  >
                    {isAnalyzingCustom ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
              
              {customCompetitorsWithDetails.length > 0 && (
                <div className="mb-8">
                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    <div className="w-full" style={{ maxWidth: "900px" }}>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {customCompetitorsWithDetails.map((competitor) => (
                          <button key={competitor.url} onClick={() => toggleCompetitor(competitor.name)} className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded border-2 transition-all min-h-[100px] ${data.competitors.includes(competitor.name) ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}>
                            <span className="text-slate-800 font-semibold whitespace-nowrap">{competitor.name}</span>
                            <span className="text-xs text-slate-500">{competitor.domain}</span>
                            {data.competitors.includes(competitor.name) && (
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap justify-center gap-3">
                <div className="w-full" style={{ maxWidth: "900px" }}>
                  {dynamicCompetitorOptions.length > 0 && (
                    <p className="text-slate-500 text-sm text-center mb-4">Suggested competitors</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {dynamicCompetitorOptions.map((competitor) => (
                      <button key={competitor.name} onClick={() => toggleCompetitor(competitor.name)} className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded border-2 transition-all min-h-[100px] ${data.competitors.includes(competitor.name) ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}>
                        <span className="text-slate-800 font-semibold whitespace-nowrap">{competitor.name}</span>
                        <span className="text-xs text-slate-500">{competitor.domain}</span>
                        {data.competitors.includes(competitor.name) && (
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Platforms */}
          {currentStep === 3 && (
            <div style={{ padding: "1.5rem 0" }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Where should we monitor reviews?</h2>
                <p className="text-slate-500">Select the platforms to track</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {[0, 1, 2].map((rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-3 w-full" style={{ maxWidth: "600px" }}>
                    {platformOptions.slice(rowIndex * 3, rowIndex * 3 + 3).map((platform) => (
                      <button key={platform.id} onClick={() => togglePlatform(platform.id)} className={`flex-1 flex items-center justify-center gap-3 px-4 py-4 rounded border-2 transition-all min-h-[64px] min-w-[160px] ${data.platforms.includes(platform.id) ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}>
                        {platform.icon}
                        <span className="text-slate-800 font-semibold whitespace-nowrap">{platform.name}</span>
                        {data.platforms.includes(platform.id) && (
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {currentStep === 4 && (
            <div style={{ padding: "1.5rem 0" }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">What do you want to achieve?</h2>
                <p className="text-slate-500">Select all that apply</p>
              </div>
              <div className="max-w-lg mx-auto space-y-3">
                {goalOptions.map((goal) => (
                  <button key={goal.id} onClick={() => toggleGoal(goal.id)} className={`w-full p-4 rounded border-2 text-left transition-all flex items-center gap-3 ${data.goals.includes(goal.id) ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${data.goals.includes(goal.id) ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                      {data.goals.includes(goal.id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`font-medium ${data.goals.includes(goal.id) ? "text-blue-700" : "text-slate-700"}`}>{goal.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Delivery Method */}
          {currentStep === 5 && (
            <div style={{ padding: "1.5rem 0" }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">How should we notify you?</h2>
                <p className="text-slate-500">Choose your delivery method</p>
              </div>
              <div className="flex gap-4 max-w-md mx-auto">
                {deliveryOptions.map((option) => (
                  <button 
                    key={option.id} 
                    onClick={() => option.id === "slack" ? null : setData({ ...data, alertDelivery: option.id })} 
                    disabled={option.id === "slack"}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 px-4 py-4 rounded border-2 text-center transition-all min-h-[100px] ${option.id === "slack" ? "opacity-50 cursor-not-allowed border-slate-100 bg-slate-50" : data.alertDelivery === option.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    {option.icon}
                    <span className="text-slate-800 font-bold">{option.name}</span>
                    <span className="text-slate-500 text-xs">{option.id === "slack" ? "Coming soon" : option.description}</span>
                    {data.alertDelivery === option.id && option.id !== "slack" && (
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    )}
                  </button>
                ))}
              </div>
              {data.alertDelivery === "email" && (
                <div className="max-w-md mx-auto mt-4">
                  <label className="block text-slate-700 text-sm font-medium mb-2">Email address</label>
                  <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="you@company.com" className="w-full px-4 py-3 rounded border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500" />
                </div>
              )}
            </div>
          )}

          {/* Step 6: Frequency */}
          {currentStep === 6 && (
            <div style={{ padding: "1.5rem 0" }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">How often should we report?</h2>
                <p className="text-slate-500">Choose your preferred frequency</p>
              </div>
              <div className="max-w-lg mx-auto space-y-3">
                {frequencyOptions.map((option) => (
                  <button key={option.id} onClick={() => setData({ ...data, alertFrequency: option.id })} className={`w-full p-4 rounded border-2 text-left transition-all flex items-center gap-3 ${data.alertFrequency === option.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${data.alertFrequency === option.id ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                      {data.alertFrequency === option.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <span className={`font-medium block ${data.alertFrequency === option.id ? "text-blue-700" : "text-slate-700"}`}>{option.name}</span>
                      <span className="text-slate-500 text-sm">{option.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Summary */}
          {currentStep === 7 && (
            <div style={{ padding: "1.5rem 0" }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">You&apos;re all set 🎉</h2>
              </div>
              <div className="max-w-lg mx-auto">
                <div className="p-5 rounded border border-slate-200 bg-slate-50 mb-5">
                  <h3 className="text-slate-800 font-semibold mb-4">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Website</span><span className="text-slate-800">{data.websiteUrl}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Competitors</span><span className="text-slate-800">{data.competitors.length + data.customCompetitors.length}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Platforms</span><span className="text-slate-800">{data.platforms.length}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Goals</span><span className="text-slate-800">{data.goals.length} selected</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Delivery</span><span className="text-slate-800">{deliveryOptions.find(d => d.id === data.alertDelivery)?.name}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Frequency</span><span className="text-slate-800">{frequencyOptions.find(f => f.id === data.alertFrequency)?.name}</span></div>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full bg-blue-500 rounded-full transition-all duration-300 ${isLoading ? "w-1/2 animate-pulse" : "w-full"}`}></div>
                  </div>
                  <p className="text-slate-500 text-sm text-center mt-2">{isLoading ? "Setting up your dashboard..." : "First scan in progress..."}</p>
                </div>
                <button onClick={handleNext} disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded hover:opacity-90 flex items-center justify-center gap-2">
                  {isLoading && (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isLoading ? "Setting up..." : "Complete setup"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons - Fixed at bottom */}
        <div className="shrink-0" style={{ padding: "1rem 1.5rem 1.5rem" }}>
          {currentStep < 7 && currentStep !== 1 && (
            <div className="flex justify-between">
              <button onClick={handleBack} className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded hover:bg-slate-50">Back</button>
              <button onClick={handleNext} disabled={!validateStep(currentStep)} className={`px-8 py-2.5 rounded font-medium transition-all ${validateStep(currentStep) ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
                {currentStep === totalSteps ? "Complete" : "Continue"}
              </button>
            </div>
          )}
          {currentStep === 1 && (
            <div className="flex justify-end">
              <button onClick={handleNext} disabled={!validateStep(1)} className={`px-8 py-2.5 rounded font-medium transition-all ${validateStep(1) ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
