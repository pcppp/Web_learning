// src/components/AuthInitializer.tsx
import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';

/**
 * 认证初始化组件
 * 在应用启动时初始化认证状态
 */
export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const initAuth = useAppStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, []); // 只在挂载时执行一次

  return <>{children}</>;
};
