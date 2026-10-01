import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MasterPasswordScreen({ isSetup, onAuthenticate }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your master password.');
      return;
    }

    if (isSetup) {
      if (password.length < 8) {
        setError('Master password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Master passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      await onAuthenticate(password);
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/25 mx-auto mb-4">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {isSetup ? 'Create Master Password' : 'Unlock Your Vault'}
          </h2>
          <p className="text-sm text-slate-400 mt-1.5">
            {isSetup 
              ? 'This master password encrypts your entire database with AES-256-GCM and Argon2id.'
              : 'Enter your master password to decrypt and access your passwords.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-slate-100 text-sm outline-none transition-all pr-10 font-mono"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {isSetup && (
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Confirm Master Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-slate-100 text-sm outline-none transition-all pr-10 font-mono"
                />
                <CheckCircle2 className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Decrypting Vault...' : isSetup ? 'Initialize Vault' : 'Unlock Vault'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500">
          <p className="flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Zero-Knowledge Encryption • Offline-First Storage</span>
          </p>
        </div>
      </div>
    </div>
  );
}
