import { lazy } from 'react';

const Tictactoe = lazy(() => import('@/pages/tictactoe/Tictactoe.jsx'));
const VirtualList = lazy(() => import('@/pages/virtualList/VirtualList.jsx'));
export {
  Tictactoe,
  VirtualList,
};
