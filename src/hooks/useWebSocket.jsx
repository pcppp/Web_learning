// hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';

const HEARTBEAT_INTERVAL = 10000; // 心跳间隔 10 秒
const RECONNECT_INTERVAL = 3000; // 重连间隔 3 秒
const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
};
export default function useWebSocket({ url, onMessage, onOpen }) {
  const wsRef = useRef(null);
  const heartbeatTimer = useRef(null);
  const reconnectTimer = useRef(null);
  const isAlive = useRef(true);
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.CONNECTING);
  useEffect(() => {
    let socket;
    function startHeartbeat(ws) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          isAlive.current = false;
          ws.send(JSON.stringify({ type: 'ping' }));
          // 检测是否在一定时间内收到 pong
          setTimeout(() => {
            if (!isAlive.current) {
              console.warn('[WebSocket] Heartbeat failed. Reconnecting...');
              wsRef.current.close(); // 触发重连逻辑
            }
          }, HEARTBEAT_INTERVAL / 2); // 等待半个心跳间隔
        }
      }, HEARTBEAT_INTERVAL);
    }
    function connect() {
      socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log('[WebSocket] Connected');
        setConnectionStatus(CONNECTION_STATUS.CONNECTED);
        onOpen?.();
        startHeartbeat(socket);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== 'pong') {
            console.log('onMessage', data);
            onMessage(data);
          } else {
            isAlive.current = true;
            console.log('pone');
          }
        } catch (err) {
          console.error('[WebSocket] Message parsing error:', err);
        }
      };
      socket.onclose = () => {
        console.warn('[WebSocket] Disconnected. Reconnecting...');
        setConnectionStatus(CONNECTION_STATUS.CONNECTING);
        reconnectTimer.current = setTimeout(connect, RECONNECT_INTERVAL);
      };
      socket.onerror = (err) => {
        console.error('[WebSocket] Error occurred:', err);
        socket.close(); // 触发重连
      };
    }
    connect();
    return () => {
      if (wsRef.current) {
        console.log(wsRef.current);
        console.log('[WebSocket] Cleaning up...');
        clearInterval(heartbeatTimer.current);
        clearTimeout(reconnectTimer.current);
        wsRef.current.onclose = null; // 防止触发重连逻辑
        wsRef.current.onerror = null; // 防止触发错误处理
        wsRef.current.close();
        wsRef.current = null;
      }
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
    connectionStatus,
  };
}
