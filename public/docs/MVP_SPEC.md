# Finegrain 图像增强平台 - MVP 需求文档

## 1. 项目概述

### 1.1 项目简介
Finegrain 是一个基于 AI 的在线图像增强服务，专注于细节修复和超分辨率放大，面向设计师、数字艺术家和普通用户。

### 1.2 核心价值主张
- **细节修复**：使用 Finegrain 模型恢复图像细节，远超通用增强器
- **无损放大**：支持最高 10 倍超分辨率放大，保持图像质量
- **格式兼容**：支持 HEIC/AVIF 等小众格式（差异化优势）
- **快速处理**：云端实时处理，无需本地安装

### 1.3 商业模式
- 免费增值模式
- 基础功能免费 + 高级功能付费
- 订阅制 + 单次付费

### 1.4 隐私承诺
- **零存储政策**：所有用户上传的图片 24 小时内自动删除
- **透明化处理**：页面明确标注"不存储用户图片"
- **数据最小化**：仅收集必要信息，无用户数据留存
- **安全传输**：全程 HTTPS 加密，保护用户隐私

---

## 2. 目标用户

### 2.1 核心用户群
- **设计师**：需要提升素材质量，优化印刷输出
- **数字艺术家**：修复老照片，增强作品细节
- **摄影爱好者**：优化低分辨率照片，提升画质
- **老照片修复需求者**：恢复模糊、损坏的珍贵照片

### 2.2 次要用户群
- 普通用户：提升社交媒体图片质量
- 小企业主：优化产品展示图片

---

## 3. MVP 功能范围

### 3.1 核心功能（P0 - 必须实现）

#### 3.1.1 图片上传
- **功能描述**：支持用户上传待处理图片
- **实现方式**：
  - 拖拽上传
  - 点击选择文件
  - 粘贴剪贴板图片
- **限制条件**：
  - 最大文件大小：10MB
  - 支持格式：JPG, PNG, HEIC, AVIF, WebP
  - 分辨率限制：最高 8000x8000 像素
- **隐私保护**：
  - 页面显著位置显示"不存储用户图片"标注
  - 上传前弹出隐私提示："您的图片将在 24 小时内自动删除"
  - 支持匿名上传（无需登录）

#### 3.1.2 实时预览
- **功能描述**：上传后快速显示低分辨率预览
- **实现方式**：
  - 客户端压缩显示（快速）
  - 服务器端处理完整版（后台）
- **用户反馈**：显示处理进度条和预计时间

#### 3.1.3 图像增强
- **功能描述**：使用 AI 模型增强图像质量
- **模型选择**：
  - 免费档：Real-ESRGAN（快速、稳定、带人脸增强）
  - 基础档：Google Upscaler（效果更好）
  - 人像主力：Crystal 4x（人像/面部/产品专精）
  - 印刷专业：Recraft（300DPI印刷级输出）
  - VIP极限：Crystal 10x（顶级高清放大，VIP专属）
- **增强参数**：
  - 放大倍率：2x, 4x
  - 噪声控制：低/中/高
  - 细节强度：轻度/标准/强力

#### 3.1.4 对比视图
- **功能描述**：并排显示原图和增强图
- **交互方式**：
  - 滑块对比（拖动查看差异）
  - 点击切换（原图 ↔ 增强图）
  - 缩放查看细节（支持 100%-400%）

#### 3.1.5 图片下载
- **功能描述**：导出增强后的图片
- **免费版限制**：
  - 最大分辨率：1920x1080
  - 添加水印（右下角）
  - 每日限制：3 张
- **付费版权限**：
  - 无分辨率限制（最高 8K）
  - 无水印
  - 无限次使用

### 3.2 辅助功能（P1 - MVP+ 实现）

#### 3.2.1 广告系统
- **位置**：上传页侧边栏、下载前弹窗
- **提供商**：Google AdSense
- **显示规则**：免费版显示，付费版隐藏

#### 3.2.2 用户认证
- **功能描述**：用户登录和订阅管理
- **实现方式**：Clerk Auth / NextAuth.js
- **支持方式**：
  - Google 账号登录
  - 邮箱登录
  - 匿名使用（受限功能）

#### 3.2.3 计费系统

**付费方式概览：**

1. **免费版**
   - 价格：$0
   - 额度：3 张/天
   - 模型：Real-ESRGAN（含人脸增强）
   - 限制：最大 1920x1080 分辨率，带水印

2. **积分制**

   | 积分包 | 价格 | 有效期 | 单价 | 性价比提升 |
   |--------|------|--------|------|-----------|
   | 100 积分 | $4.99 | 6 个月 | $0.049/积分 | 基准 |
   | 200 积分 | $7.99 | 6 个月 | $0.040/积分 | 省 18% |
   | 500 积分 | $12.99 | 12 个月 | $0.026/积分 | 省 47% |
   | 1000 积分 | $19.99 | 12 个月 | $0.020/积分 | 省 59% |

**积分消耗规则：**

| 档位 | 模型 | 积分 | 售价 | API成本 | 毛利率 | 说明 |
|------|------|------|------|---------|--------|------|
| 免费档 | Real-ESRGAN | 1 | $0 | $0.002 | - | 无门槛体验，带人脸增强，拉新引流 |
| 付费基础 | Google Upscaler | 3 | $0.12 | ~$0.0065 | ~94% | 效果更好，价格适中 |
| 人像主力 | Crystal 4x | 8 | $0.32 | $0.20 | 37.5% | 4x≈16MP，人像/面部/产品专精 |
| 印刷专业 | Recraft | 6 | $0.24 | ~$0.006 | ~97.5% | $6/千张，印刷级输出 |
| VIP极限 | Crystal 10x | 20 | $0.80 | $1.60 | 50% | 10x≈100MP，VIP专属 |

**退款政策：**
- 积分包购买后 7 天内未使用可全额退款
- 已使用的积分不支持退款

**支付方式：** Stripe（海外）+ 支付宝/微信（国内，待集成）
**支付功能：**
- 积分包购买
- 发票生成
- 退款处理

---

### 竞品对比

| 竞品 | 定价模式 | 单张成本 | 差异化 |
|------|---------|---------|--------|
| Let's Enhance | 订阅制 $9+/月 | ~$0.09-0.20 | ✅ 我们按张付费，无订阅 |
| Remini | 订阅制 $4.99/周 | ~$0.10-0.14 | ✅ 我们按张付费，无订阅 |
| Recraft AI | 订阅制 $12+/月 | ~$0.12+ | ✅ 我们按张付费，更便宜 |
| **Finegrain** | **按张付费** | **$0.02-0.60** | **无订阅、按张付、场景专精** |

### 3.3 技术功能（内部）

#### 3.3.0 AI 模型（机器人）系统

##### 3.3.0.1 模型架构概述

**核心设计理念**：
- 多模型架构：免费版使用快速模型，付费版使用高质量模型
- 智能选择：根据用户画像、图像类型自动选择最优模型
- 降级机制：主模型故障时自动切换备用模型
- 缓存优化：相同图片 24 小时内直接返回缓存结果

**技术栈**：
- **推理平台**：Replicate API（无服务器 GPU）
- **模型存储**：Replicate 模型仓库
- **队列管理**：Cloudflare Workers KV + Durable Objects
- **结果缓存**：Cloudflare KV（24 小时 TTL）

##### 3.3.0.2 模型列表与选择策略

**模型 1：Real-ESRGAN（免费档）**

基本信息：
- **模型版本**：nightmareai/real-esrgan
- **积分消耗**：1 积分/张
- **处理时间**：5-10 秒/张（2K 图像）
- **成本**：$0.002/张（$2 / 1000 张输出，≈ 0.015 元/张）
- **API成本毛利率**：免费引流（用户付0积分）
- **分辨率支持**：2x～10x 放大，输入上限建议 1440p，输出可达 4K
- **真实功能**：
  - 超分辨率放大（2x～10x）
  - GFPGAN 人脸增强（可选开启）
  - 修复模糊、压缩块、轻微噪点
  - 支持真实照片 + 动漫图像双模式
- **可宣传的功能**：
  - ✅ 真实细节恢复
  - ✅ 人脸增强
  - ✅ 老照片修复
  - ✅ 4K 级别输出
- **不可夸大的点**：
  - ❌ 不适合极致 10K 超大图（应引导至 Crystal 10x）
  - ❌ 不适合印刷级文字 / Logo 锐利度（应引导至 Recraft）
- **优势**：
  - 处理速度快，适合批量处理
  - 稳定性高，故障率 < 0.1%
  - 带人脸增强（GFPGAN），免费档即可处理人像
  - 支持动漫/真实图像双模式
- **劣势**：
  - 细节恢复较保守，不如 Crystal 自然
  - 4x 以上放大效果不如 Crystal
  - 输入上限建议 1440p，超大图需要先裁剪
- **适用场景**：
  - 免费用户快速体验
  - 老照片修复（带人脸增强）
  - 低分辨率图像（< 1080p）
  - 批量处理（用户上传多张）
- **Replicate 调用示例**：
  ```typescript
  const output = await replicate.run("nightmareai/real-esrgan", {
    input: {
      image: imageUrl,
      scale: 2, // 2x, 4x, 6x, 8x, 10x
      face_enhance: true, // 开启 GFPGAN 人脸增强
    }
  })
  ```

**模型 2：Google Upscaler（付费基础档）**

基本信息：
- **模型版本**：google/upscaler
- **积分消耗**：3 积分/张
- **处理时间**：10-15 秒/张（2K 图像）
- **成本**：~$0.0065/张
- **API成本毛利率**：~94%
- **分辨率支持**：2x, 4x 放大
- **优势**：
  - Google 官方模型，稳定性高
  - 性价比优秀
  - 适合通用图像增强
- **劣势**：
  - 非人像专精
  - 不支持极限放大
- **适用场景**：
  - 付费基础档用户
  - 风景、产品、通用图片增强
  - 性价比优先的用户
- **Replicate 调用示例**：
  ```typescript
  const output = await replicate.run("google/upscaler", {
    input: {
      image: imageUrl,
    }
  })
  ```

**模型 3：Crystal Upscaler（人像主力 + VIP极限）**

基本信息：
- **模型版本**：philz1337x/crystal-upscaler
- **定位**：VIP 专属人像模型，不做免费/基础档
- **积分消耗**：Crystal 4x = 8 积分/张，Crystal 10x = 20 积分/张
- **处理时间**：10-20 秒/张（4x），20-40 秒/张（10x）
- **分辨率支持**：1x～100x 缩放，实际可用 2x～10x，最高 10K 输出（无缝瓦片拼接）

**真实核心功能**：
- AI 真实重建皮肤纹理、发丝、五官细节（不是锐化滤镜）
- 无塑料感、不改变人脸身份、不糊脸
- 人像、面部、产品图专用优化
- 10倍速推理（比传统模型快10x）
- 适合 AI 生成人像（Midjourney / Stable Diffusion）

**可宣传的功能**：
- ✅ 真实细节恢复，不是简单滤镜锐化
- ✅ AI 真正恢复丢失细节，自然真实
- ✅ 最高 10 倍超高清放大，低清图 → 10K
- ✅ 人像皮肤自然、不塑料、不改变人脸身份
- ✅ 适合人像、面部、产品图、AI 绘图
- ✅ 输出清晰，可用于海报、印刷、高清展示
- ✅ 支持 4K/8K/10K 输出

**不可夸大的点**：
- ❌ 不擅长老照片修复（不处理划痕、泛黄、霉斑、破损）
- ❌ 不擅长文字、Logo 极致锐利
- ❌ 不做智能识别风景/人像自动切换
- ❌ 不支持批量处理（Replicate 一次只能 1 张）
- ❌ 不适合"512 百万像素"等夸张宣传

**⚠️ 成本核心：倍数与像素是平方关系**

> **放大倍数 ≠ 百万像素**
> - 4x 放大 ≠ 4MP，而是长宽各 ×4 → 面积 ×16 → 跳到 16MP 档
> - 10x 放大 ≠ 10MP，而是长宽各 ×10 → 面积 ×100 → 跳到 100MP 档
> - 倍数和 MP 是**平方关系**，不是线性关系

**成本（按输出总像素阶梯计费）**：

| 输出像素范围 | 单价 | 折合人民币（≈） |
|-------------|------|---------------|
| 0～4MP | $0.05/张 | 0.36 元 |
| 4～8MP | $0.10/张 | 0.72 元 |
| 8～16MP | $0.20/张 | 1.44 元 |
| 16～25MP | $0.40/张 | 2.88 元 |
| 25～50MP | $0.80/张 | 5.76 元 |
| 50～100MP | $1.60/张 | 11.52 元 |
| 100～200MP+ | $3.20/张 | 23.04 元 |

**倍数 → 实际成本换算（以常见原图为例）**：

原图 1000×1000（1MP）：

| 放大倍数 | 输出分辨率 | 输出MP | 实际成本 |
|---------|-----------|--------|---------|
| 2x | 2000×2000 | 4MP | $0.05 |
| 4x | 4000×4000 | 16MP | $0.20 |
| 8x | 8000×8000 | 64MP | $1.60 |
| 10x | 10000×10000 | 100MP | $1.60 |

原图 1280×720（HD，0.9MP）：

| 放大倍数 | 输出分辨率 | 输出MP | 实际成本 |
|---------|-----------|--------|---------|
| 2x | 2560×1440 | 3.7MP | $0.05 |
| 4x | 5120×2880 | 14.7MP | $0.20 |
| 8x | 10240×5760 | 59MP | $1.60 |

**实战结论**：
- ⚠️ **4x 放大几乎都会跳到 16MP 档（$0.20/张）**，不是便宜的
- ⚠️ **10x 放大几乎都会跳到 100MP 档（$1.60/张）**，成本非常高
- 2x 是性价比最高的选择（$0.05），但放大效果有限
- **必须按输出像素实时计算成本**，不能用固定单价

**定价与毛利率**：

| 档位 | 倍数 | 积分 | 售价 | 实际API成本 | 毛利率 |
|------|------|------|------|-----------|--------|
| Crystal 4x | 4x | 8 | $0.32 | $0.20 | 37.5% |
| Crystal 10x | 10x | 20 | $0.80 | $1.60 | **50%** |

> ⚠️ Crystal 10x 毛利率仅 50%，必须严格限制使用频率

**核心 Slogan**：
> AI 真实还原人像细节，不锐化、不假脸
> 从低清照片直出 10K 超高清人像大片

**适用场景**：
- 人像精修（证件照、自拍、肖像）
- AI 生成人像放大（Midjourney / SD）
- 电商产品图高清化
- 海报、展览级输出
- 高端付费用户

**使用限制建议**：
- 仅对付费用户开放
- Crystal 10x 建议每日限用 1-2 次
- Crystal 4x 是主力推荐档位
- 在前端明确标注"人像专用模型"

- **Replicate 调用示例**：
  ```typescript
  // Crystal 4x（人像主力）
  const output = await replicate.run("philz1337x/crystal-upscaler", {
    input: {
      image: imageUrl,
      upscale_factor: 4, // 推荐 4x，性价比最高
    }
  })

  // Crystal 10x（VIP极限）
  const output = await replicate.run("philz1337x/crystal-upscaler", {
    input: {
      image: imageUrl,
      upscale_factor: 10, // VIP 档位，注意成本
    }
  })
  ```

**模型 4：Recraft Crisp Upscale（印刷专业档）**

基本信息：
- **模型版本**：recraft-ai/recraft-crisp-upscale
- **积分消耗**：6 积分/张
- **处理时间**：~9 秒/张
- **成本**：$0.006/张（$6/千张，≈ 0.043 元/张）
- **API成本毛利率**：~97.5%
- **分辨率支持**：AI 自动决定输出大小，无需指定倍率
- **输入限制**：最大 10MB
- **优势**：
  - 极致性价比（$0.006/张）
  - 官方维护（Official 模型），稳定性高（230 万次运行）
  - Warm 状态（热启动，响应快）
  - 让图像更锐利、更清晰，适合 Web 和印刷
- **劣势**：
  - 只有一个输入参数 `image`，无法控制放大倍率
  - 非人像专精
  - 没有 README 文档，参数需从 Playground 推断
- **适用场景**：
  - 电商产品图锐化
  - Web 图片清晰化
  - 印刷素材准备
  - 性价比优先的付费用户
- **Replicate 调用示例**：
  ```typescript
  const output = await replicate.run("recraft-ai/recraft-crisp-upscale", {
    input: {
      image: imageUrl,
      // 注意：无其他参数，模型自动处理
    }
  })
  ```

**模型 5：（已合并到模型 3 Crystal Upscaler）**

> Crystal 4x 和 Crystal 10x 现在统一为模型 3，通过 `upscale_factor` 参数区分档位。
> - Crystal 4x：8 积分/张（成本 $0.20，毛利率 37.5%）
> - Crystal 10x：20 积分/张（成本 $1.60，毛利率 50%）

##### 3.3.0.3 智能模型选择算法

**决策树**：

```
开始
  ↓
检查用户订阅状态
  ├─ 免费 → 使用 Real-ESRGAN（跳到步骤 4）
  └─ 付费 → 继续判断
      ↓
检查用户选择（如果有）
  ├─ 用户选择了模型 → 使用用户选择
  └─ 用户未选择 → 继续判断
      ↓
分析图像特征（预处理）
  ├─ 动漫风格 → Real-ESRGAN-Anime 模式
  ├─ 真实照片 + 含人脸 → Real-ESRGAN（开启 face_enhance）
  ├─ 真实照片 + 高质量 → HAT（质量优先）
  ├─ 真实照片 + 噪声多 → NAFNet（降噪优先）
  └─ 低分辨率（< 1080p）→ Real-ESRGAN（快速）
      ↓
检查图像分辨率
  ├─ < 1080p → Real-ESRGAN（性价比高）
  ├─ 1080p-4K → HAT（4x 放大效果最好）
  └─ > 4K → NAFNet（避免 HAT OOM）
      ↓
检查当前负载
  ├─ 高负载（并发 > 50）→ Real-ESRGAN（快速释放）
  └─ 低负载 → 使用选中模型
      ↓
调用 Replicate API
  ↓
返回结果
```

**用户画像参数**：
- `subscriptionStatus`: "free" | "premium"
- `userPreference`: "speed" | "quality" | "balanced"
- `imageType`: "photo" | "anime" | "artwork" | "document"
- `noiseLevel`: 0-10（从图像分析得出）
- `currentResolution`: { width, height }
- `targetResolution`: { width, height }

**模型选择代码示例**：
```typescript
function selectModel(user: User, image: Image): Model {
  // 免费用户默认 Real-ESRGAN（含人脸增强）
  if (user.subscription === 'free') {
    return { model: 'realesrgan', credits: 1, faceEnhance: true, reason: 'free-user-default' }
  }

  // 用户手动选择（按档位）
  if (user.modelPreference) {
    const creditMap = {
      'realesrgan': 1,
      'google-upscaler': 3,
      'crystal': 8,       // 4x 默认，10x 需额外逻辑
      'recraft': 6,
    }
    return { model: user.modelPreference, credits: creditMap[user.modelPreference], reason: 'user-selected' }
  }

  // 智能选择
  const imageType = classifyImageType(image)

  // 人像场景 → Crystal（人像/面部/产品专精）
  if (imageType === 'portrait' || imageType === 'product') {
    return { model: 'crystal', credits: 8, reason: 'portrait-optimized' }
  }

  // 印刷场景 → Recraft
  if (imageType === 'print' || user.targetFormat === 'print') {
    return { model: 'recraft', credits: 6, reason: 'print-professional' }
  }

  // 高分辨率需求 → Crystal 10x（VIP，成本高）
  if (image.width > 3000 || image.height > 3000 || user.qualityLevel === 'ultra') {
    return { model: 'crystal', credits: 20, upscaleFactor: 10, reason: 'ultra-high-resolution' }
  }

  // 默认基础档
  return { model: 'google-upscaler', credits: 3, reason: 'balanced-default' }
}
```

##### 3.3.0.4 模型故障降级策略

**降级触发条件**：
- Replicate API 超时（> 120 秒）
- 模型返回 500/503 错误
- 并发限制达到（HTTP 429）
- 模型返回无效结果（ corrupted image）

**降级流程图**：

```
检测故障
  ↓
尝试重试（最多 2 次）
  ↓
仍然失败？
  ├─ 否 → 成功，返回结果
  └─ 是 → 启动降级
      ↓
当前模型是？
  ├─ Crystal 10x → 降级到 Crystal 4x
  ├─ Crystal 4x → 降级到 Recraft
  ├─ Recraft → 降级到 Google Upscaler
  ├─ Google Upscaler → 降级到 Real-ESRGAN
  └─ Google Upscaler → 降级到 Real-ESRGAN
      ↓
降级模型调用
  ↓
成功？
  ├─ 是 → 返回结果 + 用户提示
  └─ 否 → 继续降级
      ↓
记录错误日志 + 告警
  ↓
通知运维团队
```

**用户体验优化**：
```typescript
// 降级时返回友好提示
{
  "success": true,
  "imageUrl": "https://...",
  "creditsUsed": 3, // 自动调整积分
  "warnings": [
    {
      "type": "model_fallback",
      "message": "Primary model (Crystal) unavailable. Used backup model (Google). Credits adjusted."
    }
  ]
}
```

**重试策略**：
- 指数退避：首次立即，第 2 次等待 5 秒
- 仅对临时错误重试（503, 429）
- 永久错误不重试（400, 401, 403）

##### 3.3.0.5 模型性能监控

**监控指标**：
- 每个模型的调用次数
- 每个模型的平均处理时间
- 每个模型的故障率
- 每个模型的成本（美元/张）
- 用户满意度评分（可选）

**告警规则**：
- 故障率 > 5% → 发送 PagerDuty 告警
- 平均处理时间 > 2 倍正常 → 发送邮件告警
- 成本/张 > 预算 → 发送 Slack 通知

**监控面板**（可选）：
```
实时监控面板：
- Real-ESRGAN: ✓ 运行正常 (99.8% uptime) - 1积分/张 - 含人脸增强
- Google Upscaler: ✓ 运行正常 (99.5% uptime) - 3积分/张
- Crystal 4x: ✓ 运行正常 (99.2% uptime) - 8积分/张 - 4x≈16MP/$0.20 - 人像专精
- Recraft: ✓ 运行正常 (99.0% uptime) - 6积分/张 - $0.006/张超高性价比
- Crystal 10x: ⚠️ 使用率低，控制并发 - 20积分/张 - 10x≈100MP/$1.60 - 毛利率仅50%
```

##### 3.3.0.6 模型优化策略

**预处理优化**：
```typescript
// 上传前预处理
function preprocessImage(image: Image): ProcessedImage {
  // 调整尺寸（不超过模型限制）
  if (image.width > 8000 || image.height > 8000) {
    image = resizeImage(image, { max: 8000 })
  }

  // 转换颜色空间（某些模型偏好 RGB）
  if (image.colorSpace === 'CMYK') {
    image = convertColorSpace(image, 'RGB')
  }

  // 轻度降噪（避免模型过度处理）
  if (image.noiseLevel > 6) {
    image = lightDenoise(image, strength: 2)
  }

  return image
}
```

**后处理优化**：
```typescript
// 模型输出后处理
function postprocessImage(image: Image, options: Options): Image {
  // 色彩校正
  if (options.colorCorrection) {
    image = gammaCorrection(image, gamma: 2.2)
  }

  // 锐化增强（可选）
  if (options.sharpen) {
    image = usmFilter(image, amount: 0.3)
  }

  // 格式转换（WebP 优先）
  if (options.preferWebP) {
    image = convertFormat(image, 'webp', quality: 90)
  }

  return image
}
```

**批处理优化**：
```typescript
// 批量上传时优化
async function processBatch(images: Image[], user: User): Promise<Result[]> {
  // 使用同一模型（减少切换开销）
  const selectedModel = selectModel(user, images[0])

  // 并发处理（限制并发数）
  const concurrency = user.plan === 'premium' ? 5 : 2
  const results = await Promise.all(
    images.map(img => processImage(img, selectedModel))
      .reduce((batch, promise) => {
        // 实现并发限制
        return batch.then(queue => queue.then(() => promise))
      }, Promise.resolve([]))
  )

  return results
}
```

##### 3.3.0.7 结果缓存机制

**缓存策略**：
- **缓存键**：`imageHash + model + scale + parameters`
- **缓存时间**：24 小时（与存储删除时间一致）
- **缓存存储**：Cloudflare KV（全球边缘缓存）
- **缓存命中**：直接返回，不调用 Replicate API

**图像哈希计算**：
```typescript
async function computeImageHash(image: Buffer): Promise<string> {
  const hash = crypto.createHash('sha256')
  hash.update(image)
  return hash.digest('hex')
}
```

**缓存逻辑**：
```typescript
async function getFromCache(cacheKey: string): Promise<string | null> {
  const cached = await KV.get(cacheKey, { type: 'json' })
  if (cached && cached.expiresAt > Date.now()) {
    return cached.resultUrl
  }
  return null
}

async function setCache(cacheKey: string, resultUrl: string): Promise<void> {
  await KV.put(cacheKey, JSON.stringify({
    resultUrl,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }), { expirationTtl: 24 * 60 * 60 })
}
```

**缓存命中率目标**：
- 相同图像重新上传：> 80%
- 总体缓存命中率：> 20%
- 成本节省：约 15-20%

##### 3.3.0.8 模型成本控制

**成本计算器**：
```typescript
function calculateCost(model: Model, resolution: Resolution): number {
  const baseCosts = {
    'realesrgan': 0.002,      // $0.002/张 ($2/1000张)
    'google-upscaler': 0.0065, // ~$0.0065/张
    'crystal': 0.05,          // Crystal 基础，按输出像素阶梯调整
    'recraft': 0.006,         // $0.006/张 ($6/1000张)
  }

  // Crystal 模型按输出像素阶梯计费
  if (model === 'crystal') {
    const mp = (resolution.width * resolution.height) / 1000000
    if (mp > 100) return 3.20  // 100-200MP+
    if (mp > 50) return 1.60   // 50-100MP
    if (mp > 25) return 0.80   // 25-50MP
    if (mp > 16) return 0.40   // 16-25MP
    if (mp > 8) return 0.20    // 8-16MP
    if (mp > 4) return 0.10    // 4-8MP
    return 0.05                 // 0-4MP
  }

  return baseCosts[model] || 0.01
}
```

**预算控制**：
```typescript
// 每日预算告警
const DAILY_BUDGET = 100 // USD
let todayCost = 0

async function trackUsage(cost: number) {
  todayCost += cost

  if (todayCost > DAILY_BUDGET * 0.8) {
    sendAlert(`Daily budget 80% used: $${todayCost}`)
  }

  if (todayCost > DAILY_BUDGET) {
    throw new Error('Daily budget exceeded')
  }
}
```

##### 3.3.0.9 未来模型规划（MVP+）

**计划集成模型**：
- **SwinIR**：图像恢复 + 超分辨率
- **ESRGAN+**：改进版 Real-ESRGAN
- **Finegrain 自训练**：基于 Finegrain 开源项目自训练
- **Stable Diffusion Upscaler**：基于扩散模型的放大

**自训练模型路线图**：
- 第 1 阶段：收集用户数据（经同意）
- 第 2 阶段：使用 Finegrain 开源模型微调
- 第 3 阶段：自训练特定场景模型（老照片、动漫等）
- 第 4 阶段：部署到 Replicate（降低成本）

#### 3.3.1 图片存储
- **存储服务**：Cloudflare R2
- **策略**（严格执行）：
  - 原始图片：**存储 24 小时后自动删除**（免费版 + 付费版统一）
  - 增强图片：**存储 24 小时后自动删除**（免费版 + 付费版统一）
  - 下载提醒：用户下载时提示"图片将在 24 小时后删除"
  - CDN 加速：全球边缘节点分发
- **自动清理机制**：
  - Cloudflare Workers Cron Jobs：每小时扫描过期文件
  - 批量删除超过 24 小时的图片
  - 清理日志记录（仅保留 7 天）
- **数据验证**：
  - 定期审计 R2 存储桶，确保无超期文件
  - 异常告警：如果有文件超过 48 小时未删除

#### 3.3.2 API 服务
- **推理服务**：Replicate API
- **模型调用**：
  - Real-ESRGAN：$0.002/张（$2/1000张）
  - HAT/NAFNet：$0.003-0.005/张
- **队列管理**：处理并发请求，避免超时
- **智能路由**：根据用户画像自动选择模型
- **降级机制**：主模型故障时自动切换备用模型

---

## 4. 技术架构

### 4.0 UI/UX 隐私保护要求

#### 4.0.1 页面隐私标注
所有页面必须包含隐私保护说明：

**首页（Hero Section 下方）**：
```
🔒 Privacy First: Your images are automatically deleted after 24 hours.
   We do not store your personal data.
```

**上传组件下方**：
```
⚠️ Your uploaded images will be permanently deleted after 24 hours.
   Please save your enhanced results before then.
```

**下载确认弹窗**：
```
✅ Download Complete
   Your enhanced image is ready.
   ⏰ Reminder: This image will be automatically deleted in 24 hours.
   [I understand] [Close]
```

#### 4.0.2 隐私图标和视觉提示
- 使用 🔒（锁）图标表示安全
- 使用 ⚠️（警告）图标表示时间限制
- 使用 ✅（对勾）图标表示自动清理完成
- 隐私说明使用绿色或蓝色背景，增强信任感

#### 4.0.3 用户知情同意
- 上传前弹出隐私声明
- 用户必须点击"我同意"才能继续
- 提供"为什么需要 24 小时"的说明（解释 CDN 缓存）

### 4.1 前端架构

```typescript
技术栈：
- 框架：Next.js 14 (App Router)
- 语言：TypeScript
- 样式：Tailwind CSS
- UI 组件：shadcn/ui
- 状态管理：Zustand
- 表单处理：React Hook Form
```

**核心组件：**
```
components/
├── ImageUploader.tsx        # 上传组件
├── ComparisonSlider.tsx     # 对比滑块
├── PreviewModal.tsx         # 预览弹窗
├── AdBanner.tsx            # 广告横幅
├── PricingCards.tsx         # 定价卡片
└── ProgressBar.tsx          # 进度条
```

### 4.2 后端架构

```typescript
技术栈：
- API 框架：Next.js API Routes
- 推理服务：Replicate API
- 存储：Cloudflare R2
- 认证：Clerk Auth
- 支付：Stripe
```

**API 端点：**
```
/api/upload          # 上传图片到 R2
/api/enhance         # 调用 Replicate 增强
/api/download        # 下载增强图片
/api/checkout        # Stripe 支付
/api/webhook         # Stripe Webhook
/api/usage           # 查询使用量
```

### 4.3 部署架构

```
用户 → Cloudflare CDN → Cloudflare Pages (Next.js)
                         ↓
                    Cloudflare Workers (API)
                         ↓
                    Replicate API (AI 推理)
                         ↓
                    Cloudflare R2 (存储)
```

---

## 5. 数据流设计

### 5.1 图片处理流程

```
1. 用户上传图片
   ↓
2. 前端：显示预览 + 生成缩略图
   ↓
3. 后端：上传到 R2（临时存储）
   ↓
4. 后端：调用 Replicate API（异步）
   ↓
5. Replicate：处理图片 → 返回 URL
   ↓
6. 后端：下载结果 → 存储到 R2
   ↓
7. 前端：轮询 API 或 WebSocket 获取结果
   ↓
8. 用户：查看对比 + 下载
```

### 5.2 认证流程

```
1. 用户选择登录方式（Google/邮箱）
   ↓
2. Clerk Auth：重定向到 OAuth 页面
   ↓
3. 用户授权
   ↓
4. Clerk：返回 JWT Token
   ↓
5. 前端：存储 Token → 调用 API
   ↓
6. 后端：验证 Token → 检查订阅状态
```

---

## 6. API 设计

### 6.0 隐私保护 API

#### 6.0.1 隐私声明 API
```typescript
GET /api/privacy-status

Response (200):
{
  "retentionPeriod": "24 hours",
  "autoDeleteEnabled": true,
  "lastCleanup": "2026-03-20T10:00:00Z",
  "nextCleanup": "2026-03-20T11:00:00Z"
}
```

### 6.1 上传 API

```typescript
POST /api/upload

Request:
{
  "file": File,
  "quality": "high" | "standard"
}

Response (200):
{
  "imageUrl": "https://r2-url",
  "imageId": "uuid",
  "width": 1920,
  "height": 1080
}

Response (400):
{
  "error": "File too large (max 10MB)"
}
```

### 6.2 增强 API

```typescript
POST /api/enhance

Request:
{
  "imageId": "uuid",
  "model": "realesrgan" | "crystal" | "recraft" | "google-upscaler",
  "scale": 2 | 4,
  "noiseLevel": "low" | "medium" | "high"
}

Response (200):
{
  "taskId": "uuid",
  "status": "processing",
  "estimatedTime": 30
}

Response (403):
{
  "error": "Daily limit exceeded (3/3)"
}
```

### 6.3 查询结果 API

```typescript
GET /api/task/{taskId}

Response (200):
{
  "taskId": "uuid",
  "status": "completed",
  "imageUrl": "https://r2-url",
  "originalUrl": "https://r2-url",
  "watermarked": true
}
```

### 6.4 下载 API

```typescript
GET /api/download/{taskId}

Response (200):
- 图片流
- Header: Content-Disposition: attachment

Response (402):
{
  "error": "Upgrade required for 4K download",
  "upgradeUrl": "/pricing"
}
```

### 6.5 支付 API

```typescript
POST /api/checkout

Request:
{
  "planId": "monthly" | "single",
  "priceId": "price_xxx"
}

Response (200):
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

---

## 7. 数据库设计（可选）

如果需要持久化用户数据，使用 Cloudflare D1（SQLite）：

### 7.1 用户表 (users)

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  clerk_id TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7.2 使用记录表 (usage)

```sql
CREATE TABLE usage (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  task_id TEXT NOT NULL,
  model TEXT NOT NULL,
  cost REAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7.3 订阅表 (subscriptions)

```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  current_period_end TIMESTAMP
);
```

---

## 8. 安全设计

### 8.1 认证与授权
- 所有 API 端点需要验证 JWT Token
- 免费用户限制每日使用量
- 付费用户验证订阅状态

### 8.2 数据安全
- **图片自动删除**：所有用户图片 24 小时内自动删除，无例外
- **隐私标注**：页面显著位置显示"不存储用户图片"
- **敏感信息保护**：API Key 使用环境变量，不写入代码
- **HTTPS 强制**：所有数据传输强制加密（TLS 1.3）
- **数据最小化**：不收集用户个人信息，支持匿名使用
- **透明度报告**：定期发布数据处理和清理报告（可选）

### 8.3 支付安全
- 使用 Stripe 托管支付页面
- 服务器端验证 Webhook 签名
- 记录所有交易日志

### 8.4 限流与防滥用
- 单 IP 限制：每小时 100 次请求
- 单用户限制：免费版 3 张/天
- 异常行为检测：批量请求触发警告

---

## 9. 性能指标

### 9.1 响应时间
- 图片上传：< 3 秒
- 预览显示：< 5 秒
- 增强处理：< 30 秒（标准模型）
- 下载导出：< 2 秒

### 9.2 并发处理
- 支持 100+ 并发用户
- 队列处理机制避免超时

### 9.3 可用性
- 目标：99.5% 在线率
- 降级策略：模型故障时自动切换备用模型

---

## 10. 测试计划

### 10.1 单元测试
- API 端点测试
- 工具函数测试
- 组件单元测试

### 10.2 集成测试
- 上传 → 增强 → 下载 流程
- 认证 → 支付 → 解锁 流程

### 10.3 性能测试
- 压力测试：模拟 100 并发用户
- 负载测试：持续 1 小时高流量

### 10.4 安全测试
- SQL 注入测试
- XSS 攻击测试
- CSRF 攻击测试

---

## 11. 部署计划

### 11.1 开发环境
```bash
# 本地开发
npm run dev

# 部署到 Cloudflare Pages（预览环境）
npm run preview
```

### 11.2 生产环境
```bash
# 1. 构建项目
npm run build

# 2. 部署到 Cloudflare Pages
wrangler pages deploy .next

# 3. 配置环境变量
wrangler pages secret put REPLICATE_API_TOKEN
wrangler pages secret put STRIPE_SECRET_KEY
wrangler pages secret put R2_ACCOUNT_ID
```

### 11.3 监控与告警
- Cloudflare Analytics：流量、错误率
- Replicate Dashboard：API 使用量、成本
- Sentry：错误追踪
- PagerDuty：生产环境告警

---

## 12. 成本预算（月均 10,000 用户）

| 项目 | 费用 | 说明 |
|------|------|------|
| Cloudflare Pages | $0 | 免费额度内 |
| Cloudflare R2 | $5 | 存储 + 流量 |
| Replicate API | $80 | 10000 张 × $0.008 |
| Clerk Auth | $0 | 免费额度（5000 用户） |
| Stripe | 2.9% | 支付手续费 |
| 域名 | $1 | .com 域名年费（摊薄） |
| **总计** | **$86-100** | 不包含营销费用 |

---

## 13. 时间线（4 周 MVP）

### 第 1 周：基础设施 + 核心功能
- [ ] 创建 Next.js 项目
- [ ] 配置 Cloudflare Pages + R2
- [ ] 实现图片上传功能
- [ ] 集成 Replicate API
- [ ] 基础 UI 组件开发

### 第 2 周：增强功能 + 优化
- [ ] 实现对比视图
- [ ] 添加进度条和状态反馈
- [ ] 实现下载功能（免费 + 付费）
- [ ] 性能优化（压缩、缓存）
- [ ] 错误处理和用户提示

### 第 3 周：变现系统
- [ ] 集成 Clerk Auth
- [ ] 集成 Stripe 支付
- [ ] 实现订阅管理
- [ ] 添加 Google AdSense
- [ ] 用户使用限制逻辑

### 第 4 周：测试 + 上线
- [ ] 功能测试
- [ ] 性能测试
- [ ] 部署到生产环境
- [ ] 配置监控和告警
- [ ] 准备发布文档

---

## 14. 风险与应对

### 14.1 技术风险
| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| Replicate API 不稳定 | 中 | 高 | 准备备用模型，实现自动切换 |
| 图片处理超时 | 高 | 中 | 异步处理 + WebSocket 通知 |
| R2 存储故障 | 低 | 高 | 定期备份，异地灾备 |

### 14.2 商业风险
| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 用户增长缓慢 | 中 | 高 | 加强营销，优化 SEO |
| 成本超预算 | 中 | 中 | 实现自动成本监控告警 |
| 竞品出现 | 高 | 中 | 加快迭代，建立品牌壁垒 |

### 14.3 合规风险
| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 用户隐私数据泄露 | 低 | 极高 | 最小化数据收集，定期安全审计 |
| 版权争议 | 中 | 中 | 添加用户协议，免责声明 |

---

## 15. 成功指标（MVP）

### 15.1 产品指标
- **上线后 1 个月**：1,000 注册用户
- **上线后 3 个月**：5,000 注册用户
- **转化率**：免费 → 付费 > 3%
- **留存率**：7 日留存 > 20%

### 15.2 技术指标
- **响应时间**：P95 < 30 秒
- **可用性**：> 99%
- **错误率**：< 1%

### 15.3 商业指标
- **MRR（月经常性收入）**：上线 3 个月达到 $500
- **CAC（获客成本）**：< $5
- **LTV（生命周期价值）**：> $30

---

## 16. 后续计划（MVP+）

### 16.1 功能增强
- 批量处理功能
- 移动端 PWA 应用
- API 开放（第三方集成）
- 社交分享功能

### 16.2 模型优化
- 自训练 Finegrain 模型
- 支持更多格式（RAW, TIFF）
- 局部增强（选区处理）
- AI 辅助调参

### 16.3 商业扩展
- 企业版（API 集成）
- 白标解决方案
- 与设计师工具集成（Figma, Sketch）

---

## 附录

### A. 参考资源
- Real-ESRGAN: https://github.com/xinntao/Real-ESRGAN
- Replicate API: https://replicate.com/docs
- Cloudflare Pages: https://developers.cloudflare.com/pages
- Next.js 14: https://nextjs.org/docs

### B. 联系方式
- 项目负责人：林
- 技术支持：待定
- 商务合作：待定

### C. 版本历史
- v1.0 (2026-03-20)：MVP 需求文档初稿

---

**文档状态**：✅ 待评审
**最后更新**：2026-03-20
**下次更新**：开发启动前
