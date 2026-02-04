const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// FC游戏数据库（模拟数据）
const gamesDB = [
  {
    id: 1,
    name: '超级马里奥兄弟',
    nameEn: 'Super Mario Bros.',
    nameJp: 'スーパーマリオブラザーズ',
    year: 1985,
    developer: '任天堂',
    publisher: '任天堂',
    genre: '动作',
    rating: 9.8,
    cover: 'https://via.placeholder.com/256x360/e60012/fff?text=Mario',
    screenshots: [
      'https://via.placeholder.com/400x300/e60012/fff?text=Screen+1',
      'https://via.placeholder.com/400x300/e60012/fff?text=Screen+2'
    ],
    description: '《超级马里奥兄弟》是任天堂于1985年发售的横版过关游戏，是FC平台上最畅销的游戏之一。玩家控制马里奥在蘑菇王国中冒险，拯救被库巴绑架的碧奇公主。游戏以其创新的玩法、精心设计的关卡和流畅的操作手感，成为游戏史上的里程碑之作。',
    levels: 32,
    players: 2,
    difficulty: '中等',
    playTime: '约3小时'
  },
  {
    id: 2,
    name: '魂斗罗',
    nameEn: 'Contra',
    nameJp: '魂斗羅',
    year: 1987,
    developer: '科乐美',
    publisher: '科乐美',
    genre: '射击',
    rating: 9.5,
    cover: 'https://via.placeholder.com/256x360/0066cc/fff?text=Contra',
    screenshots: [
      'https://via.placeholder.com/400x300/0066cc/fff?text=Screen+1',
      'https://via.placeholder.com/400x300/0066cc/fff?text=Screen+2'
    ],
    description: '《魂斗罗》是科乐美于1987年推出的经典射击游戏。游戏以未来世界为背景，玩家扮演特种兵比尔或兰斯，与外星入侵者作战。游戏以其高难度、丰富的武器系统和双人合作模式而闻名，"上上下下左右左右BA"的30条命秘籍更是成为游戏文化中的经典。',
    levels: 8,
    players: 2,
    difficulty: '困难',
    playTime: '约1小时'
  },
  {
    id: 3,
    name: '塞尔达传说',
    nameEn: 'The Legend of Zelda',
    nameJp: 'ゼルダの伝説',
    year: 1986,
    developer: '任天堂',
    publisher: '任天堂',
    genre: '动作冒险',
    rating: 9.6,
    cover: 'https://via.placeholder.com/256x360/009944/fff?text=Zelda',
    screenshots: [
      'https://via.placeholder.com/400x300/009944/fff?text=Screen+1',
      'https://via.placeholder.com/400x300/009944/fff?text=Screen+2'
    ],
    description: '《塞尔达传说》是任天堂于1986年发售的动作冒险游戏，是塞尔达系列的开山之作。游戏采用俯视视角，玩家控制林克在海拉鲁大陆上探索、解谜、战斗，最终击败加农拯救塞尔达公主。游戏首创了存档功能，是家用机游戏发展史上的重要里程碑。',
    levels: '开放世界',
    players: 1,
    difficulty: '中等',
    playTime: '约10小时'
  },
  {
    id: 4,
    name: '坦克大战',
    nameEn: 'Battle City',
    nameJp: 'バトルシティー',
    year: 1985,
    developer: '南梦宫',
    publisher: '南梦宫',
    genre: '射击',
    rating: 8.9,
    cover: 'https://via.placeholder.com/256x360/ff8800/fff?text=Tank',
    screenshots: [
      'https://via.placeholder.com/400x300/ff8800/fff?text=Screen+1',
      'https://via.placeholder.com/400x300/ff8800/fff?text=Screen+2'
    ],
    description: '《坦克大战》是南梦宫于1985年推出的坦克射击游戏。玩家控制坦克保卫基地，消灭敌方坦克。游戏支持双人合作，包含35个关卡和丰富的地形元素。这款游戏在中国尤其受欢迎，是许多人童年的美好回忆。',
    levels: 35,
    players: 2,
    difficulty: '简单',
    playTime: '约1小时'
  },
  {
    id: 5,
    name: '勇者斗恶龙',
    nameEn: 'Dragon Quest',
    nameJp: 'ドラゴンクエスト',
    year: 1986,
    developer: 'Chunsoft',
    publisher: '艾尼克斯',
    genre: 'RPG',
    rating: 9.3,
    cover: 'https://via.placeholder.com/256x360/663399/fff?text=DQ',
    screenshots: [
      'https://via.placeholder.com/400x300/663399/fff?text=Screen+1',
      'https://via.placeholder.com/400x300/663399/fff?text=Screen+2'
    ],
    description: '《勇者斗恶龙》是艾尼克斯于1986年发售的角色扮演游戏，是日本RPG的开山鼻祖之一。游戏由堀井雄二编剧、椙山浩一作曲、鸟山明负责角色设计。玩家扮演勇者，收集光之徽章，击败龙王拯救世界。游戏奠定了日本RPG的基础框架。',
    levels: '线性剧情',
    players: 1,
    difficulty: '中等',
    playTime: '约20小时'
  },
  {
    id: 6,
    name: '双截龙',
    nameEn: 'Double Dragon',
    nameJp: '双截龍',
    year: 1988,
    developer: 'Technōs',
    publisher: 'Technōs',
    genre: '格斗',
    rating: 8.7,
    cover: 'https://via.placeholder.com/256x360/cc0000/fff?text=DD',
    screenshots: [
      'https://via.placeholder.com/400x300/cc0000/fff?text=Screen+1',
      'https://via.placeholder.com/400x300/cc0000/fff?text=Screen+2'
    ],
    description: '《双截龙》是Technōs于1988年推出的横版格斗游戏。玩家控制比利或吉米，通过拳脚和各种武器击败敌人，拯救被绑架的玛丽安。游戏引入了多种格斗招式和武器系统，是清版动作游戏的代表作。',
    levels: 4,
    players: 2,
    difficulty: '中等',
    playTime: '约1小时'
  }
];

// 历史事件数据
const eventsDB = [
  {
    id: 1,
    year: 1983,
    title: 'FC红白机发售',
    titleEn: 'Famicom Release',
    description: '1983年7月15日，任天堂在日本发售Family Computer（简称FC），售价14800日元。首发游戏包括《大金刚》、《大金刚Jr.》和《大力水手》。',
    image: 'https://via.placeholder.com/600x400/e60012/fff?text=1983+FC+Release',
    importance: 'high'
  },
  {
    id: 2,
    year: 1985,
    title: '超级马里奥兄弟发售',
    titleEn: 'Super Mario Bros. Release',
    description: '1985年9月13日，《超级马里奥兄弟》在日本发售。这款游戏重新定义了横版过关游戏，成为FC平台最畅销的游戏，全球销量超过4000万份。',
    image: 'https://via.placeholder.com/600x400/e60012/fff?text=1985+Mario',
    importance: 'high'
  },
  {
    id: 3,
    year: 1987,
    title: '魂斗罗发售',
    titleEn: 'Contra Release',
    description: '1987年2月20日，科乐美《魂斗罗》发售。这款射击游戏以其高难度和出色的双人合作模式成为经典，"30条命秘籍"流传至今。',
    image: 'https://via.placeholder.com/600x400/0066cc/fff?text=1987+Contra',
    importance: 'medium'
  },
  {
    id: 4,
    year: 1987,
    title: '最终幻想诞生',
    titleEn: 'Final Fantasy Release',
    description: '1987年12月18日，史克威尔发售《最终幻想》。这款游戏是坂口博信的背水一战，最终大获成功，开启了JRPG的黄金时代。',
    image: 'https://via.placeholder.com/600x400/009944/fff?text=1987+FF',
    importance: 'high'
  },
  {
    id: 5,
    year: 1990,
    title: 'SFC超级任天堂发售',
    titleEn: 'Super Famicom Release',
    description: '1990年11月21日，超级任天堂（SFC）在日本发售。虽然新一代主机到来，但FC仍然持续发售游戏，直至2003年停产。',
    image: 'https://via.placeholder.com/600x400/e60012/fff?text=1990+SFC',
    importance: 'high'
  },
  {
    id: 6,
    year: 2003,
    title: 'FC正式停产',
    titleEn: 'Famicom Discontinued',
    description: '2003年9月25日，任天堂宣布FC正式停产，结束了长达20年的生产历史。FC全球销量超过6100万台，游戏销量超过5亿份。',
    image: 'https://via.placeholder.com/600x400/666/fff?text=2003+End',
    importance: 'high'
  }
];

// 统计信息
const statsDB = {
  totalGames: 1052,
  totalYears: 20,
  totalDevelopers: 45,
  mostPopularGenre: '动作',
  highestRatedGame: '超级马里奥兄弟',
  earliestYear: 1983,
  latestYear: 2003
};

// ===== API 路由 =====

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'FC游戏纪念馆服务器运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 获取统计信息
app.get('/api/stats', (req, res) => {
  res.json(statsDB);
});

// 获取所有游戏
app.get('/api/games', (req, res) => {
  const { year, genre, search, sort = 'rating', order = 'desc' } = req.query;

  let games = [...gamesDB];

  // 筛选
  if (year) {
    games = games.filter(g => g.year === parseInt(year));
  }
  if (genre) {
    games = games.filter(g => g.genre === genre);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    games = games.filter(g =>
      g.name.toLowerCase().includes(searchLower) ||
      g.nameEn.toLowerCase().includes(searchLower) ||
      g.developer.toLowerCase().includes(searchLower)
    );
  }

  // 排序
  games.sort((a, b) => {
    let aVal = a[sort];
    let bVal = b[sort];
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  res.json({
    total: games.length,
    games: games
  });
});

// 获取单个游戏详情
app.get('/api/games/:id', (req, res) => {
  const game = gamesDB.find(g => g.id === parseInt(req.params.id));
  if (!game) {
    return res.status(404).json({ error: '游戏不存在' });
  }

  // 获取相似游戏推荐
  const similarGames = gamesDB
    .filter(g => g.id !== game.id && (g.genre === game.genre || g.year === game.year))
    .slice(0, 3);

  res.json({
    ...game,
    similarGames
  });
});

// 获取游戏类型列表
app.get('/api/genres', (req, res) => {
  const genres = [...new Set(gamesDB.map(g => g.genre))];
  res.json(genres);
});

// 获取年份列表
app.get('/api/years', (req, res) => {
  const years = [...new Set(gamesDB.map(g => g.year))].sort();
  res.json(years);
});

// 获取历史事件
app.get('/api/events', (req, res) => {
  res.json(eventsDB);
});

// 获取单个事件
app.get('/api/events/:id', (req, res) => {
  const event = eventsDB.find(e => e.id === parseInt(req.params.id));
  if (!event) {
    return res.status(404).json({ error: '事件不存在' });
  }
  res.json(event);
});

// 按年份获取时间轴数据
app.get('/api/timeline', (req, res) => {
  const timeline = {};
  for (let year = 1983; year <= 2003; year++) {
    const yearGames = gamesDB.filter(g => g.year === year);
    const yearEvents = eventsDB.filter(e => e.year === year);
    timeline[year] = {
      gameCount: yearGames.length,
      games: yearGames,
      events: yearEvents
    };
  }
  res.json(timeline);
});

// 用户相关（模拟数据）
const usersDB = [];
const userGamesDB = []; // 用户游戏记录

// 用户登录/注册
app.post('/api/auth/login', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: '用户名不能为空' });
  }

  let user = usersDB.find(u => u.username === username);
  if (!user) {
    user = {
      id: usersDB.length + 1,
      username,
      createdAt: new Date().toISOString()
    };
    usersDB.push(user);
  }

  res.json({ message: '登录成功', user });
});

// 获取用户游戏记录
app.get('/api/user/:userId/games', (req, res) => {
  const userGames = userGamesDB.filter(ug => ug.userId === parseInt(req.params.userId));
  res.json(userGames);
});

// 添加游戏记录
app.post('/api/user/:userId/games', (req, res) => {
  const { gameId, status, rating, memory } = req.body;
  const userGame = {
    id: userGamesDB.length + 1,
    userId: parseInt(req.params.userId),
    gameId,
    status, // 'played', 'want', 'collected'
    rating,
    memory,
    createdAt: new Date().toISOString()
  };
  userGamesDB.push(userGame);
  res.json({ message: '记录成功', userGame });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           🎮 FC游戏纪念馆服务器已启动 🎮                  ║');
  console.log('║                                                            ║');
  console.log(`║   服务器地址: http://localhost:${PORT}                    ║`);
  console.log('║   API文档: http://localhost:' + PORT + '/api/health       ║');
  console.log('║                                                            ║');
  console.log('║   可用端点:                                                ║');
  console.log('║   - GET  /api/health     健康检查                          ║');
  console.log('║   - GET  /api/stats      统计信息                          ║');
  console.log('║   - GET  /api/games      游戏列表                          ║');
  console.log('║   - GET  /api/games/:id  游戏详情                         ║');
  console.log('║   - GET  /api/events     历史事件                         ║');
  console.log('║   - GET  /api/timeline   时间轴数据                        ║');
  console.log('║   - GET  /api/genres     游戏类型                         ║');
  console.log('║   - GET  /api/years      年份列表                         ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
});

module.exports = app;
