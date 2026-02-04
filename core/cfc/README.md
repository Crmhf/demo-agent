# 🚛 EV Fleet Monitor - 新能源车辆监控大屏

一个基于 Web 的新能源物流车辆实时监控大屏系统，包含精美的可视化界面和实时数据推送。

## ✨ 特性

- **🗺️ 实时地图监控** - 基于 Leaflet 的暗色地图，200 辆电动车实时位置追踪
- **📊 数据可视化** - 电池状态、运营趋势、区域分布等多维度图表
- **⚡ 实时推送** - WebSocket 实时推送车辆位置更新
- **🎨 精美 UI** - 暗色 OLED 主题 + 玻璃态设计
- **📱 响应式布局** - 适配大屏幕展示

## 🚀 快速开始

### 安装依赖

```bash
cd core/cfc
npm install
```

### 启动服务器

```bash
npm start
```

或使用开发模式（热重载）：

```bash
npm run dev
```

### 访问应用

打开浏览器访问：`http://localhost:3000`

## 📡 API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/vehicles` | GET | 获取车辆列表（支持分页、筛选） |
| `/api/vehicles/:id` | GET | 获取车辆详情 |
| `/api/statistics/overview` | GET | 获取统计概览 |
| `/api/statistics/districts` | GET | 获取区域分布 |
| `/api/statistics/trends` | GET | 获取趋势数据 |
| `/api/alerts` | GET | 获取告警列表 |

### WebSocket 实时数据

连接 `ws://localhost:3000` 即可接收实时车辆数据更新，每 3 秒推送一次。

## 🏗️ 项目结构

```
cfc/
├── vehicle-dashboard.html    # 前端大屏页面
├── server.js                 # Node.js 后端服务
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

## 🛠️ 技术栈

### 前端
- **Tailwind CSS** - 原子化 CSS 框架
- **Leaflet** - 开源地图库
- **Chart.js** - 图表可视化
- **Lucide Icons** - 图标库

### 后端
- **Express** - Web 框架
- **WebSocket (ws)** - 实时通信
- **CORS** - 跨域支持

## 📈 功能模块

### 1. 车辆监控
- 200 辆电动车实时位置显示
- 车辆状态：在线/充电中/离线
- 点击查看车辆详情（车牌、司机、电量、速度等）

### 2. 数据统计
- 车辆总览：总数/在线/充电/离线
- 电池状态分布
- 区域分布统计
- 今日运营数据（里程、耗电、碳减排）

### 3. 实时告警
- 低电量告警
- 离线告警
- 充电完成通知

### 4. 趋势分析
- 24 小时在线车辆趋势
- 累计里程走势

## 🔧 自定义配置

### 修改车辆数量
编辑 `server.js` 中的 `VEHICLE_COUNT` 常量：

```javascript
const VEHICLE_COUNT = 200;  // 修改为你需要的数量
```

### 修改地图中心位置
编辑 `server.js` 中的 `SHANGHAI_BOUNDS`：

```javascript
const SHANGHAI_BOUNDS = {
    lat: { min: 30.9, max: 31.5 },  // 纬度范围
    lng: { min: 121.0, max: 121.9 }  // 经度范围
};
```

## 📝 License

MIT
