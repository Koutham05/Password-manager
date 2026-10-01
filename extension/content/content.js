// Content Script: Detects login forms and auto-fills credentials from Aegis API
(function() {
  console.log("🛡️ Aegis Auto-Fill Engine Loaded");

  const domain = window.location.hostname.replace('www.', '');

  async function fetchMatchingCredentials() {
    try {
      const res = await fetch(`http://localhost:5000/api/extension/match?domain=${encodeURIComponent(domain)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }

  function attachAutoFillIcons() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach((passInput) => {
      if (passInput.dataset.aegisAttached) return;
      passInput.dataset.aegisAttached = "true";

      passInput.addEventListener('focus', async () => {
        const matches = await fetchMatchingCredentials();
        if (matches.length > 0) {
          const match = matches[0];
          const form = passInput.closest('form') || document;
          const userInputs = form.querySelectorAll('input[type="text"], input[type="email"]');
          
          if (userInputs.length > 0) {
            userInputs[0].value = match.username || match.email || '';
          }
          passInput.value = match.password;
          
          passInput.style.border = "2px solid #3b82f6";
          setTimeout(() => passInput.style.border = "", 1500);
        }
      });
    });
  }

  setInterval(attachAutoFillIcons, 1000);
})();
