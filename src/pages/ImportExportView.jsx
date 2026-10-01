import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

export default function ImportExportView({ onImportItems, passwords }) {
  const [csvContent, setCsvContent] = useState('');
  const [importStatus, setImportStatus] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      setCsvContent(text);
    };
    reader.readAsText(file);
  };

  const parseAndImportCSV = () => {
    try {
      const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        setImportStatus({ success: false, message: 'CSV file must have a header and at least 1 record.' });
        return;
      }

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('name'));
      const urlIdx = headers.findIndex(h => h.includes('url') || h.includes('website'));
      const userIdx = headers.findIndex(h => h.includes('user') || h.includes('login'));
      const emailIdx = headers.findIndex(h => h.includes('email'));
      const passIdx = headers.findIndex(h => h.includes('pass'));
      const notesIdx = headers.findIndex(h => h.includes('note'));

      if (titleIdx === -1 || passIdx === -1) {
        setImportStatus({ success: false, message: 'CSV must contain "title" and "password" columns.' });
        return;
      }

      const parsedItems = [];
      for (let i = 1; i < lines.length; i++) {
        // Simple CSV row parser handling quotes
        const cols = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
        const cleanCols = cols.map(c => c.trim().replace(/^"|"$/g, ''));

        parsedItems.push({
          title: cleanCols[titleIdx] || 'Imported Entry',
          url: urlIdx !== -1 ? cleanCols[urlIdx] || '' : '',
          username: userIdx !== -1 ? cleanCols[userIdx] || '' : '',
          email: emailIdx !== -1 ? cleanCols[emailIdx] || '' : '',
          password: cleanCols[passIdx] || '',
          notes: notesIdx !== -1 ? cleanCols[notesIdx] || '' : ''
        });
      }

      onImportItems(parsedItems);
      setImportStatus({ success: true, message: `Successfully imported ${parsedItems.length} credentials into vault!` });
      setCsvContent('');
    } catch (err) {
      setImportStatus({ success: false, message: `Import error: ${err.message}` });
    }
  };

  const handleExportCSV = () => {
    if (!passwords || passwords.length === 0) return;

    let csv = 'title,url,username,email,password,notes\n';
    passwords.forEach(p => {
      const escape = (str) => `"${(str || '').replace(/"/g, '""')}"`;
      csv += `${escape(p.title)},${escape(p.url)},${escape(p.username)},${escape(p.email)},${escape(p.password)},${escape(p.notes)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aegis_vault_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <FileSpreadsheet className="w-7 h-7 text-blue-400" />
          <span>Import & Export Data</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Transfer passwords to/from Bitwarden, 1Password, Chrome, or custom CSV files
        </p>
      </div>

      {importStatus && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm ${
          importStatus.success
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {importStatus.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{importStatus.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import Section */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Import CSV Credentials</h3>
              <p className="text-xs text-slate-400">Add credentials in bulk</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 text-center transition-colors">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-file-input"
            />
            <label htmlFor="csv-file-input" className="cursor-pointer space-y-2 block">
              <FileText className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-xs font-semibold text-blue-400">Click to upload CSV file</div>
              <p className="text-[11px] text-slate-500">Supports headers: title, url, username, email, password, notes</p>
            </label>
          </div>

          {csvContent && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400">CSV Preview (First 3 lines):</div>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                {csvContent.split('\n').slice(0, 4).join('\n')}
              </pre>
              <button
                onClick={parseAndImportCSV}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all"
              >
                Import Credentials Now
              </button>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-base">Export Vault CSV</h3>
                <p className="text-xs text-slate-400">Export decrypted copy for migration</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Downloading your passwords in unencrypted CSV format permits importing them into other software. Keep this exported file secure.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleExportCSV}
              disabled={!passwords || passwords.length === 0}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Export {passwords?.length || 0} Passwords to CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
