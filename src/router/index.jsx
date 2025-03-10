import { MyUpload, Tictactoe, VirtualList, Websocket } from './pages';

export default [
  {
    path: '/',
    element: <Tictactoe />,
  },
  {
    path: '/tictactoe',
    element: <Tictactoe />,
  },
  {
    path: '/virtualList',
    element: <VirtualList />,
  },
  {
    path: '/myUpload',
    element: <MyUpload />,
  },
  {
    path: '/websocket',
    element: <Websocket />,
  },
  // {
  //   path: '*',
  //   element: <NotFound />,
  // },
];
