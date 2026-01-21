# 🚣 赛艇训练管理平台 | Rowing Training Management Platform

一个结合统计学与计算机科学的专业化运动管理平台，通过直观的可视化界面帮助用户查看历史训练数据并评估身体机能。

## ✨ 功能特性

### 学员端 (Athlete Portal)
- 📊 **数据回顾** - 随时查看个人历史训练数据与成长曲线
- 💬 **反馈接收** - 查看教练针对每次训练填写的专业评语
- 📚 **技术学习** - 查阅推荐的力量训练动作与赛艇标准技术动作库
- 📅 **未来规划** - 查看教练制定的未来训练计划

### 教练端 (Coach Portal)
- ⚡ **高效录入** - 及时上传学员训练数据、表现评语及实时更新训练动态
- 📈 **数据监控** - 通过图表监控每位学员及团队整体的成长曲线
- 🎯 **训练管理** - 针对不同学员的身体素质规划个性化的未来训练方案

### 核心功能
- 📉 **数据可视化** - 使用 ECharts 渲染动力曲线、心率区间分布及力量增长轨迹
- 🔄 **成长反映** - 支持跨时间段的数据对比
- 🎲 **个性化算法** - 基于统计学模型，根据历史表现自动推荐适合当前的训练强度等级
- 🏆 **排行榜** - 日榜、月榜等内容，增加趣味性与竞争性

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (Vanilla)
- **可视化**: ECharts 5.4.3
- **后端**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **部署**: Cloudflare Pages

## 📦 项目结构

```
rowing_website/
├── public/
│   └── index.html          # 主前端页面
├── functions/
│   └── api/
│       ├── auth/
│       │   ├── login.js     # 登录API
│       │   └── register.js  # 注册API
│       ├── training.js      # 训练记录API
│       ├── strength.js      # 力量训练API
│       └── leaderboard.js   # 排行榜API
├── schema.sql               # 数据库架构
├── wrangler.toml           # Cloudflare配置
└── README.md               # 项目说明
```

## 🚀 快速开始

### 前置要求

- Node.js 和 npm
- Cloudflare 账号
- Wrangler CLI

### 安装步骤

1. **安装 Wrangler CLI**
```bash
npm install -g wrangler
```

2. **登录 Cloudflare**
```bash
wrangler login
```

3. **创建 D1 数据库**
```bash
wrangler d1 create rowing-db
```

4. **更新 wrangler.toml**
将返回的 `database_id` 更新到 `wrangler.toml` 文件中：
```toml
[[d1_databases]]
binding = "DB"
database_name = "rowing-db"
database_id = "your-database-id-here"
```

5. **初始化数据库**
```bash
wrangler d1 execute rowing-db --remote --file=./schema.sql
```

6. **本地开发**
```bash
# 启动本地开发服务器
wrangler pages dev ./public -- d1=DB:rowing-db

# 或者使用 npm（如果添加了 package.json）
npm run dev
```

7. **部署到 Cloudflare Pages**
```bash
# 首次部署
wrangler pages project create saitingdui

# 部署
wrangler pages deploy ./public
```

## 📊 数据库架构

### 主要表结构

- **users** - 用户表（学员和教练）
- **training_sessions** - 训练记录
- **strength_records** - 力量训练记录
- **training_plans** - 训练计划
- **plan_details** - 训练计划详情
- **technique_library** - 技术库
- **leaderboard** - 排行榜
- **body_metrics** - 身体指标

## 🔐 认证说明

⚠️ **重要**: 当前版本使用简单的密码存储（用于演示目的）。在生产环境中，你应该：

1. 实现密码哈希（使用 bcrypt 或类似库）
2. 使用 JWT 或会话令牌进行身份验证
3. 添加 HTTPS 和 CORS 保护
4. 实现角色基础的访问控制（RBAC）

## 📱 使用指南

### 注册账号

1. 打开网站，点击"还没有账号？立即注册"
2. 填写用户名、密码、姓名等信息
3. 选择角色：学员 或 教练
4. 点击注册

### 学员使用

1. **仪表盘** - 查看训练统计数据和可视化图表
2. **训练记录** - 添加和查看训练数据
3. **力量训练** - 记录力量训练数据
4. **排行榜** - 查看与其他学员的排名对比
5. **技术库** - 学习赛艇技术和力量训练动作

### 教练使用

1. 所有学员功能均可使用
2. **训练计划** - 为学员创建个性化训练计划
3. 可以为学员的训练记录添加反馈和评分

## 🎨 界面预览

- **现代渐变设计** - 使用紫色渐变主题
- **响应式布局** - 适配桌面和移动设备
- **交互式图表** - ECharts 提供的动态数据可视化
- **流畅动画** - 平滑的过渡效果和悬停交互

## 🔧 API 端点

### 认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 训练
- `GET /api/training?userId={id}` - 获取训练记录
- `POST /api/training` - 添加训练记录
- `PUT /api/training` - 更新训练记录（教练反馈）

### 力量训练
- `GET /api/strength?userId={id}` - 获取力量训练记录
- `POST /api/strength` - 添加力量训练记录

### 排行榜
- `GET /api/leaderboard?category={type}` - 获取排行榜数据
- `POST /api/leaderboard` - 添加排行榜数据

## 📈 数据可视化

平台提供以下可视化图表：

1. **功率趋势图** - 展示训练功率随时间的变化
2. **心率区间分布** - 饼图显示不同心率区间的训练比例
3. **更多图表** - 可根据需要添加距离、桨频等指标的可视化

## 🚧 未来计划

- [ ] 实现真实的 JWT 认证
- [ ] 添加密码加密和用户权限管理
- [ ] 实现训练计划的完整 CRUD 操作
- [ ] 添加数据导出功能（PDF/Excel）
- [ ] 实现消息通知系统
- [ ] 添加更多可视化图表
- [ ] 实现多语言支持
- [ ] 添加移动端 PWA 支持

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**祝训练愉快！🚣💪**
