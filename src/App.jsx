/*
 * @Descripttion:
 * @version:
 * @Author: pc
 * @Date: 2024-10-11 13:29:03
 * @LastEditors: your name
 * @LastEditTime: 2024-10-12 11:14:39
 */
import { Suspense } from 'react';
import './style/App.css';
import routers from '@/router';
import { NavLink, useRoutes } from 'react-router';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Loading from '@/components/Loading';
const links = [
  {
    title: '井字棋',
    url: '/tictactoe',
  },
  {
    title: '虚拟列表',
    url: '/virtualList',
  },
  {
    title: '上传',
    url: '/myUpload',
  },
  {
    title: '长轮询',
    url: '/websocket',
  },
];

const MyNavLink = () => {
  return (
    <ul>
      {links.map((link) => {
        return (
          <li key={link.url}>
            <NavLink to={link.url}>{link.title}</NavLink>
          </li>
        );
      })}
    </ul>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};
export default function MyApp() {
  const elements = useRoutes(routers);
  const [pointNum, setPointNum] = useState(0);
  const handleClick = () => {
    setPointNum(pointNum + 1);
  };
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.href = '/';
      }}>
      <MyNavLink></MyNavLink>
      <Suspense fallback={<Loading />}>{elements}</Suspense>
    </ErrorBoundary>
  );
}
