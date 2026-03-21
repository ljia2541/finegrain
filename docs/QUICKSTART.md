# 🚀 Cloudflare Pages 快速配置清单

## ✅ 当前状态

- ✅ 代码已推送到 GitHub
- ✅ 本地环境变量已配置
- ✅ 依赖已安装
- ✅ API 集成代码已完成

---

## 📝 待完成步骤

### 步骤 1：创建 R2 存储桶（5 分钟）

1. 访问：https://dash.cloudflare.com/b8122ff3f404b8271bc74f4ede888c79/r2
2. 点击「创建存储桶」
3. 输入：`finegrain-uploads`
4. 位置选择：`自动`
5. 点击「创建存储桶」

### 步骤 2：创建 R2 API Token（3 分钟）

1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 点击「创建令牌」
3. 选择「自定义令牌」
4. 权限选择：
   - `R2` → `编辑` (包括：对象读、对象写、对象删除)
5. 账户资源选择：你的账户（`b8122ff3f404b8271bc74f4ede888c79`）
6. 点击「继续以显示摘要」→「创建令牌」
7. **重要**：保存以下信息：
   - Access Key ID
   - Secret Access Key

### 步骤 3：配置 Cloudflare Pages（5 分钟）

1. 访问：https://dash.cloudflare.com/b8122ff3f404b8271bc74f4ede888c79/pages
2. 点击「创建项目」→「连接到 Git」
3. 选择 GitHub 仓库：`ljia2541/finegrain`
4. 配置构建设置：
   ```
   构建命令: npm run build
   构建输出目录: .next (注意：可能需要改为 .next)
   Node.js 版本: 18.17.0
   ```
5. 点击「保存并部署」

### 步骤 4：配置环境变量（2 分钟）

在 Cloudflare Pages 项目中：

1. 进入「设置」→「环境变量」
2. 添加以下变量（生产环境和预览环境）：

```
REPLICATE_API_TOKEN=r8_JeOhr26s71o4Qq9bU2wEsahBzsjgfUN1wvlpH

R2_ACCOUNT_ID=b8122ff3f404b8271bc74f4ede888c79
R2_ACCESS_KEY_ID=<从步骤 2 获取>
R2_SECRET_ACCESS_KEY=<从步骤 2 获取>
R2_BUCKET_NAME=finegrain-uploads
R2_PUBLIC_URL=https://r2.flux-network.dev
```

3. 点击「保存」
4. 点击「重新部署」

---

## 🎯 完成后

你的网站将部署到：
```
https://finegrain.pages.dev
```

或者你可以配置自定义域名。

---

## ❓ 遇到问题？

### 问题 1：构建失败
**解决**：检查 Node.js 版本是否为 18.x 或更高

### 问题 2：环境变量未生效
**解决**：确保在「生产环境」和「预览环境」中都配置了

### 问题 3：R2 上传失败
**解决**：检查 R2 API Token 权限是否正确

---

**准备好开始了吗？按顺序完成这 4 个步骤即可！**

预计总时间：**15 分钟**

---

*最后更新：2026-03-21*
