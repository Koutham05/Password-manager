import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  KeyRound, 
  FolderTree, 
  Star, 
  ShieldAlert, 
  Wand2, 
  Puzzle, 
  Users, 
  RefreshCw, 
  Settings, 
  Trash2, 
  Lock, 
  Sun, 
  Moon, 
  Check 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLock, stats, theme, toggleTheme }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vault', label: 'All Passwords', icon: KeyRound, count: stats?.totalPasswords },
    { id: 'categories', label: 'Categories', icon: FolderTree, count: stats?.categoriesCount },
    { id: 'favorites', label: 'Favorites', icon: Star, count: stats?.favorites },
    { id: 'security', label: 'Security Center', icon: ShieldAlert, badge: stats?.weakCount ? `${stats.weakCount}` : null },
    { id: 'generator', label: 'Password Generator', icon: Wand2 },
    { id: 'extension', label: 'Extension & Auto-Fill', icon: Puzzle },
    { id: 'sharing', label: 'Sharing & Emergency', icon: Users },
    { id: 'sync', label: 'E2E Cloud Sync', icon: RefreshCw },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'trash', label: 'Trash', icon: Trash2, count: stats?.trashCount || 0 }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 flex flex-col justify-between p-4 select-none shrink-0 text-slate-300">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-3 py-3 mb-4 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white tracking-tight uppercase">PASSWORD MANAGER</h1>
            <p className="text-[10px] text-blue-400 font-medium">Secure. Simple. Protected.</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Theme Switcher & Lock Button */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        {/* Theme Toggle */}
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1">
          <button
            onClick={() => theme !== 'light' && toggleTheme()}
            className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              theme === 'light' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
          <button
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              theme === 'dark' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </div>

        {/* Lock Vault */}
        <button
          onClick={onLock}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-slate-300 hover:text-rose-400 border border-slate-700/60 font-medium text-xs transition-all"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Lock Vault</span>
        </button>
      </div>
    </aside>
  );
}
