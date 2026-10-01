import React from 'react';
import { Search, Plus, Wand2, ShieldCheck } from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery, onNewPassword, onOpenGenerator }) {
  return (
    <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-30">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search logins, notes, URLs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-1.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenGenerator}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-all"
        >
          <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Generator</span>
        </button>

        <button
          onClick={onNewPassword}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Password</span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Vault Unlocked</span>
        </div>
      </div>
    </header>
  );
}
