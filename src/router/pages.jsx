import { lazy } from 'react';

const TicTacToe = lazy(() => import('@/pages/ticTacToe/TicTacToe.jsx'));
const VirtualList = lazy(() => import('@/pages/virtualList/VirtualList.jsx'));
const MyUpload = lazy(() => import('@/pages/myUpload/MyUpload.jsx'));
const Websocket = lazy(() => import('@/pages/websocket/Websocket.jsx'));
const StateColocation = lazy(() => import('@/pages/stateColocation/StateColocation.jsx'));
const MyNavLink = lazy(() => import('@/pages/homePage/HomePage.jsx'));
export { MyNavLink, TicTacToe, VirtualList, MyUpload, Websocket, StateColocation };
