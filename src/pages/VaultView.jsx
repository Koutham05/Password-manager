import React, { useState } from 'react';
import { 
  KeyRound, 
  Search, 
  Star, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Tag, 
  Folder 
} from 'lucide-react';

export default function VaultView({ 
  passwords, 
  categories, 
  searchQuery, 
  onEdit, 
  onDelete, 
  onNewPassword, 
  onCopyPassword 
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id, pass) => {
    onCopyPassword(pass);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtering Logic
  const filteredPasswords = passwords.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.username && item.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.url && item.url.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || String(item.categoryId) === String(selectedCategory);
    const matchesFavorite = !onlyFavorites || item.isFavorite;

    return matchesSearch && matchesCategory && matchesFavorite;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Password Vault</h2>
          <p className="text-sm text-slate-400 mt-1">Manage and access all your encrypted credentials</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              onlyFavorites
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favorites</span>
          </button>

          <button
            onClick={onNewPassword}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Password</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
            selectedCategory === 'ALL'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          All Items ({passwords.length})
        </button>
        {categories.map((cat) => {
          const count = passwords.filter((p) => String(p.categoryId) === String(cat.id)).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(String(cat.id))}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === String(cat.id)
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{cat.name}</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-300">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Credentials Grid */}
      {filteredPasswords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPasswords.map((item) => {
            const isVisible = visiblePasswords[item.id];
            return (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Card Top Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-extrabold text-blue-400 uppercase text-sm shadow-inner">
                        {item.title.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-base leading-tight group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        {item.url && (
                          <a
                            href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 mt-0.5 truncate max-w-[180px]"
                          >
                            <span className="truncate">{item.url.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        )}
                      </div>
                    </div>
                    {item.isFavorite && (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                    )}
                  </div>

                  {/* Username & Category */}
                  <div className="space-y-2 my-4">
                    <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800/80">
                      <span className="text-[10px] font-semibold uppercase text-slate-500 block">Username / Email</span>
                      <span className="text-xs font-mono text-slate-200 select-all block truncate mt-0.5">
                        {item.username || item.email || '—'}
                      </span>
                    </div>

                    {/* Password Field with Hide/Reveal & Copy */}
                    <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800/80 flex items-center justify-between">
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-semibold uppercase text-slate-500 block">Password</span>
                        <span className="text-xs font-mono text-slate-200 block truncate mt-0.5">
                          {isVisible ? item.password : '••••••••••••••••'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePasswordVisibility(item.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                          title={isVisible ? 'Hide Password' : 'Show Password'}
                        >
                          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopy(item.id, item.password)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Copy Password"
                        >
                          {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-slate-400 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {item.categoryName || 'Uncategorized'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                      title="Edit Record"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl text-center border border-slate-800">
          <KeyRound className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No passwords found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No matching credentials for the selected category or search filter.
          </p>
          <button
            onClick={onNewPassword}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Password</span>
          </button>
        </div>
      )}
    </div>
  );
}
