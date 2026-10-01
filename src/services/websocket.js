/**
 * Centralized WebSocket E2E Sync Service
 */

let wsSocket = null;

export function initWebSocketSync(onMessageCallback) {
  if (wsSocket && wsSocket.readyState === WebSocket.OPEN) return wsSocket;

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}`;

  try {
    wsSocket = new WebSocket(wsUrl);

    wsSocket.onopen = () => {
      console.log('⚡ WebSocket Sync Service Connected');
    };

    wsSocket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (onMessageCallback) onMessageCallback(payload);
      } catch (err) {
        console.error('WebSocket payload parse error:', err);
      }
    };

    wsSocket.onclose = () => {
      console.log('⚡ WebSocket Sync Service Disconnected');
    };
  } catch (err) {
    console.error('Failed to initialize WebSocket sync:', err);
  }

  return wsSocket;
}
