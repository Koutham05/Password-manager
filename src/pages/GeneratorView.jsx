import React, { useState } from 'react';
import { Wand2, Copy, Check, RefreshCw, Shield, Zap } from 'lucide-react';

export default function GeneratorView({ onCopyPassword }) {
  const [length, setLength] = useState(18);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      uppercase = uppercase.replace(/[O]/g, '');
      lowercase = lowercase.replace(/[l]/g, '');
      numbers = numbers.replace(/[01]/g, '');
      symbols = symbols.replace(/[/\\()[\]{}~,;:.<>]/g, '');
    }

    let charPool = '';
    if (includeUppercase) charPool += uppercase;
    if (includeLowercase) charPool += lowercase;
    if (includeNumbers) charPool += numbers;
    if (includeSymbols) charPool += symbols;

    if (!charPool) return 'Select at least one set';

    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += charPool.charAt(Math.floor(Math.random() * charPool.length));
    }
    return pass;
  };

  const [generatedPassword, setGeneratedPassword] = useState(generatePassword);

  const handleRegenerate = () => {
    setGeneratedPassword(generatePassword());
  };

  const handleCopy = () => {
    onCopyPassword(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate Entropy
  const calculateEntropy = () => {
    let poolSize = 0;
    if (includeUppercase) poolSize += 26;
    if (includeLowercase) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 30;

    if (poolSize === 0) return 0;
    return Math.round(length * Math.log2(poolSize));
  };

  const entropy = calculateEntropy();

  const getEntropyBadge = () => {
    if (entropy >= 80) return { label: 'Very Strong (Cryptographic Grade)', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
    if (entropy >= 60) return { label: 'Strong', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' };
    if (entropy >= 40) return { label: 'Moderate', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
    return { label: 'Weak', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' };
  };

  const badge = getEntropyBadge();

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Wand2 className="w-7 h-7 text-indigo-400" />
          <span>Password & Entropy Generator</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Create high-entropy passwords resilient to brute-force dictionary attacks
        </p>
      </div>

      {/* Main Generator Output Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xl md:text-2xl text-slate-100 tracking-wider break-all text-center md:text-left select-all">
            {generatedPassword}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleRegenerate}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
              title="Generate New Password"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopy}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Password'}</span>
            </button>
          </div>
        </div>

        {/* Entropy Meter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Estimated Entropy:</span>
            <span className="text-sm font-extrabold text-white font-mono">{entropy} bits</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.color} inline-flex items-center gap-1.5`}>
            <Zap className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </div>
        </div>
      </div>

      {/* Controls & Options */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Customization Rules</h3>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300 font-medium">Password Length</span>
            <span className="text-blue-400 font-bold font-mono text-base">{length} Characters</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => {
              setLength(Number(e.target.value));
              setGeneratedPassword(generatePassword());
            }}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Checkbox Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => {
                setIncludeUppercase(e.target.checked);
                setGeneratedPassword(generatePassword());
              }}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <div>
              <span className="text-sm font-semibold text-slate-200 block">Uppercase (A-Z)</span>
              <span className="text-xs text-slate-500">Includes ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => {
                setIncludeLowercase(e.target.checked);
                setGeneratedPassword(generatePassword());
              }}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <div>
              <span className="text-sm font-semibold text-slate-200 block">Lowercase (a-z)</span>
              <span className="text-xs text-slate-500">Includes abcdefghijklmnopqrstuvwxyz</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => {
                setIncludeNumbers(e.target.checked);
                setGeneratedPassword(generatePassword());
              }}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <div>
              <span className="text-sm font-semibold text-slate-200 block">Numbers (0-9)</span>
              <span className="text-xs text-slate-500">Includes 0123456789</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => {
                setIncludeSymbols(e.target.checked);
                setGeneratedPassword(generatePassword());
              }}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <div>
              <span className="text-sm font-semibold text-slate-200 block">Symbols (!@#$)</span>
              <span className="text-xs text-slate-500">Includes !@#$%^&*()_+-=</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors md:col-span-2">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => {
                setExcludeAmbiguous(e.target.checked);
                setGeneratedPassword(generatePassword());
              }}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <div>
              <span className="text-sm font-semibold text-slate-200 block">Exclude Ambiguous Characters</span>
              <span className="text-xs text-slate-500">Avoids easily confused characters like (O, 0, l, 1, I)</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
