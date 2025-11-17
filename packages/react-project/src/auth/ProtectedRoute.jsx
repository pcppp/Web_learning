/**
 * 受保护的路由组件
 * 需要登录才能访问
 */
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  return children;
};

export default ProtectedRoute;
