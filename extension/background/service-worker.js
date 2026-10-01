// Extension Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("🛡️ Aegis Extension Service Worker Initialized");
});

// Secure Message Relay between Popup and Content Scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_DOMAINS') {
    sendResponse({ status: 'OK' });
  }
});
