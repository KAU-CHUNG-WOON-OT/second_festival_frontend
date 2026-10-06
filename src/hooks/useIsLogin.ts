import { useEffect, useState } from 'react';
import { AUTH_STORAGE_CHANGED_EVENT, isAuthenticated } from '../lib/authStorage';

export const useIsLogin = (): boolean => {
  const [isLogin, setIsLogin] = useState<boolean>(isAuthenticated);

  useEffect(() => {
    const sync = () => setIsLogin(isAuthenticated());
    window.addEventListener(AUTH_STORAGE_CHANGED_EVENT, sync);
    return () => window.removeEventListener(AUTH_STORAGE_CHANGED_EVENT, sync);
  }, []);

  return isLogin;
};
