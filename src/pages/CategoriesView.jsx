import React, { useState } from 'react';
import { 
  FolderTree, 
  Plus, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Folder, 
  Edit3, 
  Trash2 
} from 'lucide-react';

export default function CategoriesView({ categories, passwords, onAddCategory }) {
  const [newCatName, setNewCatName] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCatName) return;
    onAddCategory({ name: newCatName, icon: 'Folder', color: '#3b82f6' });
    setNewCatName('');
    setShowAdd(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FolderTree className="w-7 h-7 text-blue-400" />
            <span>Categories Management</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">Organize logins and secure notes into distinct vaults</p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <input
            type="text"
            placeholder="Category Name (e.g. Work, Social, Crypto)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
            autoFocus
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
            Save Category
          </button>
        </form>
      )}

      {/* Categories Table View matching UI Spec Card 09 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <th className="pb-3 px-4">Category Name</th>
                <th className="pb-3 px-4">Total</th>
                <th className="pb-3 px-4">Strong</th>
                <th className="pb-3 px-4">Medium</th>
                <th className="pb-3 px-4">Weak</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {categories.map((cat) => {
                const catItems = passwords.filter(p => String(p.categoryId) === String(cat.id));
                const strongCount = catItems.filter(p => p.password && p.password.length >= 14).length;
                const mediumCount = catItems.filter(p => p.password && p.password.length >= 10 && p.password.length < 14).length;
                const weakCount = catItems.filter(p => p.password && p.password.length < 10).length;

                return (
                  <tr key={cat.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center gap-2.5">
                      <Folder className="w-4 h-4 text-blue-400" />
                      <span>{cat.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">{catItems.length}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-semibold">{strongCount}</td>
                    <td className="py-3.5 px-4 text-amber-400 font-semibold">{mediumCount}</td>
                    <td className="py-3.5 px-4 text-rose-400 font-semibold">{weakCount}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
