/**
 * 认证相关 API
 */
import http from './http';

export const authAPI = {
  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<{token: string, user: object}>}
   */
  login: async (username, password) => {
    const response = await http.post('/auth/login', {
      username,
      password,
    });
    return response;
  },

  /**
   * 用户注册
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @param {string} email - 邮箱
   * @returns {Promise<{token: string, user: object}>}
   */
  register: async (username, password, email) => {
    const response = await http.post('/auth/register', {
      username,
      password,
      email,
    });
    return response;
  },

  /**
   * 用户登出
   * @returns {Promise<void>}
   */
  logout: async () => {
    const response = await http.post('/auth/logout');
    return response;
  },

  /**
   * 获取当前用户信息
   * @returns {Promise<{user: object}>}
   */
  getCurrentUser: async () => {
    const response = await http.get('/auth/me');
    return response;
  },

  /**
   * 刷新 Token
   * @returns {Promise<{token: string}>}
   */
  refreshToken: async () => {
    const response = await http.post('/auth/refresh');
    return response;
  },
  /**
   * 获取session
   * @returns {Promise<{token: string}>}
   */
};
