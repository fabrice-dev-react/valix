"use client";

import { Suspense } from "react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Check, Loader } from "lucide-react";

type Profile = {
  name: string;
  email: string;
};

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const { data: session, status: sessionStatus } = useSession();
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [name, setName] = useState("");

  useEffect(() => {
    setName(session?.user?.name || "");
    setLoaded(true);
  }, [session]);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setError(null);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3000);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to save");
      }
      showNotice("Saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (sessionStatus === "loading" || !loaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">One moment</span>
        </div>
      </div>
    );
  }

  const field = "mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-signal/30 focus:border-signal transition-all";

  return (
    <div>
      <div className="pt-2 lg:pt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-dark font-semibold">
          Settings
        </p>
        <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink">Settings</h1>
        <p className="mt-3 text-[15px] text-ink-soft max-w-md">
          Manage your account details.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-paper p-6 sm:p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-[16px] font-bold text-ink">Profile</h2>
            <p className="mt-1 text-[13px] text-ink-soft">Your basic account information.</p>
          </div>
          <div>
            <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">Name</label>
            <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft font-semibold">Email</label>
            <input className={`${field} opacity-60 cursor-not-allowed`} value={session?.user?.email || ""} disabled />
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
            <div className="text-[13px]">
              {error ? (
                <span className="text-signal-dark">{error}</span>
              ) : notice ? (
                <span className="text-moss inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" />{notice}</span>
              ) : (
                <span className="text-ink-soft">Update your profile information.</span>
              )}
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-signal text-white text-[14px] font-semibold px-6 py-2.5 hover:bg-signal-dark transition-colors disabled:opacity-60"
            >
              {saving && <Loader className="w-4 h-4 animate-spin" />}
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
