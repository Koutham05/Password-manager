import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  Edit3, 
  FileText, 
  Download, 
  KeyRound, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react';
import { generatePDFReport, generateCSVAuditReport } from '../utils/reportGenerator';

export default function SecurityCenterView({ auditItems, stats, onFixPassword }) {
  const [masterAgeDays, setMasterAgeDays] = useState(42);
  const [masterExpiringDays, setMasterExpiringDays] = useState(90);

  const weakItems = auditItems.filter(i => i.isWeak);
  const reusedItems = auditItems.filter(i => i.isReused);
  const oldItems = auditItems.filter(i => i.isOld);

  const isMasterExpiringSoon = masterAgeDays >= masterExpiringDays - 15;

  const handleExportPDF = () => {
    generatePDFReport(stats, auditItems, masterAgeDays);
  };

  const handleExportCSV = () => {
    generateCSVAuditReport(auditItems, stats);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-rose-500" />
            <span>Security Center & Vault Health Reports</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Automated vault vulnerability scanner, Master Password age policy, and exportable PDF/CSV reports
          </p>
        </div>

        {/* PDF & CSV Report Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Generate PDF Audit Report</span>
          </button>
        </div>
      </div>

      {/* Master Password Expiration Policy Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isMasterExpiringSoon 
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' 
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            isMasterExpiringSoon ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-600/20 text-blue-400'
          }`}>
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Master Password Expiration Status</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Master password was set <span className="font-semibold text-slate-200">{masterAgeDays} days ago</span>. Rotation policy: every {masterExpiringDays} days.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            isMasterExpiringSoon 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            {isMasterExpiringSoon ? 'Rotation Suggested Soon' : 'Password Fresh'}
          </span>
        </div>
      </div>

      {/* Summary Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-semibold uppercase text-slate-400">Security Score</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{stats?.healthScore || 82}%</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              (stats?.healthScore || 82) >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {(stats?.healthScore || 82) >= 80 ? 'Healthy' : 'Needs Review'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-rose-500/30 bg-rose-500/5 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-rose-400">Weak Passwords</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{weakItems.length}</span>
            <span className="text-xs text-rose-400">&lt; 10 chars</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 bg-amber-500/5 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-amber-400">Reused Passwords</span>
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{reusedItems.length}</span>
            <span className="text-xs text-amber-400">Duplicates</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-blue-500/30 bg-blue-500/5 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-blue-400">Outdated Accounts</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{oldItems.length}</span>
            <span className="text-xs text-blue-400">&gt; 90 days</span>
          </div>
        </div>
      </div>

      {/* Vulnerability Audit Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Vulnerability Breakdown</h3>

        {auditItems && auditItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400">
                  <th className="py-3 px-4">Account Title</th>
                  <th className="py-3 px-4">Username / Email</th>
                  <th className="py-3 px-4">Detected Vulnerabilities</th>
                  <th className="py-3 px-4">Password Age</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {auditItems.map((item) => {
                  const hasIssues = item.isWeak || item.isReused || item.isOld;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-100">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                        {item.username || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {item.isWeak && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              Weak Strength
                            </span>
                          )}
                          {item.isReused && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Reused ({item.reusedWith.length} duplicates)
                            </span>
                          )}
                          {item.isOld && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              Outdated (&gt;90d)
                            </span>
                          )}
                          {!hasIssues && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Healthy
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {item.daysOld} days ago
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onFixPassword(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Fix Password</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <KeyRound className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No passwords found to audit.</p>
          </div>
        )}
      </div>
    </div>
  );
}
