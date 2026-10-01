import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  HeartHandshake, 
  Share2, 
  Plus, 
  KeyRound, 
  Clock, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';

export default function SharingEmergencyView({ passwords }) {
  const [activeSubTab, setActiveSubTab] = useState('sharing');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [selectedPassId, setSelectedPassId] = useState('');
  const [sharedList, setSharedList] = useState([]);
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Sarah Miller (Spouse)', email: 'sarah@example.com', delay: 7, status: 'ACTIVE' }
  ]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', delay: 7 });

  const handleShare = (e) => {
    e.preventDefault();
    if (!recipientEmail || !selectedPassId) return;
    const pass = passwords.find(p => String(p.id) === String(selectedPassId));
    setSharedList(prev => [...prev, {
      id: Date.now(),
      title: pass ? pass.title : 'Credential',
      recipient: recipientEmail,
      status: 'Shared (AES Encrypted)'
    }]);
    setRecipientEmail('');
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email) return;
    setContacts(prev => [...prev, { ...newContact, id: Date.now(), status: 'ACTIVE' }]);
    setNewContact({ name: '', email: '', delay: 7 });
    setShowContactModal(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Users className="w-7 h-7 text-indigo-400" />
          <span>Sharing & Emergency Access</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Share encrypted credentials securely and set up digital emergency trustees
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('sharing')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === 'sharing'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Password Sharing</span>
        </button>

        <button
          onClick={() => setActiveSubTab('emergency')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === 'emergency'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Emergency Access (Digital Will)</span>
        </button>
      </div>

      {/* Password Sharing Section */}
      {activeSubTab === 'sharing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleShare} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Share Credential</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Select Credential *</label>
              <select
                value={selectedPassId}
                onChange={(e) => setSelectedPassId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 outline-none"
              >
                <option value="">-- Choose Password --</option>
                {passwords.map((p) => (
                  <option key={p.id} value={p.id}>{p.title} ({p.username})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Recipient Email Address *</label>
              <input
                type="email"
                required
                placeholder="colleague@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all"
            >
              Share Encrypted Credential
            </button>
          </form>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Shared Credentials</h3>
            {sharedList.length > 0 ? (
              <div className="space-y-2">
                {sharedList.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-white block">{item.title}</span>
                      <span className="text-slate-400">{item.recipient}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">{item.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">No active shares.</div>
            )}
          </div>
        </div>
      )}

      {/* Emergency Access Section */}
      {activeSubTab === 'emergency' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Emergency Trustees</h3>
                <p className="text-xs text-slate-400 mt-0.5">Trustees can request emergency access to your vault if you are unresponsive</p>
              </div>
              <button
                onClick={() => setShowContactModal(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Trustee</span>
              </button>
            </div>

            {contacts.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {contacts.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block">{c.name}</span>
                      <span className="text-slate-400">{c.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {c.delay} days delay
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">No emergency contacts added yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Add Trustee Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddContact} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Add Emergency Contact</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Sarah Miller"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="sarah@example.com"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Access Delay (Days)</label>
              <select
                value={newContact.delay}
                onChange={(e) => setNewContact({ ...newContact, delay: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
              >
                <option value={3}>3 Days</option>
                <option value={7}>7 Days (Recommended)</option>
                <option value={14}>14 Days</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
              >
                Add Trustee
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
