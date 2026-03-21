# 🚀 Cloudflare Pages 部署指南

## 📋 部署状态

### ✅ 已完成

1. ✅ 代码开发完成 - Next.js 14 + Tailwind CSS
2. ✅ API 集成代码
3. ✅ GitHub 仓库：https://github.com/ljia2541/finegrain
4. ✅ KV 命名空间创建：`精细粒度-kv`
5. ✅ Replicate API Token 配置

### ⏳ 待完成

**Cloudflare Pages 部署**（最后一步）

---

## 🎯 部署步骤

### 步骤 1：进入 Pages 项目

1. 访问：https://dash.cloudflare.com/b8122ff3f404b8271bc74f4ede888c79/pages

2. 找到 **「finegrain」** 项目（如果存在则进入）

3. 如果看不到项目，点击「连接到 Git」

---

### 步骤 2：配置构建设置

**构建设置：**
```
项目名称：finegrain
生产分支：main
框架预设：Next.js
根目录：/
构建命令：npm run build
构建输出目录：out
Node.js 版本：18.17.0
```

**环境变量（在「环境变量」部分添加）：**

```
REPLICATE_API_TOKEN=r8_JeOhr26s71o4Qq9bU2wEsahBzsjgfUN1wvlpH
```

---

### 步骤 3：绑定 KV 命名空间

1. 在项目页面，点击「设置」→「Functions」

2. 向下滚动到「KV 命名空间绑定」

3. 点击「添加绑定」：
   - 变量名称：`KV`
   - KV 命名空间：`精细粒度-kv`（从下拉菜单选择）

4. 环境选择：生产环境和预览环境都勾选

5. 点击「保存」

---

### 步骤 4：部署

点击 **「保存并部署」**

---

## 🔧 构建说明

### 使用 Next.js 14 原因

1. **兼容性好** - Cloudflare Pages 对 Next.js 14 支持最好
2. **构建稳定** - 避免了 npm 10.x 的 peer dependency 冲突
3. **静态导出**：`output: 'export'` 配置
4. **简化依赖**：只保留核心功能，减少冲突

### 当前技术栈

- **框架**：Next.js 14.1.0
- **React**：18.2.0
- **样式**：Tailwind CSS 3.4.1
- **图标**：Lucide React 0.309.0
- **API**：Replicate SDK 0.29.1
- **状态管理**：Zustand 4.5.0

### 已移除的依赖

- ❌ Clerk Auth（避免构建冲突）
- ❌ Stripe（暂不集成）
- ❌ @aws-sdk/client-s3（不需要 R2 了）

---

## 🌐 部署后域名

**默认域名：** `https://finegrain.pages.dev`

**自定义域名：** 在「自定义域」中添加

---

## 📝 注意事项

### 构建前检查清单

- [ ] GitHub 仓库代码已更新
- [ ] KV 命名空间已创建
- [] 环境变量已添加
- [ ] Next.js 版本为 14.x

### 常见问题

**Q1: 构建失败 "npm install"**
- **A:** 已通过降级到 Next.js 14 解决

**Q2: 如何更新网站？**
- **A:** 推送到 GitHub 后，Cloudflare Pages 会自动部署

**Q3: API 不工作？**
- **A:** 检查环境变量是否正确设置

**Q4: 如何查看错误日志？**
- **A**: 点击「部署日志」查看详细日志

---

## 🎉 成功标志

**看到以下信息表示部署成功：**

```
✅ 部署成功
🌐 域名：https://finegrain.pages.dev
```

---

**准备好了吗？开始在 Cloudflare Pages 部署吧！** 🚀

**操作提示：**
1. 进入 Cloudflare Pages
2. 找到 finegrain 项目
3. 点击「设置」→「构建配置」
4. 配置上述设置
5. 点击「保存并部署」

---

**完成后告诉我你的域名！** 🌐
