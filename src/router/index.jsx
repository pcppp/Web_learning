import { MyNavLink, MyUpload, TicTacToe, VirtualList, Websocket, StateColocation } from './pages';

export default [
  {
    path: '/',
    element: <MyNavLink />,
    children: [
      {
        path: 'ticTacToe',
        element: <TicTacToe />,
      },
      {
        path: 'virtualList',
        element: <VirtualList />,
      },
      {
        path: 'myUpload',
        element: <MyUpload />,
      },
      {
        path: 'stateColocation',
        element: <StateColocation />,
      },
      {
        path: 'websocket',
        element: <Websocket />,
      },
      // {
      //   path: '*',
      //   element: <NotFound />,
      // },
    ],
  },
];
