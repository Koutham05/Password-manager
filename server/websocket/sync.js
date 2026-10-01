const { WebSocketServer } = require('ws');

let wssInstance = null;

function initWebSocketServer(server, activeSession) {
  wssInstance = new WebSocketServer({ server });

  wssInstance.on('connection', (ws, req) => {
    // Authenticated connection check: Reject unauthenticated connections immediately
    if (!activeSession.unlocked || !activeSession.keyBuffer) {
      ws.send(JSON.stringify({ type: 'ERROR', error: 'Unauthorized: Vault is locked.' }));
      ws.close(4001, 'Unauthorized');
      return;
    }

    ws.isUnlocked = true;
    ws.send(JSON.stringify({ type: 'SYNC_STATUS', status: 'CONNECTED_AUTHENTICATED' }));
  });

  return wssInstance;
}

function broadcastSync(event, data) {
  if (!wssInstance) return;
  wssInstance.clients.forEach((client) => {
    if (client.readyState === 1 && client.isUnlocked) {
      // Send event notification without any plaintext password data
      client.send(JSON.stringify({ event, data, timestamp: new Date() }));
    }
  });
}

function terminateAllConnections() {
  if (!wssInstance) return;
  wssInstance.clients.forEach((client) => {
    client.send(JSON.stringify({ type: 'VAULT_LOCKED', message: 'Vault locked. Disconnecting socket.' }));
    client.close(4002, 'Vault Locked');
  });
}

module.exports = {
  initWebSocketServer,
  broadcastSync,
  terminateAllConnections
};
