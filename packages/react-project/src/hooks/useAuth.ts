// src/hooks/useAuth.ts
import { useAppStore } from '@/store/appStore';

export const useAuth = () => {
  const auth = useAppStore((state) => state.auth);
  const login = useAppStore((state) => state.login);
  const register = useAppStore((state) => state.register);
  const logout = useAppStore((state) => state.logout);
  const refreshToken = useAppStore((state) => state.refreshToken);

  return {
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
  };
};
