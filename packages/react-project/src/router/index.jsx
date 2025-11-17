import { Chess, ChessHall, MyNavLink, MyUpload, TicTacToe, VirtualList, WebsocketDemo, StateColocation } from './pages';
import Login from '../auth/Login';
import Register from '../auth/Register';
import ProtectedRoute from '../auth/ProtectedRoute';

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
    title: '象棋大厅',
    path: 'hall',
    element: (
      <ProtectedRoute>
        <ChessHall />
      </ProtectedRoute>
      // <Chess />
    ),
  },
];

export default [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <MyNavLink />,
    children: getNavLink(),
  },
  {
    title: '象棋',
    path: '/chess/room/:roomId',
    element: (
      <ProtectedRoute>
        <Chess />
      </ProtectedRoute>
    ),
  },
];

export function getNavLink() {
  return NavLink;
}
