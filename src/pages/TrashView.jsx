import React from 'react';
import { Trash2, RefreshCw, AlertOctagon } from 'lucide-react';

export default function TrashView({ trashItems, onRestore, onEmptyTrash }) {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Trash2 className="w-7 h-7 text-rose-500" />
            <span>Trash / Soft Deleted Items</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Deleted items are moved to trash and permanently purged after 30 days
          </p>
        </div>

        {trashItems && trashItems.length > 0 && (
          <button
            onClick={onEmptyTrash}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Empty Trash</span>
          </button>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        {trashItems && trashItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="pb-3 px-4">Title</th>
                  <th className="pb-3 px-4">Username</th>
                  <th className="pb-3 px-4">Deleted On</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {trashItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-semibold text-slate-100">{item.title}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{item.username || '—'}</td>
                    <td className="py-3.5 px-4 text-slate-400">May 10, 2026</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onRestore(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 text-xs">
            Trash is currently empty.
          </div>
        )}
      </div>
    </div>
  );
}
