/**
 * EV Fleet Monitor Server
 * 新能源车辆监控大屏后端服务
 *
 * 功能：
 * - REST API 获取车辆数据
 * - WebSocket 实时推送车辆位置更新
 * - 静态文件服务托管前端页面
 */

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ==================== 模拟数据生成 ====================
const VEHICLE_COUNT = 200;
const VEHICLE_TYPES = ['厢式货车', '冷链车', '平板车', '集装箱'];
const DISTRICTS = ['浦东新区', '闵行区', '松江区', '嘉定区', '宝山区', '青浦区'];
const DRIVERS = ['张师傅', '李师傅', '王师傅', '刘师傅', '陈师傅', '杨师傅', '赵师傅', '黄师傅'];

// 上海地区边界
const SHANGHAI_BOUNDS = {
    lat: { min: 30.9, max: 31.5 },
    lng: { min: 121.0, max: 121.9 }
};

// 生成随机车牌
function generatePlate() {
    return `沪A·D${Math.floor(Math.random() * 90000) + 10000}`;
}

// 生成车辆数据
function generateVehicles() {
    const vehicles = [];

    for (let i = 0; i < VEHICLE_COUNT; i++) {
        const battery = Math.random() > 0.1
            ? Math.floor(Math.random() * 70) + 30
            : Math.floor(Math.random() * 20) + 5;

        const status = battery < 15
            ? 'charging'
            : (Math.random() > 0.98 ? 'offline' : 'online');

        const vehicle = {
            id: `EV${String(i + 1).padStart(4, '0')}`,
            plate: generatePlate(),
            type: VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)],
            driver: DRIVERS[Math.floor(Math.random() * DRIVERS.length)],
            battery: battery,
            status: status,
            speed: status === 'online' ? Math.floor(Math.random() * 80) : 0,
            mileage: Math.floor(Math.random() * 50000) + 10000,
            lat: SHANGHAI_BOUNDS.lat.min + Math.random() * (SHANGHAI_BOUNDS.lat.max - SHANGHAI_BOUNDS.lat.min),
            lng: SHANGHAI_BOUNDS.lng.min + Math.random() * (SHANGHAI_BOUNDS.lng.max - SHANGHAI_BOUNDS.lng.min),
            district: DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)],
            temperature: Math.floor(Math.random() * 15) + 20,
            lastUpdate: new Date().toISOString()
        };

        // 存储原始位置用于模拟移动
        vehicle.baseLat = vehicle.lat;
        vehicle.baseLng = vehicle.lng;
        vehicle.direction = Math.random() * Math.PI * 2;

        vehicles.push(vehicle);
    }

    return vehicles;
}

// 初始化车辆数据
let vehicles = generateVehicles();

// 生成告警数据
function generateAlerts() {
    const alerts = [];
    const lowBatteryVehicles = vehicles.filter(v => v.battery < 15 && v.status !== 'charging');

    lowBatteryVehicles.slice(0, 3).forEach((v, i) => {
        alerts.push({
            id: `ALERT${i + 1}`,
            type: 'low_battery',
            level: 'warning',
            vehicleId: v.id,
            plate: v.plate,
            message: `电量过低 (${v.battery}%)`,
            timestamp: new Date(Date.now() - i * 300000).toISOString()
        });
    });

    const offlineVehicles = vehicles.filter(v => v.status === 'offline');
    if (offlineVehicles.length > 0) {
        alerts.push({
            id: `ALERT${alerts.length + 1}`,
            type: 'offline',
            level: 'error',
            vehicleId: offlineVehicles[0].id,
            plate: offlineVehicles[0].plate,
            message: '信号丢失，离线15分钟',
            timestamp: new Date(Date.now() - 600000).toISOString()
        });
    }

    return alerts;
}

// ==================== REST API 路由 ====================

// 获取所有车辆
app.get('/api/vehicles', (req, res) => {
    const { status, district, page = 1, limit = 50 } = req.query;

    let result = [...vehicles];

    if (status) {
        result = result.filter(v => v.status === status);
    }

    if (district) {
        result = result.filter(v => v.district === district);
    }

    // 分页
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const paginated = result.slice(start, end);

    res.json({
        code: 0,
        data: paginated,
        pagination: {
            total: result.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(result.length / limit)
        }
    });
});

// 获取单个车辆详情
app.get('/api/vehicles/:id', (req, res) => {
    const vehicle = vehicles.find(v => v.id === req.params.id);

    if (!vehicle) {
        return res.status(404).json({
            code: 404,
            message: '车辆不存在'
        });
    }

    res.json({
        code: 0,
        data: vehicle
    });
});

// 获取统计概览
app.get('/api/statistics/overview', (req, res) => {
    const online = vehicles.filter(v => v.status === 'online').length;
    const charging = vehicles.filter(v => v.status === 'charging').length;
    const offline = vehicles.filter(v => v.status === 'offline').length;

    const batteryStats = {
        high: vehicles.filter(v => v.battery > 80).length,
        normal: vehicles.filter(v => v.battery >= 30 && v.battery <= 80).length,
        low: vehicles.filter(v => v.battery < 30 && v.status !== 'charging').length,
        charging: charging
    };

    res.json({
        code: 0,
        data: {
            total: VEHICLE_COUNT,
            online,
            charging,
            offline,
            batteryStats,
            todayMileage: 12847,
            todayPower: 2456,
            carbonSaved: 8.2
        }
    });
});

// 获取告警列表
app.get('/api/alerts', (req, res) => {
    res.json({
        code: 0,
        data: generateAlerts()
    });
});

// 获取区域分布
app.get('/api/statistics/districts', (req, res) => {
    const distribution = DISTRICTS.map(district => ({
        name: district,
        count: vehicles.filter(v => v.district === district).length
    })).sort((a, b) => b.count - a.count);

    res.json({
        code: 0,
        data: distribution
    });
});

// 获取实时趋势数据（模拟24小时）
app.get('/api/statistics/trends', (req, res) => {
    const hours = Array.from({ length: 12 }, (_, i) => {
        const hour = i * 2;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    const onlineData = [120, 135, 150, 165, 180, 175, 170, 182, 186, 184, 188, 186];
    const mileageData = [800, 1200, 1800, 2400, 3200, 4100, 5200, 6400, 7800, 9200, 10800, 12847];

    res.json({
        code: 0,
        data: {
            hours,
            online: onlineData,
            mileage: mileageData
        }
    });
});

// ==================== WebSocket 实时推送 ====================

// 更新车辆位置（模拟移动）
function updateVehiclePositions() {
    vehicles.forEach(vehicle => {
        if (vehicle.status === 'online') {
            // 随机速度变化
            vehicle.speed = Math.max(0, Math.min(80, vehicle.speed + (Math.random() - 0.5) * 10));

            // 如果速度为0，有一定概率重新启动
            if (vehicle.speed === 0 && Math.random() > 0.7) {
                vehicle.speed = Math.floor(Math.random() * 40) + 20;
            }

            // 根据速度和方向移动
            if (vehicle.speed > 0) {
                const moveDistance = (vehicle.speed / 3600) * 0.01; // 简化移动计算
                vehicle.lat += Math.sin(vehicle.direction) * moveDistance;
                vehicle.lng += Math.cos(vehicle.direction) * moveDistance;

                // 随机改变方向
                vehicle.direction += (Math.random() - 0.5) * 0.5;

                // 确保在范围内
                if (vehicle.lat < SHANGHAI_BOUNDS.lat.min || vehicle.lat > SHANGHAI_BOUNDS.lat.max) {
                    vehicle.direction = -vehicle.direction;
                    vehicle.lat = Math.max(SHANGHAI_BOUNDS.lat.min, Math.min(SHANGHAI_BOUNDS.lat.max, vehicle.lat));
                }
                if (vehicle.lng < SHANGHAI_BOUNDS.lng.min || vehicle.lng > SHANGHAI_BOUNDS.lng.max) {
                    vehicle.direction = Math.PI - vehicle.direction;
                    vehicle.lng = Math.max(SHANGHAI_BOUNDS.lng.min, Math.min(SHANGHAI_BOUNDS.lng.max, vehicle.lng));
                }

                // 电量消耗
                vehicle.battery = Math.max(5, vehicle.battery - 0.02);

                // 里程增加
                vehicle.mileage += vehicle.speed / 3600;
            }

            // 如果电量低于15%，进入充电状态
            if (vehicle.battery < 15 && vehicle.status !== 'charging' && Math.random() > 0.9) {
                vehicle.status = 'charging';
                vehicle.speed = 0;
            }

            // 充电中电量恢复
            if (vehicle.status === 'charging') {
                vehicle.battery = Math.min(100, vehicle.battery + 0.5);
                if (vehicle.battery >= 90) {
                    vehicle.status = 'online';
                }
            }

            vehicle.lastUpdate = new Date().toISOString();
        }
    });
}

// 广播数据给所有连接的客户端
function broadcastData() {
    const online = vehicles.filter(v => v.status === 'online').length;
    const charging = vehicles.filter(v => v.status === 'charging').length;
    const offline = vehicles.filter(v => v.status === 'offline').length;

    const data = {
        type: 'update',
        timestamp: new Date().toISOString(),
        statistics: {
            total: VEHICLE_COUNT,
            online,
            charging,
            offline
        },
        vehicles: vehicles.map(v => ({
            id: v.id,
            lat: v.lat,
            lng: v.lng,
            speed: v.speed,
            battery: Math.round(v.battery),
            status: v.status,
            mileage: Math.round(v.mileage)
        }))
    };

    const message = JSON.stringify(data);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// WebSocket 连接处理
wss.on('connection', (ws) => {
    console.log('🟢 新的客户端连接');

    // 发送初始数据
    ws.send(JSON.stringify({
        type: 'init',
        data: vehicles
    }));

    // 处理客户端消息
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('📨 收到消息:', data);

            // 处理订阅请求
            if (data.type === 'subscribe') {
                ws.send(JSON.stringify({
                    type: 'subscribed',
                    channel: data.channel
                }));
            }
        } catch (error) {
            console.error('❌ 消息解析错误:', error);
        }
    });

    ws.on('close', () => {
        console.log('🔴 客户端断开连接');
    });

    ws.on('error', (error) => {
        console.error('⚠️ WebSocket 错误:', error);
    });
});

// 定期更新和广播数据（每3秒）
setInterval(() => {
    updateVehiclePositions();
    broadcastData();
}, 3000);

// ==================== 启动服务器 ====================

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║        🚛 EV Fleet Monitor Server 🚛                   ║
║   新能源车辆监控大屏后端服务                             ║
╠════════════════════════════════════════════════════════╣
║  🌐 HTTP Server: http://localhost:${PORT}                ║
║  📡 WebSocket:   ws://localhost:${PORT}                  ║
║                                                        ║
║  📋 API 端点:                                           ║
║    GET /api/vehicles          - 获取车辆列表            ║
║    GET /api/vehicles/:id      - 获取车辆详情            ║
║    GET /api/statistics/overview - 获取统计概览          ║
║    GET /api/statistics/districts - 获取区域分布         ║
║    GET /api/statistics/trends - 获取趋势数据            ║
║    GET /api/alerts            - 获取告警列表            ║
╚════════════════════════════════════════════════════════╝
    `);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('👋 正在关闭服务器...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});