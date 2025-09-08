/*
 * @Description:
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
import { ErrorBoundary } from 'react-error-boundary';
import Loading from '@/components/Loading';
import { ButtonPro } from '@/components/ButtonPro';
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className={'text-center'}>
      <h2 className="mb-2 text-lg font-bold text-red-700">页面出错了</h2>
      <p className="mb-4 text-red-600">{error.message}</p>
      <ButtonPro onClick={resetErrorBoundary} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        返回重试
      </ButtonPro>
    </div>
  );
};
export default function MyApp() {
  const elements = useRoutes(routers);
  // const { topic, TOPIC, dispatchTopic, SelectComponent } = useTopic();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.href = '/';
      }}>
      <Suspense fallback={<Loading />}>{elements}</Suspense>
    </ErrorBoundary>
  );
}
