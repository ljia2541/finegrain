# Cloudflare Pages 输出目录配置指南

## ✅ 配置完成

项目已经配置为静态导出，构建后会生成 `out` 目录。

## 📁 输出目录信息

- **输出目录：** `out`
- **完整路径：** `/root/.openclaw/workspace/project/finegrain/out`
- **生成时间：** 2026-03-22 19:04
- **构建命令：** `pnpm run build`

## 🔧 Cloudflare Pages 配置

### 方法 1：通过 Cloudflare Dashboard 配置

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** 项目
3. 点击 **Settings** → **Builds & deployments**
4. 找到 **Build configurations** 部分
5. 配置以下内容：

```
构建命令 (Build command):
pnpm run build

构建输出目录 (Build output directory):
out

Node.js 版本:
18 或更高
```

6. 点击 **Save** 保存
7. 点击 **Retry deployment** 重新部署

### 方法 2：通过 wrangler.toml 配置（可选）

在项目根目录创建 `wrangler.toml` 文件：

```toml
name = "finegrain"
compatibility_date = "2024-03-22"

[build]
command = "pnpm run build"
cwd = "."
watch_paths = []

[build.environment]
NODE_VERSION = "18"

[build.upload]
format = "modules"
main = "./.next/server.js"
```

## 📊 out 目录结构

```
out/
├── index.html          # 主页
├── 404.html            # 404 页面
├── docs/               # 文档文件
│   └── MVP_SPEC.md
├── examples/           # 示例图片（如果有的话）
└── _next/              # Next.js 静态资源
    ├── static/
    │   ├── chunks/     # JavaScript chunks
    │   ├── css/        # 样式文件
    │   └── media/      # 媒体文件
    └── ...
```

## 🚀 本地预览

在部署到 Cloudflare Pages 之前，可以先本地预览：

```bash
# 安装 serve（如果还没有安装）
npm install -g serve

# 预览 out 目录
cd /root/.openclaw/workspace/project/finegrain
serve out
```

然后访问 http://localhost:3000

## 📝 配置说明

### Next.js 配置 (next.config.js)

```javascript
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // 静态导出必须禁用图像优化
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 关键配置：启用静态导出
  output: 'export',
}

module.exports = nextConfig
```

### package.json 脚本

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**注意：** Next.js 14 不再需要 `next export` 命令，`output: 'export'` 配置会自动生成静态文件。

## ⚠️ 重要提示

1. **不要使用 `.next` 作为输出目录**
   - `.next` 是 Next.js 的构建缓存目录
   - 正确的输出目录是 `out`

2. **图像优化已禁用**
   - 静态导出不支持 Next.js Image Optimization
   - 已配置 `images.unoptimized: true`
   - 建议使用标准 `<img>` 标签或优化后的图片

3. **API 路由不支持**
   - 静态导出不包含 API Routes
   - 需要使用 Cloudflare Workers 或 Serverless Functions

4. **环境变量**
   - 确保在 Cloudflare Pages 设置中添加所有必要的环境变量
   - 包括：`REPLICATE_API_TOKEN`、`STRIPE_SECRET_KEY` 等

## 🎯 验证部署

部署完成后，访问以下 URL 验证：

- 主页：https://finegrain.pages.dev/
- 404 页面：https://finegrain.pages.dev/404.html
- 文档：https://finegrain.pages.dev/docs/MVP_SPEC.md

## 🔄 重新部署流程

每次代码更新后：

1. 提交代码到 Git
   ```bash
   git add .
   git commit -m "your commit message"
   git push
   ```

2. Cloudflare Pages 会自动触发部署
3. 等待构建完成（通常 1-2 分钟）
4. 查看部署日志确认成功

## 📱 部署状态

- ✅ Next.js 配置已更新（`output: 'export'`）
- ✅ package.json 脚本已更新
- ✅ 构建成功，生成 `out` 目录
- ⏳ Cloudflare Pages 配置待更新

## 🆘 故障排除

### 问题 1：构建失败

```bash
# 清理缓存并重新构建
rm -rf .next out node_modules
pnpm install
pnpm run build
```

### 问题 2：404 错误

- 确认输出目录设置为 `out`
- 确认构建命令为 `pnpm run build`
- 检查构建日志中的错误信息

### 问题 3：图片不显示

- 确认 `images.unoptimized: true` 已配置
- 检查图片路径是否正确（相对于 `out` 目录）
- 使用绝对路径或 `/public/` 前缀

---

**文档更新时间：** 2026-03-22 19:04
**配置状态：** ✅ 已完成
