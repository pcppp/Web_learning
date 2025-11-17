/**
 * 登录页面
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ 使用 useEffect 处理重定向
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/hall', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 清除错误提示
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 表单验证
    if (!formData.username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!formData.password.trim()) {
      setError('请输入密码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        // 登录成功，跳转到象棋页面
        navigate('/hall', { replace: true });
      } else {
        setError(result.error || '登录失败，请检查用户名和密码');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
      console.error('登录错误', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>象棋对战</h1>
          <p>欢迎回来！请登录您的账号</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入用户名"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码"
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>

          <div className="login-footer">
            <span>还没有账号？</span>
            <Link to="/register" className="register-link">
              立即注册
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
