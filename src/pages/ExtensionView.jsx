import React from 'react';
import { Puzzle, Download, ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function ExtensionView() {
  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Puzzle className="w-7 h-7 text-blue-400" />
          <span>Browser Extension & Auto-Fill</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Manifest v3 extension for 1-click password auto-fill on Chrome, Edge & Firefox
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Installation Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
          <li>Open your Chrome or Edge browser and navigate to <code className="bg-slate-950 px-2 py-0.5 rounded text-blue-400 font-mono">chrome://extensions</code></li>
          <li>Enable <strong>Developer mode</strong> in the top right corner.</li>
          <li>Click <strong>Load unpacked</strong> and select the directory: <code className="bg-slate-950 px-2 py-0.5 rounded text-blue-400 font-mono">d:/Driv d/Software/Password manager/extension</code></li>
          <li>Navigate to any login page (e.g., GitHub, Netflix) and Aegis will auto-fill your credentials!</li>
        </ol>
      </div>
    </div>
  );
}
