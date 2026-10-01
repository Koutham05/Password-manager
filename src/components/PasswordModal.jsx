import React, { useState, useEffect } from 'react';
import { X, Wand2, Star, Eye, EyeOff, KeyRound, Globe, User, Mail, Tag, FileText } from 'lucide-react';

export default function PasswordModal({ isOpen, onClose, onSave, categories, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    username: '',
    email: '',
    password: '',
    categoryId: '',
    notes: '',
    tags: '',
    twoFactorSecret: '',
    isFavorite: false
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        url: initialData.url || '',
        username: initialData.username || '',
        email: initialData.email || '',
        password: initialData.password || '',
        categoryId: initialData.categoryId || '',
        notes: initialData.notes || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(',') : (initialData.tags || ''),
        twoFactorSecret: initialData.twoFactorSecret || '',
        isFavorite: initialData.isFavorite || false
      });
    } else {
      setFormData({
        title: '',
        url: '',
        username: '',
        email: '',
        password: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        notes: '',
        tags: '',
        twoFactorSecret: '',
        isFavorite: false
      });
    }
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const generateQuickPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let pass = '';
    for (let i = 0; i < 18; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: pass });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.password) return;
    
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">
                {initialData ? 'Edit Credential' : 'Add New Credential'}
              </h3>
              <p className="text-xs text-slate-400">Encrypted with AES-256-GCM before saving</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Title & Favorite */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Title / App Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. GitHub, Netflix, Chase Bank"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isFavorite: !formData.isFavorite })}
                className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                  formData.isFavorite
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
                title="Mark as Favorite"
              >
                <Star className={`w-5 h-5 ${formData.isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Website URL
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all"
              />
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Username & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="alex_dev"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Password with Generator Button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase text-slate-400">
                Password *
              </label>
              <button
                type="button"
                onClick={generateQuickPassword}
                className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                <span>Generate Strong</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono outline-none transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-slate-500 hover:text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all"
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Tags (Comma Separated)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="personal, dev, crypto"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all"
                />
                <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Secure Notes
            </label>
            <textarea
              rows={3}
              placeholder="Recovery codes, PINs, or security question answers..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl p-3 text-sm text-slate-100 outline-none transition-all resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all"
            >
              {initialData ? 'Save Changes' : 'Encrypt & Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
