import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MasterPasswordScreen from './pages/MasterPasswordScreen';
import DashboardView from './pages/DashboardView';
import VaultView from './pages/VaultView';
import CategoriesView from './pages/CategoriesView';
import PasswordModal from './components/PasswordModal';
import GeneratorView from './pages/GeneratorView';
import SecurityCenterView from './pages/SecurityCenterView';
import ImportExportView from './pages/ImportExportView';
import BackupRestoreView from './pages/BackupRestoreView';
import SettingsView from './pages/SettingsView';
import AuditLogView from './pages/AuditLogView';
import TrashView from './pages/TrashView';
import ExtensionView from './pages/ExtensionView';
import SharingEmergencyView from './pages/SharingEmergencyView';
import SyncView from './pages/SyncView';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [authStatus, setAuthStatus] = useState({ initialized: false, unlocked: false });
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // App Data States
  const [dashboardData, setDashboardData] = useState(null);
  const [passwords, setPasswords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [auditItems, setAuditItems] = useState([]);
  const [backups, setBackups] = useState([]);
  const [settings, setSettings] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [trashItems, setTrashItems] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Check Auth Status
  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setAuthStatus(data);
    } catch (err) {
      console.error('Failed to fetch auth status', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  // Fetch Vault Data when unlocked
  const fetchAllData = useCallback(async () => {
    try {
      const [dashRes, passRes, catRes, auditRes, backRes, setRes, logRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/passwords'),
        fetch('/api/categories'),
        fetch('/api/security/audit'),
        fetch('/api/backups'),
        fetch('/api/settings'),
        fetch('/api/audit-logs')
      ]);

      if (dashRes.ok) setDashboardData(await dashRes.json());
      if (passRes.ok) setPasswords(await passRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (auditRes.ok) setAuditItems(await auditRes.json());
      if (backRes.ok) setBackups(await backRes.json());
      if (setRes.ok) setSettings(await setRes.json());
      if (logRes.ok) setAuditLogs(await logRes.json());
    } catch (err) {
      console.error('Error fetching vault data:', err);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (authStatus.unlocked) {
      fetchAllData();
    }
  }, [authStatus.unlocked, fetchAllData]);

  // Handle Master Password Authenticate / Setup
  const handleAuthenticate = async (masterPassword) => {
    const endpoint = authStatus.initialized ? '/api/auth/login' : '/api/auth/setup';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ masterPassword })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    setAuthStatus({ initialized: true, unlocked: true });
  };

  // Lock Vault
  const handleLock = async () => {
    await fetch('/api/auth/lock', { method: 'POST' });
    setAuthStatus((prev) => ({ ...prev, unlocked: false }));
  };

  // Copy to Clipboard helper with auto-clear notice
  const handleCopyPassword = (pass) => {
    navigator.clipboard.writeText(pass);
    const timeoutSecs = parseInt(settings.clipboard_clear_seconds || '30', 10);
    setTimeout(() => {
      navigator.clipboard.writeText('');
    }, timeoutSecs * 1000);
  };

  // CRUD Password Actions
  const handleSavePassword = async (itemData) => {
    const isEdit = !!editingItem;
    const url = isEdit ? `/api/passwords/${editingItem.id}` : '/api/passwords';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });

    if (res.ok) {
      fetchAllData();
      setIsModalOpen(false);
      setEditingItem(null);
    } else {
      const err = await res.json();
      alert(err.error || 'Save failed');
    }
  };

  const handleDeletePassword = async (id) => {
    if (!window.confirm('Move this credential to Trash?')) return;
    const item = passwords.find(p => p.id === id);
    if (item) setTrashItems(prev => [...prev, item]);
    const res = await fetch(`/api/passwords/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchAllData();
    }
  };

  // Category Add
  const handleAddCategory = async (catData) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData)
    });
    if (res.ok) fetchAllData();
  };

  // Bulk Import
  const handleImportItems = async (items) => {
    const res = await fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    if (res.ok) fetchAllData();
  };

  // Create Backup
  const handleCreateBackup = async () => {
    const res = await fetch('/api/backup', { method: 'POST' });
    if (res.ok) {
      fetchAllData();
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Backup creation failed');
    }
  };

  // Save Settings
  const handleSaveSettings = async (newSettings) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    if (res.ok) fetchAllData();
  };

  if (loadingStatus) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Loading Aegis Vault...
      </div>
    );
  }

  if (!authStatus.unlocked) {
    return (
      <MasterPasswordScreen
        isSetup={!authStatus.initialized}
        onAuthenticate={handleAuthenticate}
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex`}>
      {/* Sidebar Navigation matching Blueprint */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLock={handleLock}
        stats={{
          ...dashboardData?.stats,
          trashCount: trashItems.length
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNewPassword={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          onOpenGenerator={() => setActiveTab('generator')}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={dashboardData?.stats}
              recentItems={dashboardData?.recentItems}
              onNewPassword={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              onNavigate={(tab) => setActiveTab(tab)}
              onCopyPassword={handleCopyPassword}
            />
          )}

          {activeTab === 'vault' && (
            <VaultView
              passwords={passwords}
              categories={categories}
              searchQuery={searchQuery}
              onEdit={(item) => {
                setEditingItem(item);
                setIsModalOpen(true);
              }}
              onDelete={handleDeletePassword}
              onNewPassword={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              onCopyPassword={handleCopyPassword}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesView
              categories={categories}
              passwords={passwords}
              onAddCategory={handleAddCategory}
            />
          )}

          {activeTab === 'favorites' && (
            <VaultView
              passwords={passwords.filter(p => p.isFavorite)}
              categories={categories}
              searchQuery={searchQuery}
              onEdit={(item) => {
                setEditingItem(item);
                setIsModalOpen(true);
              }}
              onDelete={handleDeletePassword}
              onNewPassword={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              onCopyPassword={handleCopyPassword}
            />
          )}

          {activeTab === 'generator' && (
            <GeneratorView onCopyPassword={handleCopyPassword} />
          )}

          {activeTab === 'extension' && (
            <ExtensionView />
          )}

          {activeTab === 'sharing' && (
            <SharingEmergencyView passwords={passwords} />
          )}

          {activeTab === 'sync' && (
            <SyncView />
          )}

          {activeTab === 'security' && (
            <SecurityCenterView
              auditItems={auditItems}
              stats={dashboardData?.stats}
              onFixPassword={(id) => {
                const item = passwords.find((p) => p.id === id);
                if (item) {
                  setEditingItem(item);
                  setIsModalOpen(true);
                }
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          )}

          {activeTab === 'trash' && (
            <TrashView
              trashItems={trashItems}
              onRestore={(id) => setTrashItems(prev => prev.filter(p => p.id !== id))}
              onEmptyTrash={() => setTrashItems([])}
            />
          )}
        </main>
      </div>

      {/* Password Modal */}
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSavePassword}
        categories={categories}
        initialData={editingItem}
      />
    </div>
  );
}
