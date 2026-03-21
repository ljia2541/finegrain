# 对比视图组件使用说明

## ComparisonSlider 组件

**位置**: `components/ComparisonSlider.tsx`

### 功能特性

1. **滑块对比** - 拖动查看原图与增强图差异
2. **点击切换** - 点击图片重置到 100%
3. **缩放功能** - 支持 100%-400% 缩放查看细节
4. **响应式** - 移动端和桌面端都支持
5. **触摸支持** - 移动端触摸拖动

### 使用方法

```tsx
import ComparisonSlider from './components/ComparisonSlider'

function MyComponent() {
  return (
    <ComparisonSlider
      originalImage="/path/to/original.jpg"
      enhancedImage="/path/to/enhanced.jpg"
      originalAlt="模糊照片"
      enhancedAlt="清晰照片"
    />
  )
}
```

### Props

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `originalImage` | string | ✅ | 原图 URL |
| `enhancedImage` | string | ✅ | 增强图 URL |
| `originalAlt` | string | ❌ | 原图描述（默认："原图"） |
| `enhancedAlt` | string | ❌ | 增强图描述（默认："增强后"）|

### 交互说明

- **拖动滑块**：左右拖动查看对比
- **缩放控制**：点击放大/缩小按钮或滚轮缩放
- **重置视图**：点击"重置"按钮恢复 100%

---

## ExampleShowcase 组件

**位置**: `components/ExampleShowcase.tsx`

### 功能特性

1. **示例展示** - 4 个不同类别的示例
2. **交互选择** - 点击示例查看对比
3. **对比视图** - 使用 ComparisonSlider 展示
4. **响应式布局** - 自适应不同屏幕

### 示例类别

1. **人像照片增强** - 低分辨率 → 4K 高清
2. **风景照片超分** - 模糊风景 → 4x 放大
3. **老照片修复** - 年代久远 → 细节恢复
4. **产品照片优化** - 电商产品 → 高清展示

### 使用方法

```tsx
import ExampleShowcase from './components/ExampleShowcase'

function MyPage() {
  return <ExampleShowcase />
}
```

### 自定义示例

在 `components/ExampleShowcase.tsx` 中的 `examples` 数组中添加你的示例：

```typescript
const examples: Example[] = [
  {
    id: '1',
    title: '我的示例',
    description: '示例描述',
    originalImage: '/examples/my-original.jpg',
    enhancedImage: '/examples/my-enhanced.jpg',
    category: 'portrait'
  },
  // ... 添加更多示例
]
```

---

## 集成到主页

在 `app/page.tsx` 中添加示例展示：

```tsx
import ExampleShowcase from '@/components/ExampleShowcase'

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      
      {/* Features */}
      
      {/* ✨ 添加示例展示 */}
      <ExampleShowcase />
      
      {/* Pricing */}
      
      {/* Footer */}
    </main>
  )
}
```

---

## 注意事项

1. **图片准备**：
   - 确保图片已上传到 `public/examples/` 目录
   - 使用相对路径引用（如 `/examples/portrait-blurry.jpg`）
   - 建议尺寸：1200x800px

2. **性能优化**：
   - 示例图片已懒加载
   - 点击后才加载对比视图
   - 使用 Next.js Image 组件优化

3. **兼容性**：
   - 支持所有现代浏览器
   - 移动端触摸友好
   - 无障碍标签完整
