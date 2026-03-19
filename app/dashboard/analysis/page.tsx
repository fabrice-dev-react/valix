"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface ProgressUpdate {
  status: 'loading' | 'platforms' | 'scraping' | 'storing' | 'analyzing' | 'complete' | 'error';
  message: string;
  progress: number;
  step?: number;
  total?: number;
  current?: {
    platform?: string;
    competitor?: string;
    domain?: string;
    found?: number;
  };
  data?: any;
  error?: string;
  totalReviews?: number;
  clustersCreated?: number;
  highPriority?: number;
  mediumPriority?: number;
  lowPriority?: number;
  found?: number;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  loading: (
    <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  platforms: (
    <svg className="w-8 h-8 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  scraping: (
    <svg className="w-8 h-8 text-purple-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  storing: (
    <svg className="w-8 h-8 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  analyzing: (
    <svg className="w-8 h-8 text-cyan-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  complete: (
    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

const STATUS_COLORS: Record<string, string> = {
  loading: 'bg-blue-50 border-blue-200',
  platforms: 'bg-blue-50 border-blue-200',
  scraping: 'bg-purple-50 border-purple-200',
  storing: 'bg-amber-50 border-amber-200',
  analyzing: 'bg-cyan-50 border-cyan-200',
  complete: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
};

export default function AnalysisPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'loading' | 'analyzing' | 'complete' | 'error'>('loading');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [statusType, setStatusType] = useState('loading');
  const [log, setLog] = useState<Array<{ time: string; message: string; type: string }>>([]);
  const [results, setResults] = useState<any>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const startTimeRef = useRef(Date.now());

  const addLog = useCallback((msg: string, type = 'info') => {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    const time = elapsed < 60 ? `${elapsed}s` : `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;
    setLog(prev => [...prev.slice(-20), { time, message: msg, type }]);
  }, []);

  const startAnalysis = useCallback(() => {
    setPhase('analyzing');
    setProgress(0);
    setError(null);
    setLog([]);
    setResults(null);
    startTimeRef.current = Date.now();

    addLog('Connecting to analysis engine...', 'info');

    const eventSource = new EventSource('/api/analysis/stream');
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data: ProgressUpdate = JSON.parse(event.data);

        setProgress(data.progress || 0);
        setMessage(data.message || 'Processing...');
        setStatusType(data.status || 'loading');

        if (data.status === 'complete') {
          setPhase('complete');
          setResults({
            totalReviews: data.totalReviews,
            clustersCreated: data.clustersCreated,
            highPriority: data.highPriority,
            mediumPriority: data.mediumPriority,
            lowPriority: data.lowPriority,
          });
          addLog(`Analysis complete! Found ${data.totalReviews || 0} reviews, created ${data.clustersCreated || 0} clusters`, 'success');
          eventSource.close();

          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else if (data.status === 'error' || data.error) {
          const errorMsg = data.message || data.error || 'Unknown error occurred';
          setPhase('error');
          setError(errorMsg);
          addLog(errorMsg, 'error');
          eventSource.close();
        } else {
          addLog(data.message, data.status === 'scraping' ? 'info' : 'info');
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      if (phase !== 'complete') {
        setPhase('error');
        setError('Connection lost. Please try again.');
        addLog('Connection lost', 'error');
        eventSource.close();
      }
    };
  }, [router, addLog, phase]);

  useEffect(() => {
    startAnalysis();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleRetry = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    startAnalysis();
  };

  const elapsedTime = Math.round((Date.now() - startTimeRef.current) / 1000);
  const elapsedStr = elapsedTime < 60 ? `${elapsedTime}s` : `${Math.floor(elapsedTime / 60)}m ${elapsedTime % 60}s`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${STATUS_COLORS[statusType] || 'bg-blue-50 border-blue-200'} border-2 mb-4`}>
              {STATUS_ICONS[statusType] || STATUS_ICONS.loading}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              {phase === 'complete' ? 'Analysis Complete!' : phase === 'error' ? 'Analysis Failed' : 'Analyzing Reviews'}
            </h1>
            <p className="text-slate-500 text-lg">{message}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-500 mb-2">
              <span>{progress}%</span>
              <span>{elapsedStr}</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out rounded-full ${
                  phase === 'complete' ? 'bg-green-500' :
                  phase === 'error' ? 'bg-red-500' :
                  'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Platforms', icon: '🌐', status: ['platforms', 'scraping', 'storing', 'analyzing', 'complete'].includes(statusType) },
              { label: 'Scraping', icon: '🔍', status: ['scraping', 'storing', 'analyzing', 'complete'].includes(statusType) },
              { label: 'Analyzing', icon: '🧠', status: ['analyzing', 'complete'].includes(statusType) },
              { label: 'Done', icon: '✅', status: phase === 'complete' },
            ].map((item, i) => (
              <div
                key={i}
                className={`text-center p-3 rounded-lg border ${
                  item.status
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-xs font-medium">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Live Log */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Live Progress</span>
              <span className="text-xs text-slate-400">{log.length} updates</span>
            </div>
            <div className="p-4 h-48 overflow-y-auto space-y-1 font-mono text-sm">
              {log.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-slate-400 shrink-0">{entry.time}</span>
                  <span className={`${
                    entry.type === 'error' ? 'text-red-600' :
                    entry.type === 'success' ? 'text-green-600' :
                    'text-slate-600'
                  }`}>{entry.message}</span>
                </div>
              ))}
              {phase === 'analyzing' && (
                <div className="flex gap-3">
                  <span className="text-slate-400 shrink-0">...</span>
                  <span className="text-blue-500 animate-pulse">Waiting for updates...</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Summary */}
          {phase === 'complete' && results && (
            <div className="bg-white rounded-xl border border-green-200 overflow-hidden mb-6">
              <div className="bg-green-50 px-4 py-2 border-b border-green-200">
                <span className="text-sm font-medium text-green-700">Results Summary</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800">{results.totalReviews || 0}</div>
                    <div className="text-xs text-slate-500">Reviews Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800">{results.clustersCreated || 0}</div>
                    <div className="text-xs text-slate-500">Clusters Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{results.highPriority || 0}</div>
                    <div className="text-xs text-slate-500">High Priority</div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 text-center">
                  Redirecting to dashboard in 3 seconds...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {phase === 'error' && error && (
            <div className="bg-white rounded-xl border border-red-200 p-6 text-center mb-6">
              <p className="text-red-600 mb-4">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleGoToDashboard}
                  className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Redirect info */}
          {phase === 'complete' && (
            <p className="text-center text-slate-400 text-sm">
              <button onClick={handleGoToDashboard} className="text-blue-500 hover:underline">
                Go to dashboard now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
