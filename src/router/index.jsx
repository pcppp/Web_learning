import { MyUpload, Tictactoe, VirtualList } from './pages';

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
  // {
  //   path: '*',
  //   element: <NotFound />,
  // },
];
