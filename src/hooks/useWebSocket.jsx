// hooks/useWebSocket.js
import { useEffect, useRef } from 'react';

const HEARTBEAT_INTERVAL = 10000; // 心跳间隔 10 秒
const RECONNECT_INTERVAL = 3000; // 重连间隔 3 秒

export default function useWebSocket({ url, onMessage, onOpen }) {
  const wsRef = useRef(null);
  const heartbeatTimer = useRef(null);
  const reconnectTimer = useRef(null);

  useEffect(() => {
    let socket;
    function startHeartbeat(ws) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, HEARTBEAT_INTERVAL);
    }
    function connect() {
      socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log('[WebSocket] Connected');
        onOpen?.();
        startHeartbeat(socket);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== 'pong') {
            console.log('onMEssage', data);
            onMessage(data);
          }
        } catch (err) {
          console.error('[WebSocket] Message parsing error:', err);
        }
      };
      socket.onclose = () => {
        console.warn('[WebSocket] Disconnected. Reconnecting...');
        reconnectTimer.current = setTimeout(connect, RECONNECT_INTERVAL);
      };
      socket.onerror = (err) => {
        console.error('[WebSocket] Error occurred:', err);
        socket.close(); // 触发重连
      };
    }
    connect();
    return () => {
      console.log('[WebSocket] Cleaning up...');
      clearInterval(heartbeatTimer.current);
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [url]);
  const sendMessage = (data) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      console.warn('[WebSocket] Cannot send message, socket not open.');
    }
  };
  return {
    sendMessage,
    socketRef: wsRef,
  };
}
