import { Zap, Shield, Image as ImageIcon, Sparkles, Clock, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: '真实细节恢复',
    description: '不是简单的滤镜或锐化，AI 真正恢复图像中的丢失细节，让照片看起来更自然、更真实。',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: ImageIcon,
    title: '8x 超高清放大',
    description: '最高支持 10 倍超分辨率放大，从缩略图到海报，从低清到 10K，保持清晰度。',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    title: '快速批量处理',
    description: '一次处理最多 20 张图片，适用于电商产品目录、摄影师批量后期等场景。',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Shield,
    title: '隐私优先',
    description: '所有图片 24 小时内自动删除，全程 HTTPS 加密，我们不存储用户数据。',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Clock,
    title: '实时处理',
    description: '基于云端 AI 模型，快速处理您的图片，无需等待，无需本地安装任何软件。',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: CheckCircle,
    title: '智能优化',
    description: 'AI 会根据图片内容自动选择最佳处理方案，人像、产品、风景各有侧重。',
    gradient: 'from-teal-500 to-cyan-500'
  },
]

export default function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={feature.title}
          className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
        >
          <div className="flex items-start gap-4">
            <div className={`bg-gradient-to-br ${feature.gradient} p-3 rounded-xl flex-shrink-0 shadow-lg`}>
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
