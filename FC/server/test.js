const http = require('http');

const BASE_URL = 'localhost';
const PORT = 3001;

// 简单的HTTP请求函数
function request(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// 测试套件
async function runTests() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║              🧪 FC游戏纪念馆服务器测试 🧪                 ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  let passed = 0;
  let failed = 0;

  // 测试1: 健康检查
  try {
    console.log('测试 1: 健康检查 (GET /api/health)');
    const res = await request('/api/health');
    if (res.status === 200 && res.data.status === 'ok') {
      console.log('  ✅ 通过 - 服务器运行正常');
      console.log(`  📊 版本: ${res.data.version}`);
      passed++;
    } else {
      console.log('  ❌ 失败');
      failed++;
    }
  } catch (e) {
    console.log('  ❌ 失败 - ' + e.message);
    failed++;
  }

  // 测试2: 统计信息
  try {
    console.log('\n测试 2: 统计信息 (GET /api/stats)');
    const res = await request('/api/stats');
    if (res.status === 200 && res.data.totalGames > 0) {
      console.log('  ✅ 通过 - 统计信息获取成功');
      console.log(`  📊 游戏总数: ${res.data.totalGames}`);
      console.log(`  📊 年份跨度: ${res.data.earliestYear}-${res.data.latestYear}`);
      passed++;
    } else {
      console.log('  ❌ 失败');
      failed++;
    }
  } catch (e) {
    console.log('  ❌ 失败 - ' + e.message);
    failed++;
  }

  // 测试3: 游戏列表
  try {
    console.log('\n测试 3: 游戏列表 (GET /api/games)');
    const res = await request('/api/games');
    if (res.status === 200 && res.data.games && res.data.games.length > 0) {
      console.log('  ✅ 通过 - 游戏列表获取成功');
      console.log(`  📊 游戏数量: ${res.data.total}`);
      console.log(`  🎮 第一款: ${res.data.games[0].name}`);
      passed++;
    } else {
      console.log('  ❌ 失败');
      failed++;
    }
  } catch (e) {
    console.log('  ❌ 失败 - ' + e.message);
    failed++;
  }

  // 测试4: 游戏详情
  try {
    console.log('\n测试 4: 游戏详情 (GET /api/games/1)');
    const res = await request('/api/games/1');
    if (res.status === 200 && res.data.id === 1) {
      console.log('  ✅ 通过 - 游戏详情获取成功');
      console.log(`  🎮 游戏名称: ${res.data.name}`);
      console.log(`  ⭐ 评分: ${res.data.rating}`);
      passed++;
    } else {
      console.log('  ❌ 失败');
      failed++;
    }
  } catch (e) {
    console.log('  ❌ 失败 - ' + e.message);
    failed++;
  }

  // 测试5: 游戏搜索
  try {
    console.log('\n测试 5: 游戏搜索 (GET /api/games?search=马里奥)');
    const res = await request('/api/games?search=马里奥');
    if (res.status === 200 && res.data.games.length > 0) {
      console.log('  ✅ 通过 - 搜索功能正常');
      console.log(`  🔍 搜索结果: ${res.data.games.length} 款游戏`);
      passed++;
    } else {
      console.log('  ❌ 失败');
      failed++;
    }
  } catch (e) {
    console.log('  ❌ 失败 - ' + e.message);
    failed++;
  }

  // 测试6: 年份筛选
  try {
    console.log('\n测试 6: 年份筛选 (GET /api/games?year=1985)');
    const res = await request('/api/games?year=1985');
    if (res.status === 200 && res.data.games.every(g => g.year === 1985)) {
      console.log('  ✅ 通过 - 年份筛选正常');
      console.log(`  📅 1985年游戏: ${res.data.total} 款`);
      passed++;
    } else {
      console.log('  ❌ 失败');
      failed++;
    }
  } catch (e) {
    console.log('  ❌ 失败 - ' + e.message);
    failed++;
  }

  // 测试7: 历史事件
  try {
    console.log('\n测试 7: 历史事件 (GET /api/events)');
    const res = await request('/api/events');
    if (res.status === 200 && res.data.length > 0) {
      console.log('  ✅ 通过 - 历史事件获取成功');
      console.log(`  📜 事件数量: ${res.data.length}`);
      passed++;
    } else {
      console.log('  ❌ 失败');
      failed++;
    }
  } catch (e) {
    console.log('  ❌ 失败 - ' + e.message);
    failed++;
  }

  // 测试8: 时间轴
  try {
    console.log('\n测试 8: 时间轴数据 (GET /api/timeline)');
    const res = await request('/api/timeline');
    if (res.status === 200 && res.data['1985']) {
      console.log('  ✅ 通过 - 时间轴数据获取成功');
      console.log(`  📊 1985年: ${res.data['1985'].gameCount} 款游戏`);
      passed++;
    } else {
      console.log('  ❌ 失败');
      failed++;
    }
  } catch (e) {
    console.log('  ❌ 失败 - ' + e.message);
    failed++;
  }

  // 测试9: 游戏类型
  try {
    console.log('\n测试 9: 游戏类型 (GET /api/genres)');
    const res = await request('/api/genres');
    if (res.status === 200 && res.data.length > 0) {
      console.log('  ✅ 通过 - 游戏类型获取成功');
      console.log(`  🎮 类型: ${res.data.join(', ')}`);
      passed++;
    } else {
      console.log('  ❌ 失败');
      failed++;
    }
  } catch (e) {
    console.log('  ❌ 失败 - ' + e.message);
    failed++;
  }

  // 测试10: 404处理
  try {
    console.log('\n测试 10: 404处理 (GET /api/games/999)');
    const res = await request('/api/games/999');
    if (res.status === 404) {
      console.log('  ✅ 通过 - 404错误处理正常');
      passed++;
    } else {
      console.log('  ❌ 失败');
      failed++;
    }
  } catch (e) {
    console.log('  ❌ 失败 - ' + e.message);
    failed++;
  }

  // 测试总结
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                      📊 测试总结 📊                       ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║   总计: ${passed + failed} 项测试                                ║`);
  console.log(`║   ✅ 通过: ${passed} 项                                        ║`);
  console.log(`║   ❌ 失败: ${failed} 项                                        ║`);
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  if (failed === 0) {
    console.log('🎉 所有测试全部通过！服务器运行正常。\n');
    process.exit(0);
  } else {
    console.log('⚠️  部分测试失败，请检查服务器状态。\n');
    process.exit(1);
  }
}

// 等待服务器启动
console.log('等待服务器启动...\n');
setTimeout(runTests, 3000);
