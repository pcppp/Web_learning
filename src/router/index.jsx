import {
  Tictactoe,
  VirtualList
} from './pages';

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

  // {
  //   path: '*',
  //   element: <NotFound />,
  // },
];
