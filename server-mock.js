/**
 * 模拟服务端 - 用于测试认证系统
 *
 * 运行方式:
 * 1. npm install express jsonwebtoken bcrypt cors
 * 2. node server-mock.js
 * 3. 服务运行在 http://localhost:3001
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your-secret-key-change-this-in-production';

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据库
const users = new Map();

// 初始化测试用户
async function initTestUser() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  users.set('test', {
    id: 'user_001',
    username: 'test',
    email: 'test@example.com',
    password: hashedPassword,
    rating: 1500,
    createdAt: Date.now(),
  });
}

initTestUser();

// ============================================
// 认证中间件
// ============================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: '未提供 Token' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Token 无效或已过期' });
    }
    req.user = user;
    next();
  });
}

// ============================================
// 认证路由
// ============================================

// 注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 验证
    if (!username || !password || !email) {
      return res.status(400).json({ message: '请填写完整信息' });
    }

    if (users.has(username)) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 创建用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      rating: 1200,
      createdAt: Date.now(),
    };

    users.set(username, newUser);

    // 生成 Token
    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '7d' });

    // 返回（不返回密码）
    const { password: _, ...userWithoutPassword } = newUser;

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '注册失败' });
  }
});

// 登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = users.get(username);
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 Token
    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '7d' });

    // 返回（不返回密码）
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '登录失败' });
  }
});

// 获取当前用户信息
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = Array.from(users.values()).find((u) => u.id === req.user.userId);

  if (!user) {
    return res.status(404).json({ message: '用户不存在' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// 登出
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // 实际项目中可以在这里添加 token 黑名单逻辑
  res.json({ message: '登出成功' });
});

// 刷新 Token
app.post('/api/auth/refresh', authenticateToken, (req, res) => {
  const newToken = jwt.sign({ userId: req.user.userId, username: req.user.username }, SECRET_KEY, { expiresIn: '7d' });

  res.json({ token: newToken });
});

// ============================================
// 其他 API 示例（需要认证）
// ============================================

// 获取房间列表
app.get('/api/rooms', authenticateToken, (req, res) => {
  res.json({
    rooms: [
      { id: 'room_1', name: '新手房', players: 2, status: 'playing' },
      { id: 'room_2', name: '高手房', players: 1, status: 'waiting' },
    ],
  });
});

// 创建房间
app.post('/api/rooms', authenticateToken, (req, res) => {
  const { name, timeLimit } = req.body;
  const roomId = `room_${Date.now()}`;

  res.json({
    roomId,
    name,
    timeLimit,
    host: req.user.username,
  });
});

// ============================================
// 启动服务器
// ============================================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🎮 象棋认证模拟服务器已启动              ║
╠════════════════════════════════════════════╣
║   服务地址: http://localhost:${PORT}       ║
║   测试账号: test / 123456                  ║
╠════════════════════════════════════════════╣
║   可用接口:                                 ║
║   POST /api/auth/register  - 注册          ║
║   POST /api/auth/login     - 登录          ║
║   GET  /api/auth/me        - 获取用户信息  ║
║   POST /api/auth/logout    - 登出          ║
║   GET  /api/rooms          - 房间列表      ║
║   POST /api/rooms          - 创建房间      ║
╚════════════════════════════════════════════╝
  `);
});

module.exports = app;
