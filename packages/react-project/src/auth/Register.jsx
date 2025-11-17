/**
 * 注册页面
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import './Login.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ 使用 useEffect 处理重定向
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chess', { replace: true });
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

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('请输入用户名');
      return false;
    }
    if (formData.username.length < 3) {
      setError('用户名至少需要 3 个字符');
      return false;
    }
    if (!formData.email.trim()) {
      setError('请输入邮箱');
      return false;
    }
    // 简单的邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }
    if (!formData.password.trim()) {
      setError('请输入密码');
      return false;
    }
    if (formData.password.length < 6) {
      setError('密码至少需要 6 个字符');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await register(formData.username, formData.password, formData.email);

      if (result.success) {
        // 注册成功，跳转到象棋页面
        navigate('/chess', { replace: true });
      } else {
        setError(result.error || '注册失败，请稍后重试');
      }
    } catch (err) {
      setError('注册失败，请稍后重试');
      console.error('注册错误', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>创建账号</h1>
          <p>加入象棋对战平台</p>
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
              placeholder="至少 3 个字符"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={loading}
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
              placeholder="至少 6 个字符"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="再次输入密码"
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>

          <div className="login-footer">
            <span>已有账号？</span>
            <Link to="/login" className="register-link">
              立即登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
