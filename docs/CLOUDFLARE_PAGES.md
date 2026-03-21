# Cloudflare Pages 部署指南

## 🚀 快速开始

### 前置条件

- GitHub 仓库：https://github.com/ljia2541/finegrain
- Cloudflare Account ID：`b8122ff3f404b8271bc74f4ede888c79`
- Cloudflare API Token：`cfat_...` (已配置)

---

## 📋 步骤 1：创建 R2 存储桶

### 1.1 访问 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 R2 对象存储
3. 点击「创建存储桶」

### 1.2 配置存储桶

```
存储桶名称: finegrain-uploads
位置: 自动 (Auto)
```

### 1.3 创建 R2 API Token

1. 进入「我的个人资料」→「API Tokens」
2. 点击「创建令牌」
3. 选择「R2」权限：
   - 模板：编辑 R2 存储桶
   - 权限：
     - 对象读
     - 对象写
     - 对象删除
4. 创建后保存：
   - Access Key ID
   - Secret Access Key

---

## 📋 步骤 2：配置 Cloudflare Pages 项目

### 2.1 访问 Cloudflare Pages

1. 访问：https://dash.cloudflare.com/b8122ff3f404b8271bc74f4ede888c79/pages
2. 点击「创建项目」→「连接到 Git」

### 2.2 连接 GitHub 仓库

1. 授权 Cloudflare 访问你的 GitHub
2. 选择仓库：`ljia2541/finegrain`

### 2.3 配置构建设置

```
框架预设: Next.js
构建命令: npm run build
构建输出目录: .next
Node.js 版本: 18.17.0 (或更高)
环境变量: 生产环境
```

### 2.4 配置环境变量

在「设置」→「环境变量」中添加：

```
REPLICATE_API_TOKEN=r8_JeOhr26s71o4Qq9bU2wEsahBzsjgfUN1wvlpH

R2_ACCOUNT_ID=b8122ff3f404b8271bc74f4ede888c79
R2_ACCESS_KEY_ID=<从步骤 1.3 获取>
R2_SECRET_ACCESS_KEY=<从步骤 1.3 获取>
R2_BUCKET_NAME=finegrain-uploads
R2_PUBLIC_URL=https://r2.flux-network.dev
```

---

## 📋 步骤 3：安装 Next.js 适配器

由于 Next.js 需要特殊配置才能在 Cloudflare Pages 运行，需要安装适配器：

```bash
npm install --save-dev @cloudflare/next-on-pages
```

### 3.1 更新 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['replicate.delivery', 'r2.flux-network.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: '**.r2.flux-network.dev',
      },
    ],
  },
  env: {
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  },
}

module.exports = nextConfig
```

### 3.2 创建 worker 适配器

创建 `workers.js`（如果需要）或使用默认配置。

---

## 📋 步骤 4：配置自定义域名（可选）

### 4.1 添加自定义域名

1. 在 Cloudflare Pages 项目中
2. 进入「自定义域」
3. 添加域名（例如：finegrain.yourdomain.com）

### 4.2 配置 DNS

1. Cloudflare 会自动创建 DNS 记录
2. 或者在你的域名提供商添加 CNAME 记录

---

## 📋 步骤 5：测试部署

### 5.1 首次部署

1. 提交代码到 GitHub
2. Cloudflare Pages 会自动触发部署
3. 等待构建完成（约 2-3 分钟）

### 5.2 访问部署的网站

```
默认域名: https://finegrain.pages.dev
或自定义域名
```

---

## 🔧 高级配置

### 配置重定向规则

在 `_headers` 文件中添加：

```text
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

### 配置缓存策略

在 `_redirects` 文件中添加：

```text
# API 路由不缓存
/api/*  /api/:splat  200

# 静态资源缓存
/static/*  /static/:splat  86400
```

---

## 📊 监控和日志

### 查看构建日志

1. 访问 Cloudflare Pages 项目
2. 点击「部署」标签
3. 查看每次部署的日志

### 查看分析数据

1. 进入「分析」标签
2. 查看访问量、带宽等指标

---

## 🚨 常见问题

### 问题 1：构建失败

**原因**：依赖安装失败

**解决方案**：
- 检查 package.json 中的依赖
- 确保 Node.js 版本正确

### 问题 2：环境变量未生效

**原因**：环境变量配置错误

**解决方案**：
- 检查环境变量名称是否正确
- 确保在正确的环境中配置（生产/预览）

### 问题 3：R2 上传失败

**原因**：R2 API Token 权限不足

**解决方案**：
- 重新创建 R2 API Token
- 确保权限包含「对象读写」

---

## 📝 下一步

部署完成后，可以：

1. ✅ 测试图片上传功能
2. ✅ 测试图片增强功能
3. ✅ 配置 Clerk Auth（用户认证）
4. ✅ 配置 Stripe（支付系统）

---

**最后更新**: 2026-03-21
**维护者**: ljia2541
