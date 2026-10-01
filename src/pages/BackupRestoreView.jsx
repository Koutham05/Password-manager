import React, { useState } from 'react';
import { Archive, Plus, HardDrive, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export default function BackupRestoreView({ backups, onCreateBackup }) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    setSuccessMsg('');
    try {
      await onCreateBackup();
      setSuccessMsg('Encrypted vault snapshot created successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Archive className="w-7 h-7 text-indigo-400" />
            <span>Backup & Recovery Snapshots</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Automated encrypted database backups saved to local system storage
          </p>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>{loading ? 'Creating Snapshot...' : 'Create Backup Snapshot'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Backup History Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-blue-400" />
          <span>Local Backup Archive</span>
        </h3>

        {backups && backups.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400">
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {backups.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-200">
                      {b.filename}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(b.created_at).toLocaleString()}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-300">
                      {(b.size_bytes / 1024).toFixed(2)} KB
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Encrypted</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <Archive className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No backup snapshots created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
