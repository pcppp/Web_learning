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
import { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Loading from '@/components/Loading';
import useTopic from '@/hooks/useTopic';
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
  const { topic, TOPIC, dispatchTopic, SelectComponent } = useTopic();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.href = '/';
      }}>
      <SelectComponent></SelectComponent>
      <Suspense fallback={<Loading />}>{elements}</Suspense>
    </ErrorBoundary>
  );
}
