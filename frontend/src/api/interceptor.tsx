'use client';
import { useEffect } from 'react';
import { axiosAuthInstance } from './axios';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';

const PROTECTED_PATHS = ['/party-info'];
const PROTECTED_API_PATHS = ['/api/blacklist', '/api/party'];
const TOKEN_KEY = 'lostark-api';

interface AxiosInterceptorProps {
  children: React.ReactNode;
}

export const AxiosInterceptor = ({ children }: AxiosInterceptorProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = (path: string | null) => {
    if (!path) return false;
    return PROTECTED_PATHS.some((route) => path.startsWith(route));
  };

  const isProtectedApi = (url: string = '') => {
    return PROTECTED_API_PATHS.some((apiPath) => url.includes(apiPath));
  };

  useEffect(() => {
    const requestInterceptor = axiosAuthInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (isProtectedRoute(pathname) || (config.url && isProtectedApi(config.url))) {
          if (!token) {
            toast.error('로그인이 필요합니다.');
            return Promise.reject();
          }
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    const responseInterceptor = axiosAuthInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              localStorage.removeItem(TOKEN_KEY);
              toast.error('로그인이 필요합니다.');
              router.push('/login');
              break;
            case 403:
              router.push('/forbidden');
              break;
          }
        }
        return Promise.reject(error);
      },
    );

    if (isProtectedRoute(pathname)) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        toast.error('로그인이 필요합니다.');
        router.push('/login');
      }
    }

    return () => {
      axiosAuthInstance.interceptors.request.eject(requestInterceptor);
      axiosAuthInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [router, pathname]);

  return <>{children}</>;
};
