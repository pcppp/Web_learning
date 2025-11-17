import axios from 'axios';

const http = axios.create({
  baseURL: '/api', // 你的API地址
  timeout: 600000, // 请求超时时间
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('chess_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      if (config.method === 'post' || config.method === 'put') {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          config.data = {
            ...config.data,
            user: {
              userId: payload.userId,
              username: payload.username,
            },
          };
        } catch (e) {
          console.error('解析 token 失败:', e);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Token 过期或无效
    if (error.response?.status === 401) {
      localStorage.removeItem('chess_token');
      localStorage.removeItem('chess_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

http.useAbortRequest = (mode, abortRef) => {
  const controller = new AbortController();
  const signal = controller.signal;
  abortRef && (abortRef.current = () => controller.abort());
  return (url, config = {}) => {
    if (mode === 'post') return http[mode](url, config.data, { ...config, signal });
    else return http[mode](url, { ...config, signal });
  };
};

export default http;
