document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('credentials-list');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const domain = new URL(tab.url).hostname.replace('www.', '');

    const res = await fetch(`http://localhost:5000/api/extension/match?domain=${encodeURIComponent(domain)}`);
    const matches = await res.json();

    if (!matches || matches.length === 0) {
      container.innerHTML = `<p style="font-size:12px; color:#9ca3af;">No credentials saved for ${domain}</p>`;
      return;
    }

    container.innerHTML = matches.map(m => `
      <div class="item">
        <div class="item-title">${m.title}</div>
        <div class="item-user">${m.username || m.email}</div>
        <button class="btn" data-user="${m.username || m.email}" data-pass="${m.password}">Auto-Fill Credentials</button>
      </div>
    `).join('');

    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const user = e.target.dataset.user;
        const pass = e.target.dataset.pass;

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (u, p) => {
            const passInput = document.querySelector('input[type="password"]');
            if (passInput) {
              const form = passInput.closest('form') || document;
              const userInput = form.querySelector('input[type="text"], input[type="email"]');
              if (userInput) userInput.value = u;
              passInput.value = p;
            }
          },
          args: [user, pass]
        });
      });
    });
  } catch (err) {
    container.innerHTML = `<p style="font-size:12px; color:#ef4444;">Make sure Aegis Vault is unlocked</p>`;
  }
});
