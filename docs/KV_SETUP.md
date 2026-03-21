# Cloudflare Workers KV 配置指南

## 🎯 为什么使用 Cloudflare Workers KV？

1. ✅ **完全免费** - 每月 100,000 次读取，1,000 次写入
2. ✅ **无需绑卡** - 不需要信用卡
3. ✅ **全球边缘缓存** - 低延迟访问
4. ✅ **与 Cloudflare Pages 完美集成**

---

## 📋 步骤 1：创建 KV 命名空间

### 在 Cloudflare Dashboard 中操作：

1. 访问：https://dash.cloudflare.com/b8122ff3f404b8271bc74f4ede888c79
2. 在左侧菜单找到 **「Workers & Pages」**
3. 点击 **「KV」**
4. 点击「创建命名空间」
5. 输入命名空间名称：`finegrain-kv`
6. 点击「添加」

---

## 📋 步骤 2：在 Cloudflare Pages 中绑定 KV

### 方法 A：通过 Dashboard

1. 访问：https://dash.cloudflare.com/b8122ff3f404b8271bc74f4ede888c79/pages
2. 选择你的项目（finegrain）
3. 进入「设置」→「Functions」
4. 向下滚动到「KV 命名空间绑定」
5. 点击「添加绑定」
6. 变量名称：`KV`
7. KV 命名空间：选择 `finegrain-kv`
8. 环境选择：生产环境和预览环境
9. 点击「保存」

### 方法 B：通过 wrangler.toml（如果使用）

```toml
# wrangler.toml
[[kv_namespaces]]
binding = "KV"
id = "your_kv_namespace_id"
```

---

## 📋 步骤 3：更新环境变量

在 Cloudflare Pages 项目中添加：

```
KV_BINDING=KV
KV_NAMESPACE_ID=<你的 KV 命名空间 ID>
```

---

## 💡 KV 存储使用说明

### 实现的存储类

1. **ImageKVStorage** - 图片 URL 存储
   - 存储 Replicate 返回的图片 URL
   - 自动 24 小时过期

2. **TaskKVStorage** - 任务状态存储
   - 跟踪图片增强任务状态
   - 存储任务结果

3. **CreditsKVStorage** - 用户积分管理
   - 用户积分余额
   - 使用历史记录

### 数据结构

```
KV 命名空间：finegrain-kv

图片数据：
- images:{imageId} -> { url, createdAt, expiresAt }

任务数据：
- tasks:{taskId} -> { status, imageUrl, error, createdAt, updatedAt }

用户积分：
- user:{userId} -> { credits, updatedAt }
- user:{userId}:history -> [{ amount, taskId, timestamp }, ...]
```

---

## 🚀 测试 KV 存储

### 本地测试（使用 Miniflare）

```bash
# 安装 Miniflare
npm install -g miniflare

# 运行本地 KV 模拟
miniflare --kv --kv-persist
```

### 生产环境

部署到 Cloudflare Pages 后，KV 会自动注入。

---

## ⚠️ 注意事项

1. **KV 不是数据库**
   - 适合缓存、会话数据
   - 不适合大规模数据存储
   - 有读写限制

2. **TTL（生存时间）**
   - 图片 URL：24 小时
   - 任务状态：7 天
   - 用户数据：永久

3. **备份**
   - KV 不支持自动备份
   - 重要数据需要定期导出

---

## 📝 代码示例

### 在 Next.js API Route 中使用 KV

```typescript
import { ImageKVStorage } from '@/lib/kv-storage'

export async function POST(request: NextRequest) {
  // 获取 KV 绑定（Cloudflare Pages 自动注入）
  const kvBinding = (request as any).env?.KV
  
  if (!kvBinding) {
    return NextResponse.json(
      { error: 'KV storage not available' },
      { status: 500 }
    )
  }
  
  // 创建存储实例
  const imageStorage = new ImageKVStorage(kvBinding)
  
  // 保存图片 URL
  await imageStorage.saveImageUrl(imageId, imageUrl)
  
  return NextResponse.json({ success: true })
}
```

---

**最后更新：2026-03-21**

**下一步：配置 Cloudflare Pages 项目**
