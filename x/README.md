# X Content Hub

一个自动抓取 x.com (Twitter) 内容并按分类展示的实时热点聚合平台。

## 项目结构

```
x/
├── index.html          # 前端展示页面
├── server/             # 后端服务
│   ├── server.js      # 主服务文件
│   └── package.json   # 依赖配置
└── README.md          # 说明文档
```

## 功能特性

- 📊 **智能分类**: 自动将内容分类为科技、财经、新闻、娱乐、体育、生活六大类别
- 🔄 **定时抓取**: 每10分钟自动抓取最新内容
- 🎨 **精美界面**: 类似 X(Twitter) 的现代化深色主题设计
- 📱 **响应式布局**: 适配桌面和移动设备
- 🔍 **分类筛选**: 支持按分类浏览内容
- 📈 **热门排序**: 支持按时间或热度排序
- 📊 **实时统计**: 显示各类别内容数量统计

## 快速开始

### 1. 安装依赖

```bash
cd x/server
npm install
```

### 2. 启动服务器

```bash
npm start
# 或开发模式（自动重启）
npm run dev
```

服务器将在 `http://localhost:3001` 启动。

### 3. 打开前端页面

直接在浏览器中打开 `x/index.html` 文件，或使用 Live Server 等工具。

## API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/tweets` | GET | 获取推文列表，支持 `category` 和 `limit` 参数 |
| `/api/stats` | GET | 获取分类统计数据 |
| `/api/refresh` | POST | 手动触发数据更新 |

### 示例请求

```bash
# 获取全部推文
curl http://localhost:3001/api/tweets

# 获取科技分类前10条
curl "http://localhost:3001/api/tweets?category=tech&limit=10"

# 获取统计数据
curl http://localhost:3001/api/stats

# 手动刷新数据
curl -X POST http://localhost:3001/api/refresh
```

## 配置说明

### 使用真实 Twitter API（可选）

默认使用模拟数据。如需抓取真实数据，需要：

1. 申请 [Twitter Developer Account](https://developer.twitter.com/)
2. 创建项目并获取 Bearer Token
3. 设置环境变量：

```bash
export TWITTER_BEARER_TOKEN="your_bearer_token_here"
```

然后在 `server.js` 中取消 `scrapeWithAPI()` 的注释。

### 自定义分类关键词

在 `server.js` 中修改 `CATEGORIES` 配置：

```javascript
const CATEGORIES = {
  tech: {
    name: '科技',
    keywords: ['AI', '编程', ...],  // 添加你的关键词
    color: '#1d9bf0'
  },
  // ... 其他分类
};
```

## 分类说明

| 分类 | 关键词示例 | 颜色 |
|------|----------|------|
| 科技 | AI, 编程, 软件, Apple, OpenAI | 🔵 蓝色 |
| 财经 | 股票, 比特币, 投资, 市场 | 🟢 绿色 |
| 新闻 | 突发, 头条, 报道, 公告 | 🔴 红色 |
| 娱乐 | 电影, 音乐, 游戏, 明星 | 🩷 粉色 |
| 体育 | NBA, 世界杯, 冠军, 比赛 | 🟡 黄色 |
| 生活 | 美食, 旅游, 健康, 时尚 | 🟣 紫色 |

## 注意事项

1. **数据存储**: 数据保存在 `server/data.json` 中，重启服务不会丢失
2. **抓取频率**: 默认每10分钟抓取一次，可通过修改 `cron.schedule` 调整
3. **反爬虫**: x.com 有严格的反爬虫机制，建议使用官方 API
4. **CORS**: 前端直接访问 API 可能遇到跨域问题，开发时可使用浏览器插件解决

## 技术栈

- **前端**: 原生 HTML/CSS/JavaScript
- **后端**: Node.js + Express
- **定时任务**: node-cron
- **数据抓取**: Axios / Puppeteer / Twitter API v2

## License

MIT
