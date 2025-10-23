import { Chess, MyNavLink, MyUpload, TicTacToe, VirtualList, WebsocketDemo, StateColocation, DemoPage } from './pages';

const NavLink = [
  {
    title: '井字棋',
    path: 'ticTacToe',
    element: <TicTacToe />,
  },

  {
    title: '虚拟列表',
    path: 'virtualList',
    element: <VirtualList />,
  },
  {
    title: '上传',
    path: 'myUpload',
    element: <MyUpload />,
  },
  {
    title: 'websocket',
    path: 'websocketDemo',
    element: <WebsocketDemo />,
  },
  {
    title: '状态托管',
    path: 'stateColocation',
    element: <StateColocation />,
  },
  {
    title: '象棋',
    path: 'chess',
    element: <Chess />,
  },
  {
    title: 'demo',
    path: 'demo',
    element: <DemoPage />,
  },
];
export default [
  {
    path: '/',
    element: <MyNavLink />,
    children: getNavLink(),
  },
];
export function getNavLink() {
  return NavLink;
}
