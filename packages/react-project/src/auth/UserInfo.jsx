/**
 * 用户信息组件
 * 显示当前登录用户信息和登出按钮
 */
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';

const UserInfo = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="user-info">
        <button className="login-link" onClick={() => navigate('/login')}>
          登录
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    const confirmed = window.confirm('确定要退出登录吗？');
    if (confirmed) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className="user-info">
      <div className="user-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</div>
      <div className="user-details">
        <div className="user-name">{user.username}</div>
        {user.rating && <div className="user-rating">积分: {user.rating}</div>}
      </div>
      <button className="logout-button" onClick={handleLogout} title="退出登录">
        退出
      </button>
    </div>
  );
};

export default UserInfo;
