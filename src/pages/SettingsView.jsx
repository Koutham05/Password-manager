import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Clock, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsView({ settings, onSaveSettings }) {
  const [autoLockMinutes, setAutoLockMinutes] = useState(settings?.auto_lock_minutes || '15');
  const [clipboardClearSeconds, setClipboardClearSeconds] = useState(settings?.clipboard_clear_seconds || '30');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      auto_lock_minutes: autoLockMinutes,
      clipboard_clear_seconds: clipboardClearSeconds
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-blue-400" />
          <span>Application Settings</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure security timeouts, auto-lock rules, and clipboard parameters
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider border-b border-slate-800 pb-3">
          Security & Timeout Policies
        </h3>

        {/* Auto Lock Duration */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-200">
            Auto-Lock Timeout (Minutes)
          </label>
          <p className="text-xs text-slate-400">
            Automatically lock vault memory after inactivity
          </p>
          <select
            value={autoLockMinutes}
            onChange={(e) => setAutoLockMinutes(e.target.value)}
            className="w-full max-w-xs bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none"
          >
            <option value="5">5 Minutes</option>
            <option value="15">15 Minutes (Recommended)</option>
            <option value="30">30 Minutes</option>
            <option value="60">1 Hour</option>
            <option value="0">Never Auto-Lock (Risky)</option>
          </select>
        </div>

        {/* Clipboard Clear Timeout */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-200">
            Clipboard Auto-Clear Timeout (Seconds)
          </label>
          <p className="text-xs text-slate-400">
            Purge copied passwords from system clipboard buffer
          </p>
          <select
            value={clipboardClearSeconds}
            onChange={(e) => setClipboardClearSeconds(e.target.value)}
            className="w-full max-w-xs bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none"
          >
            <option value="15">15 Seconds</option>
            <option value="30">30 Seconds (Default)</option>
            <option value="60">60 Seconds</option>
          </select>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
