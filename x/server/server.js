const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 数据存储路径
const DATA_FILE = path.join(__dirname, 'data.json');

// 预定义的分类和关键词
const CATEGORIES = {
  tech: {
    name: '科技',
    keywords: ['AI', '人工智能', 'tech', 'technology', '编程', 'coding', '软件', 'hardware', '芯片', 'Apple', 'Google', 'OpenAI', '特斯拉', 'Tesla', 'SpaceX', '编程', '开发者', 'developer', 'software', 'app'],
    color: '#1d9bf0'
  },
  finance: {
    name: '财经',
    keywords: ['股票', '投资', 'crypto', '比特币', 'bitcoin', '以太坊', 'eth', '财经', 'finance', 'economy', '经济', '市场', 'market', 'trading', '交易', '美元', 'USDT', 'DeFi', 'NFT'],
    color: '#00ba7c'
  },
  news: {
    name: '新闻',
    keywords: ['breaking', 'news', '头条', '最新', 'update', '公告', 'announcement', 'report', '报道', 'just in', '突发'],
    color: '#f4212e'
  },
  entertainment: {
    name: '娱乐',
    keywords: ['电影', 'movie', '音乐', 'music', '游戏', 'game', 'gaming', 'celebrity', '明星', '娱乐', '综艺', 'show', 'concert', '演唱会'],
    color: '#ff6b9d'
  },
  sports: {
    name: '体育',
    keywords: ['sports', 'football', 'basketball', 'NBA', 'NFL', 'soccer', '世界杯', '奥运会', '比赛', 'game', 'win', 'victory', '冠军', 'championship'],
    color: '#ffad1f'
  },
  lifestyle: {
    name: '生活',
    keywords: ['food', '美食', 'travel', '旅游', 'fitness', '健康', 'health', 'fashion', '时尚', 'art', '艺术', 'photography', '摄影', 'lifestyle'],
    color: '#7856ff'
  }
};

// 初始化数据
let cachedData = {
  lastUpdate: null,
  tweets: [],
  stats: {}
};

// 加载缓存数据
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      cachedData = data;
      console.log('📂 已加载缓存数据');
    }
  } catch (error) {
    console.error('加载数据失败:', error);
  }
}

// 保存数据
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(cachedData, null, 2));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
}

// 分类推文
function categorizeTweet(text) {
  const textLower = text.toLowerCase();
  const categories = [];

  for (const [key, config] of Object.entries(CATEGORIES)) {
    const matched = config.keywords.some(keyword =>
      textLower.includes(keyword.toLowerCase())
    );
    if (matched) {
      categories.push(key);
    }
  }

  return categories.length > 0 ? categories : ['other'];
}

// 模拟抓取推文（实际使用时需要替换为真实 API）
async function scrapeTweets() {
  console.log('🔍 开始抓取推文...', new Date().toISOString());

  // 由于 x.com 有严格的反爬虫机制，这里提供几种方案：

  // 方案 1: 使用 Twitter API v2（推荐，需要申请开发者账号）
  //  return await scrapeWithAPI();

  // 方案 2: 使用 Puppeteer 模拟浏览器（容易被封）
  //  return await scrapeWithPuppeteer();

  // 方案 3: 使用第三方服务如 Nitter 实例
  //  return await scrapeWithNitter();

  // 当前：生成模拟数据演示功能
  return generateMockData();
}

// 使用 Twitter API v2 抓取（需要 BEARER_TOKEN）
async function scrapeWithAPI() {
  const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

  if (!BEARER_TOKEN) {
    console.warn('⚠️ 未设置 TWITTER_BEARER_TOKEN，使用模拟数据');
    return generateMockData();
  }

  try {
    // 搜索热门话题
    const queries = ['AI', 'technology', 'crypto', 'news', 'breaking'];
    const allTweets = [];

    for (const query of queries) {
      const response = await axios.get(
        `https://api.twitter.com/2/tweets/search/recent`, {
          headers: {
            'Authorization': `Bearer ${BEARER_TOKEN}`
          },
          params: {
            query: `${query} -is:retweet lang:en`,
            max_results: 10,
            'tweet.fields': 'created_at,author_id,public_metrics'
          }
        }
      );

      if (response.data.data) {
        allTweets.push(...response.data.data);
      }
    }

    return processTweets(allTweets);
  } catch (error) {
    console.error('API 抓取失败:', error.message);
    return generateMockData();
  }
}

// 处理抓取到的推文
function processTweets(tweets) {
  return tweets.map(tweet => ({
    id: tweet.id,
    text: tweet.text,
    author: tweet.author_id || 'unknown',
    createdAt: tweet.created_at || new Date().toISOString(),
    metrics: tweet.public_metrics || { like_count: 0, retweet_count: 0 },
    categories: categorizeTweet(tweet.text),
    url: `https://x.com/i/web/status/${tweet.id}`
  }));
}

// 生成模拟数据（用于演示）
function generateMockData() {
  const now = Date.now();
  const mockAuthors = [
    { name: 'TechCrunch', handle: '@TechCrunch', avatar: 'https://unpkg.com/ionicons@5.5.2/dist/svg/logo-twitter.svg' },
    { name: 'Elon Musk', handle: '@elonmusk', avatar: '' },
    { name: 'AI News', handle: '@AINewsFeed', avatar: '' },
    { name: 'Crypto Daily', handle: '@CryptoDaily', avatar: '' },
    { name: 'Reuters', handle: '@Reuters', avatar: '' },
    { name: 'The Verge', handle: '@verge', avatar: '' },
    { name: 'BBC News', handle: '@BBCNews', avatar: '' },
    { name: 'ESPN', handle: '@espn', avatar: '' }
  ];

  const mockContents = {
    tech: [
      'OpenAI 刚刚发布了 GPT-5，能力提升了 10 倍！🤖 #AI #technology',
      'Apple 宣布将在明年推出 AR 眼镜，革命性的产品即将到来 🍎',
      '特斯拉自动驾驶技术取得重大突破，FSD v13 即将推送 🚗',
      'Google DeepMind 解决了蛋白质折叠的新难题 🔬',
      '新的量子计算机实现了 1000 量子比特的里程碑 ⚛️'
    ],
    finance: [
      '比特币突破 $100,000！历史新高 🚀 #bitcoin #crypto',
      '美联储宣布降息，股市应声大涨 📈',
      '以太坊 2.0 质押量突破 3000 万枚 ETH',
      '科技股今日集体上涨，纳斯达克创历史新高',
      '某国宣布比特币为法定货币，市场反应热烈'
    ],
    news: [
      '突发：重要国际会议达成历史性协议 🌍',
      '最新研究显示气候变化速度超预期 ⚠️',
      '科技公司宣布大规模招聘计划',
      '新法案通过，将影响数百万用户',
      '国际空间站迎来新一批宇航员'
    ],
    entertainment: [
      '新电影票房突破 10 亿，创影史纪录 🎬',
      '知名歌手宣布世界巡演，首站北京 🎤',
      '热门游戏续作预告片发布，画面震撼 🎮',
      '流媒体平台宣布制作全新科幻剧集',
      '音乐节 lineup 公布，阵容强大'
    ],
    sports: [
      '世界杯决赛：点球大战决出冠军 ⚽',
      'NBA 总决赛：历史性逆转夺冠 🏀',
      '奥运纪录被打破，新王者诞生 🏅',
      '网球大满贯：精彩五盘大战',
      'F1 赛车：最后圈绝杀夺冠'
    ],
    lifestyle: [
      '新研究：每天喝咖啡有益健康 ☕',
      '2024 年最佳旅游目的地推荐 ✈️',
      '简单步骤让你的生活更有条理 📋',
      '新餐厅开业，米其林主厨掌舵 🍽️',
      '周末户外活动推荐，享受大自然 🌲'
    ]
  };

  const tweets = [];
  let idCounter = Date.now();

  // 为每个分类生成推文
  Object.entries(mockContents).forEach(([category, contents]) => {
    contents.forEach((content, index) => {
      const author = mockAuthors[Math.floor(Math.random() * mockAuthors.length)];
      tweets.push({
        id: String(idCounter++),
        text: content,
        author: author.name,
        handle: author.handle,
        avatar: author.avatar,
        createdAt: new Date(now - Math.floor(Math.random() * 86400000)).toISOString(),
        metrics: {
          likes: Math.floor(Math.random() * 10000),
          retweets: Math.floor(Math.random() * 2000),
          replies: Math.floor(Math.random() * 500)
        },
        categories: [category],
        url: `https://x.com/i/web/status/${idCounter}`,
        image: Math.random() > 0.7 ? `https://picsum.photos/seed/${idCounter}/400/300` : null
      });
    });
  });

  // 随机打乱
  return tweets.sort(() => Math.random() - 0.5);
}

// 更新数据
async function updateData() {
  try {
    const tweets = await scrapeTweets();

    // 计算统计信息
    const stats = {};
    Object.keys(CATEGORIES).forEach(cat => stats[cat] = 0);
    stats.other = 0;

    tweets.forEach(tweet => {
      tweet.categories.forEach(cat => {
        stats[cat] = (stats[cat] || 0) + 1;
      });
    });

    cachedData = {
      lastUpdate: new Date().toISOString(),
      tweets: tweets,
      stats: stats
    };

    saveData();
    console.log('✅ 数据更新完成，共', tweets.length, '条推文');
  } catch (error) {
    console.error('❌ 更新数据失败:', error);
  }
}

// API 路由
app.use(cors());
app.use(express.json());

// 获取所有推文
app.get('/api/tweets', (req, res) => {
  const { category, limit = 50 } = req.query;

  let tweets = cachedData.tweets;

  // 按分类筛选
  if (category && category !== 'all') {
    tweets = tweets.filter(t => t.categories.includes(category));
  }

  // 限制数量
  tweets = tweets.slice(0, parseInt(limit));

  res.json({
    success: true,
    lastUpdate: cachedData.lastUpdate,
    count: tweets.length,
    data: tweets
  });
});

// 获取分类统计
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    categories: CATEGORIES,
    stats: cachedData.stats,
    lastUpdate: cachedData.lastUpdate
  });
});

// 手动触发更新
app.post('/api/refresh', async (req, res) => {
  await updateData();
  res.json({ success: true, message: '数据已更新' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log('📡 API 端点:');
  console.log(`   GET  http://localhost:${PORT}/api/tweets`);
  console.log(`   GET  http://localhost:${PORT}/api/stats`);
  console.log(`   POST http://localhost:${PORT}/api/refresh`);

  // 加载数据
  loadData();

  // 如果数据为空，立即更新
  if (!cachedData.tweets || cachedData.tweets.length === 0) {
    updateData();
  }
});

// 定时任务：每 10 分钟抓取一次
cron.schedule('*/10 * * * *', () => {
  console.log('⏰ 定时任务触发');
  updateData();
});

// 导出供测试使用
module.exports = { app, updateData, CATEGORIES };
