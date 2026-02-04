# 🎮 FC游戏纪念馆

重温黄金时代，记录游戏记忆

一个专注于FC（Family Computer）游戏历史的在线平台，记录1983-2003年间20年的FC游戏发展历程。

![FC Style](https://img.shields.io/badge/Style-FC红白机-red)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📁 项目结构

```
FC/
├── web/                    # 前端页面（红白机风格）
│   └── index.html         # 主页面
├── server/                # 后端服务（Node.js）
│   ├── package.json       # 依赖配置
│   ├── index.js          # 主服务
│   └── test.js           # 测试脚本
└── README.md             # 项目说明
```

## ✨ 功能特性

### 前端（红白机经典风格）
- 🎮 8-bit像素风格UI设计
- 🎨 红白机经典红+白配色
- 📱 响应式布局，支持移动端
- ⚡ 纯HTML/CSS/JS，无需构建

### 后端API
- 🎲 游戏数据库（6款经典FC游戏）
- 🔍 游戏搜索与筛选
- 📅 历史时间轴展示
- 📊 统计信息API

## 🚀 快速开始

### 1. 启动后端服务

```bash
cd server
npm install
npm start
```

服务将在 http://localhost:3001 启动

### 2. 运行测试

```bash
npm test
```

### 3. 访问前端

直接在浏览器中打开 `web/index.html`，或使用Live Server等工具

前端页面会自动连接本地后端API

## 📡 API 端点

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /api/health | 健康检查 |
| GET | /api/stats | 统计信息 |
| GET | /api/games | 游戏列表 |
| GET | /api/games/:id | 游戏详情 |
| GET | /api/events | 历史事件 |
| GET | /api/timeline | 时间轴数据 |
| GET | /api/genres | 游戏类型 |
| GET | /api/years | 年份列表 |

## 🎮 收录游戏

- 超级马里奥兄弟 (1985)
- 魂斗罗 (1987)
- 塞尔达传说 (1986)
- 坦克大战 (1985)
- 勇者斗恶龙 (1986)
- 双截龙 (1988)

## 🖼️ 界面预览

- 首页：统计面板 + 经典推荐
- 游戏百科：搜索 + 筛选 + 游戏网格
- 历史回顾：时间轴展示
- 游戏详情：弹窗展示详细信息

## 📄 技术栈

- **前端**: 纯HTML5 + CSS3 + JavaScript
- **后端**: Node.js + Express
- **样式**: 自定义CSS（红白机风格）
- **字体**: Press Start 2P (Google Fonts)

## 📝 许可证

MIT License

---

致敬经典，致敬童年 🕹️
