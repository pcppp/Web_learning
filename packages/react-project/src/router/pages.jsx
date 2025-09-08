import { lazy } from 'react';

const TicTacToe = lazy(() => import('@/pages/ticTacToe/TicTacToe.jsx'));
const VirtualList = lazy(() => import('@/pages/virtualList/VirtualList.jsx'));
const MyUpload = lazy(() => import('@/pages/myUpload/MyUpload.jsx'));
const WebsocketDemo = lazy(() => import('@/pages/websocketDemo/WebsocketDemo.jsx'));
const StateColocation = lazy(() => import('@/pages/stateColocation/StateColocation.jsx'));
const MyNavLink = lazy(() => import('@/pages/homePage/HomePage.jsx'));
const Chess = lazy(() => import('@/pages/chess/Chess.jsx'));
export { Chess, MyNavLink, TicTacToe, VirtualList, MyUpload, WebsocketDemo, StateColocation };
