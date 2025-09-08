import { useRef, useState } from 'react';
import { ButtonPro } from '@/components/ButtonPro';
import WebSocketClient from 'websocket';
export default function WebsocketDemo() {
  const [messageState, setMessageState] = useState([]);
  const startWebsocket = () => {
    const messages = [];
    const socket = new Websocket('ws://localhost:3000/websocket'); // 连接到 WebSocket URL
    socket.on('open', function open() {
      console.log('Connected to WebSocket server!');
      ws.send('Hello Server!'); // 发送消息到服务器
    });
    socket.on('message', function message(data) {
      console.log('Received from server:', data); // 接收服务器消息
      messages.push(data);
      setMessageState(messages);
    });

    socket.on('close', function close() {
      console.log('WebSocket connection closed.');
    });
  };
  return <ButtonPro onClick={startWebsocket}>启动Websocket</ButtonPro>;
}
