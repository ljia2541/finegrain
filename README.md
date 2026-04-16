# Finegrain - AI 图像增强平台

> 基于 AI 的在线图像增强服务，专注于细节修复和超分辨率放大

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 到 `.env.local` 并填写配置：

```bash
cp .env.example .env.local
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📦 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: Lucide React
- **状态管理**: Zustand
- **认证**: Clerk Auth (待集成)
- **支付**: Stripe (待集成)
- **AI 推理**: Replicate API (待集成)

## 📁 项目结构

```
finegrain/
├── app/              # Next.js App Router
│   ├── layout.tsx    # 根布局
│   └── page.tsx      # 首页
├── components/       # React 组件
│   ├── Header.tsx    # 头部导航
│   ├── Footer.tsx    # 页脚
│   ├── ImageUploader.tsx  # 图片上传组件
│   ├── Features.tsx  # 功能特性
│   ├── Pricing.tsx   # 定价方案
│   └── PrivacyNotice.tsx  # 隐私声明
├── lib/              # 工具函数
│   └── utils.ts      # 通用工具
├── styles/           # 样式文件
│   └── globals.css   # 全局样式
└── public/           # 静态资源
    └── docs/         # 文档
```

## 🎯 功能特性

### ✅ 已实现

- ✅ Next.js 14 + TypeScript 项目结构
- ✅ Tailwind CSS 样式系统
- ✅ 响应式首页布局
- ✅ 图片上传组件（支持拖拽、点击、剪贴板）
- ✅ 功能特性展示
- ✅ 定价方案展示
- ✅ 隐私保护声明

### 🚧 开发中

- ⏳ Replicate API 集成
- ⏳ Clerk Auth 用户认证
- ⏳ Stripe 支付集成
- ⏳ Cloudflare R2 存储
- ⏳ 图片对比视图
- ⏳ 批量处理功能

## 📝 开发路线图

### 第 1 周：基础设施 + 核心功能
- [x] 创建 Next.js 项目
- [x] 配置 Tailwind CSS
- [x] 基础 UI 组件开发
- [ ] 集成 Replicate API
- [ ] 实现图片上传到 R2

### 第 2 周：增强功能 + 优化
- [ ] 实现图片增强功能
- [ ] 实现对比视图
- [ ] 添加进度条和状态反馈
- [ ] 实现下载功能（免费 + 付费）

### 第 3 周：变现系统
- [ ] 集成 Clerk Auth
- [ ] 集成 Stripe 支付
- [ ] 实现积分制计费
- [ ] 用户使用限制逻辑

### 第 4 周：测试 + 上线
- [ ] 功能测试
- [ ] 性能测试
- [ ] 部署到生产环境

## 📊 定价方案

### 免费版
- 3 张/天
- Real-ESRGAN 模型
- 最大 1920x1080，带水印

### 积分包

| 积分包 | 价格 | 有效期 | 单价 |
|--------|------|--------|------|
| 100 积分 | $4.99 | 6 个月 | $0.049/积分 |
| 200 积分 | $7.99 | 6 个月 | $0.040/积分 |
| 500 积分 | $12.99 | 12 个月 | $0.026/积分 |
| 1000 积分 | $19.99 | 12 个月 | $0.020/积分 |

### 单次付费
- $0.99/张（HAT + 高分辨率）

## 🔐 隐私承诺

- **零存储政策**：所有用户上传的图片 24 小时内自动删除
- **透明化处理**：页面明确标注"不存储用户图片"
- **数据最小化**：仅收集必要信息，无用户数据留存
- **安全传输**：全程 HTTPS 加密

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👥 联系方式

- 项目负责人：林
- GitHub：@ljia2541
- 需求文档：[MVP_SPEC.md](./public/docs/MVP_SPEC.md)

---

**状态**：🚧 开发中

**最后更新**：2026-03-21

## 🔗 Related Projects

- **[GoTaskMind](https://gotaskmind.com)** — AI Project Planner & Task Management Tool. Transform ideas into actionable task plans with AI.
