import React from 'react';
import { 
  KeyRound, 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  ArrowUpRight, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle,
  Folder,
  Star
} from 'lucide-react';

export default function DashboardView({ stats, recentItems, onNewPassword, onNavigate, onCopyPassword }) {
  const [copiedId, setCopiedId] = React.useState(null);

  const handleCopy = (id, pass) => {
    onCopyPassword(pass);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Metric Cards Row matching UI Spec Card 04 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Passwords */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Passwords</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{stats?.totalPasswords || 0}</span>
            <span className="text-[10px] text-blue-400 font-medium">All items</span>
          </div>
        </div>

        {/* Strong Passwords */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase">Strong</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">{stats?.strongCount || 0}</span>
            <span className="text-[10px] text-emerald-400 font-medium">High entropy</span>
          </div>
        </div>

        {/* Medium Passwords */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase">Medium</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-400">{stats?.mediumCount || 0}</span>
            <span className="text-[10px] text-amber-400 font-medium">Acceptable</span>
          </div>
        </div>

        {/* Weak Passwords */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase">Weak</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-rose-400">{stats?.weakCount || 0}</span>
            <span className="text-[10px] text-rose-400 font-medium">Action needed</span>
          </div>
        </div>

        {/* Without 2FA */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase">Without 2FA</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-indigo-400">{stats?.without2fa || 0}</span>
            <span className="text-[10px] text-indigo-400 font-medium">No 2FA key</span>
          </div>
        </div>
      </div>

      {/* Analytics Row: Password Strength Donut, Category Distribution, Security Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Password Strength Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Password Strength</h3>
          <div className="flex items-center justify-around">
            {/* Visual Strength Progress Meter */}
            <div className="relative w-28 h-28 rounded-full border-8 border-slate-800 flex items-center justify-center border-t-emerald-400 border-r-amber-400 border-b-rose-400">
              <span className="text-xl font-extrabold text-white">{stats?.totalPasswords || 0}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Strong ({stats?.strongCount || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-400">Medium ({stats?.mediumCount || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="text-slate-400">Weak ({stats?.weakCount || 0})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Category Distribution</h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Social & Apps
              </span>
              <span className="font-semibold text-slate-200">42%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Work & Code
              </span>
              <span className="font-semibold text-slate-200">28%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Finance & Banking
              </span>
              <span className="font-semibold text-slate-200">18%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Other Notes
              </span>
              <span className="font-semibold text-slate-200">12%</span>
            </div>
          </div>
        </div>

        {/* Security Score Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-200">Security Score</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              Good
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-extrabold text-white">{stats?.healthScore || 82}</span>
            <span className="text-sm text-slate-500 font-semibold">/100</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium">Better than last week (+12%)</p>
        </div>
      </div>

      {/* Two Column Section: Recent Passwords Table & Security Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Passwords (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Recent Passwords</h3>
            <button
              onClick={() => onNavigate('vault')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              View All
            </button>
          </div>

          {recentItems && recentItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="pb-2">Account</th>
                    <th className="pb-2">Username</th>
                    <th className="pb-2">Updated</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30">
                      <td className="py-3 font-semibold text-slate-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold uppercase">
                          {item.title.substring(0, 1)}
                        </div>
                        <span>{item.title}</span>
                      </td>
                      <td className="py-3 font-mono text-slate-300">{item.username || item.email || '—'}</td>
                      <td className="py-3 text-slate-400">2 hours ago</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleCopy(item.id, item.password)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                        >
                          {copiedId === item.id ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">No recent credentials added.</div>
          )}
        </div>

        {/* Security Alerts (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Security Alerts</h3>
            <button
              onClick={() => onNavigate('security')}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">{stats?.weakCount || 0} Weak Passwords</span>
                <span className="text-[11px] text-rose-400/80">Susceptible to dictionary attacks</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">{stats?.reusedCount || 0} Reused Passwords</span>
                <span className="text-[11px] text-amber-400/80">Credential stuffing risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
