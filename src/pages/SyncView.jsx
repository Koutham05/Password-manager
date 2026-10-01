import React, { useState, useEffect } from 'react';
import { RefreshCw, Smartphone, Laptop, ShieldCheck, CheckCircle2, Server } from 'lucide-react';

export default function SyncView() {
  const [syncStatus, setSyncStatus] = useState('Connected (Encrypted WebSocket)');
  const [devices, setDevices] = useState([
    { id: 1, name: 'MacBook Pro 16"', type: 'DESKTOP', lastSync: 'Just now', status: 'ACTIVE' },
    { id: 2, name: 'iPhone 15 Pro', type: 'MOBILE', lastSync: '5 mins ago', status: 'ACTIVE' }
  ]);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <RefreshCw className="w-7 h-7 text-emerald-400" />
          <span>Multi-Device E2E Cloud Sync</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Real-time zero-knowledge database synchronization over encrypted WebSockets
        </p>
      </div>

      {/* Sync Status Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Sync Status: {syncStatus}</h3>
            <p className="text-xs text-emerald-400/80">End-to-End Encrypted (Zero Plaintext Leakage)</p>
          </div>
        </div>

        <button
          onClick={() => setSyncStatus('Syncing...')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Now</span>
        </button>
      </div>

      {/* Connected Devices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-400" />
          <span>Synchronized Device Nodes</span>
        </h3>

        <div className="divide-y divide-slate-800">
          {devices.map((d) => (
            <div key={d.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {d.type === 'MOBILE' ? (
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Laptop className="w-5 h-5 text-blue-400" />
                )}
                <div>
                  <span className="font-semibold text-white block">{d.name}</span>
                  <span className="text-slate-400">Last Synced: {d.lastSync}</span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
