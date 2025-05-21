import { useRef, useState } from 'react';
import { io } from 'react-socket-io';
export default function Websocket() {
  const [messageState, setMessageState] = useState([]);
  const startWebsocket = () => {
    const messages = [];
    const ws = new io('ws://localhost:3000/polling/websocket'); // 连接到 WebSocket URL
    ws.on('open', function open() {
      console.log('Connected to WebSocket server!');
      ws.send('Hello Server!'); // 发送消息到服务器
    });
    ws.send('1111');
    ws.on('message', function message(data) {
      console.log('Received from server:', data); // 接收服务器消息
      messages.push(data);
      setMessageState(messages);
    });

    ws.on('close', function close() {
      console.log('WebSocket connection closed.');
    });
  };
  return <ButtonPro onClick={startWebsocket}>启动Websocket</ButtonPro>;
}
