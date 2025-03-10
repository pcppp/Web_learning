import { lazy } from 'react';

const Tictactoe = lazy(() => import('@/pages/tictactoe/Tictactoe.jsx'));
const VirtualList = lazy(() => import('@/pages/virtualList/VirtualList.jsx'));
const MyUpload = lazy(() => import('@/pages/myUpload/MyUpload.jsx'));
const Websocket = lazy(() => import('@/pages/websocket/Websocket.jsx'));
export { Tictactoe, VirtualList, MyUpload, Websocket };
