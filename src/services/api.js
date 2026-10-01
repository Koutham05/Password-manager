/**
 * Centralized API Service for REST Communication
 */

const API_BASE = '/api';

export async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  getAuthStatus: () => apiRequest('/auth/status'),
  setupMaster: (masterPassword) => apiRequest('/auth/setup', 'POST', { masterPassword }),
  loginMaster: (masterPassword) => apiRequest('/auth/login', 'POST', { masterPassword }),
  lockVault: () => apiRequest('/auth/lock', 'POST'),
  getDashboard: () => apiRequest('/dashboard'),
  getPasswords: () => apiRequest('/passwords'),
  createPassword: (itemData) => apiRequest('/passwords', 'POST', itemData),
  updatePassword: (id, itemData) => apiRequest(`/passwords/${id}`, 'PUT', itemData),
  deletePassword: (id) => apiRequest(`/passwords/${id}`, 'DELETE'),
  getCategories: () => apiRequest('/categories'),
  createCategory: (catData) => apiRequest('/categories', 'POST', catData),
  getSecurityAudit: () => apiRequest('/security/audit'),
  createBackup: () => apiRequest('/backup', 'POST'),
  getBackups: () => apiRequest('/backups'),
  importItems: (items) => apiRequest('/import', 'POST', { items }),
  getSettings: () => apiRequest('/settings'),
  updateSettings: (settings) => apiRequest('/settings', 'PUT', settings),
  getAuditLogs: () => apiRequest('/audit-logs')
};
