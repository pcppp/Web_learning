# React + Vite
以下是一个学习 React 技术的仓库 `README.md` 模板，你可以根据自己的学习目标和进度进行调整和补充：

---

# **React 深入学习仓库**

欢迎来到我的 **React 深入学习仓库**！🎉  
此仓库记录了我在学习 React 及相关技术栈过程中的实践、思考和总结，旨在不断提升 React 开发技能，提炼项目中的重难点以应对更复杂、更高效的应用开发需求。

---

## 🚀 **学习目标**

1. 熟练掌握 React 核心概念（Hooks、Context、组件生命周期等）。
2. 理解 React 高级特性（性能优化、React.memo、Suspense、React.lazy 等）。
3. 理解 React 状态管理工具（Redux、MobX、Zustand、Recoil 等）以及最佳实践。
4. 探索 React 与 TypeScript 的结合使用。
5. 学习服务端渲染（SSR）与静态生成（SSG）（如 Next.js）。
6. 使用 React 构建现代化前端项目，并学会测试（Jest、React Testing Library）。
7. 深入理解 React 渲染原理与 Fiber 架构。

---

## 🗂️ **目录结构**

```
│
├── /src                   # 主项目代码目录
│   ├── /components        # 组件示例与封装的基础组件
│   ├── /hooks             # 自定义 Hook 示例
│   ├── /state-management  # 状态管理工具实践（Redux、Zustand 等）
│   ├── /pages             # 示例页面
│
├── README.md              # 项目说明文档
└── package.json           # 项目依赖文件
```

---

## ✨ **学习内容**

学习重难点:
    虚拟列表的优化(滚动过快导致的白屏)
    文件夹上传(并发处理)
    微前端
    二次封装组件
    前端监控（数据埋点/js错误/性能指标统计fp pcp lcp）

### **1️⃣ React 基础**
- **组件化开发**：
  - 函数组件 vs 类组件。
  - Props 和 State 的理解与使用。
- **JSX 语法**：
  - JSX 的基本语法规则。
  - 条件渲染、列表渲染。
- **事件处理**：
  - React 中事件绑定与 SyntheticEvent。
- **组件生命周期**：
  - 从类组件生命周期到函数组件的 Hooks 使用。

#### 实践任务：
- 创建一个 五子棋 应用。
- 实现 回溯 功能。

---

### **2️⃣ React Hooks**
- 常见 Hooks 的深入学习：
  - `useState`、`useEffect`、`useContext`。
- 高级 Hooks 的使用：
  - `useReducer`、`useMemo`、`useCallback`。
- 自定义 Hook 的编写：
  - 如何设计清晰、可复用的逻辑。

#### 实践任务：
- 自定义一个 `useThrottleAndDebounce` Hook。
- 自定义一个 虚拟列表 Hook。
- 封装一个 `useFetch` 钩子，用于异步数据请求。

---

### **3️⃣ React 性能优化**
- 虚拟 DOM 与渲染过程分析。
- 避免不必要的重新渲染：
  - `React.memo`、`useMemo` 和 `useCallback` 的实际应用。
- 使用 `React.lazy` 和 `Suspense` 实现代码分割与按需加载。
- 开启生产环境的调优工具，如 `React DevTools Profiler`。

#### 实践任务：
- 优化一个包含大量子组件的应用，减少多余的重渲染。
- 添加动态路由懒加载功能。

---

### **4️⃣ React 状态管理**
- 掌握内置状态管理方案：
  - React Context API。
- 学习流行的状态管理工具：
  - Redux（结合 Redux Toolkit）、MobX、Zustand、Recoil。
- 理解如何拆分全局状态与局部状态。

#### 实践任务：
- 编写一个多人聊天室应用，使用 Redux 管理消息列表。
- 使用 Zustand 重构一个小型计数器应用。

---

### **5️⃣ React 与 TypeScript**
- 类型安全的组件编写：
  - 针对 Props、State、事件的类型定义。
- 自定义 Hook 与泛型的结合。
- 使用 `React.FC` 和函数式组件的类型约束。

#### 实践任务：
- 将已有的 React 项目迁移为 TypeScript 项目。
- 为一个复杂表单组件添加全面的类型支持。

---

### **6️⃣ 服务端渲染（SSR）与静态生成（SSG）**
- 入门 Next.js 框架。
- 理解 `getServerSideProps`、`getStaticProps` 和 `getStaticPaths` 的作用。
- 在 SSR 项目中实现用户认证流程。

#### 实践任务：
- 使用 Next.js 构建一个博客平台，实现静态生成与增量更新。

---

### **7️⃣ React 测试**
- 单元测试与集成测试：
  - 使用 Jest 测试工具函数、组件逻辑。
  - 配合 React Testing Library 做 UI 测试。
- Mock API 请求的方式（如 `msw`）。

#### 实践任务：
- 为核心组件编写单元测试。
- 测试一个包含 API 数据交互的表格组件。

---

### **8️⃣ 深入理解 React 原理**
- React Fiber 架构：
  - 什么是 Fiber？为什么需要它？
  - React 的协调与提交阶段解析。
- React Diff 算法的实现原理。
- React 并发模式（Concurrent Mode）。

#### 实践任务：
- 使用 React Profiler 分析和优化渲染性能。
- 研究 Concurrent Features（如 `useTransition` 和 `Suspense`）。

---

## 📦 **运行项目**

### **安装依赖：**

```bash
npm install
```

### **启动开发服务器：**

```bash
npm run dev
```



## 🤝 **贡献指南**

如果你对本仓库有任何建议或改进意见，欢迎通过 Issue 或 Pull Request 的形式参与进来！



希望这个模板能帮助你构建一个优秀的 React 学习仓库！🎉 如果有其他需求，请随时告诉我 😊
