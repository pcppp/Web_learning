import { lazy } from 'react';

const Tictactoe = lazy(() => import('@/pages/tictactoe/Tictactoe.jsx'));
const VirtualList = lazy(() => import('@/pages/virtualList/VirtualList.jsx'));
const MyUpload = lazy(() => import('@/pages/myUpload/MyUpload.jsx'));
export { Tictactoe, VirtualList, MyUpload };
