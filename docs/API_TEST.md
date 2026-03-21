# API 测试说明

## 当前状态

### ✅ 已完成
- Next.js 14 + TypeScript 项目
- Tailwind CSS 样式系统
- Replicate API 集成代码（lib/replicate.ts）
- Cloudflare R2 集成代码（lib/r2.ts）
- API 端点：
  - POST /api/upload
  - POST /api/enhance
  - GET /api/task/[taskId]

### ⚠️ 需要配置

在测试之前，需要配置以下环境变量：

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，填写以下配置：
```

**必需配置：**

1. **Replicate API** (用于图片增强)
   ```
   REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   获取方式：https://replicate.com/account/api-tokens

2. **Cloudflare R2** (用于图片存储)
   ```
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_BUCKET_NAME=finegrain-uploads
   R2_PUBLIC_URL=https://r2.flux-network.dev
   ```
   获取方式：Cloudflare Dashboard → R2 → 创建存储桶

### 🧪 测试方法

#### 方法 1：使用浏览器测试

1. 访问 http://49.51.183.3:3000
2. 上传一张图片
3. 选择增强选项
4. 查看结果

#### 方法 2：使用 curl 测试

```bash
# 1. 测试上传 API
curl -X POST http://49.51.183.3:3000/api/upload \
  -F "file=@test-image.jpg"

# 2. 测试增强 API（使用上面返回的 imageUrl）
curl -X POST http://49.51.183.3:3000/api/enhance \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://...","model":"realesrgan","scale":2}'

# 3. 查询任务状态
curl http://49.51.183.3:3000/api/task/[taskId]
```

### 📝 当前限制

由于没有配置真实的 API 密钥，当前 API 调用会失败。需要配置：

1. Replicate API Token
2. Cloudflare R2 凭证

### 🚀 下一步

配置好环境变量后，可以：
1. 测试图片上传功能
2. 测试图片增强功能
3. 实现用户认证（Clerk Auth）
4. 实现支付系统（Stripe）

### 💡 提示

如果你有 Replicate API Token 和 R2 凭证，我可以帮你：
1. 配置环境变量
2. 重启开发服务器
3. 进行完整的 API 测试

需要我继续配置吗？
