import React from 'react';
import { History, Shield, Clock } from 'lucide-react';

export default function AuditLogView({ logs }) {
  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <History className="w-7 h-7 text-indigo-400" />
          <span>Security Audit Trail & History</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Immutable event log tracking all vault access, password decryption, modifications, and backups
        </p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        {logs && logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400">
                  <th className="py-3 px-4">Event Action</th>
                  <th className="py-3 px-4">Details / Target</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-blue-400 font-semibold">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      {log.target || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No audit events logged yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
