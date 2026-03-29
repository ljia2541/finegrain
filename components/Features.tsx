import { Zap, Shield, Image as ImageIcon, Sparkles, Clock, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: '真实细节恢复',
    description: 'AI 真正恢复图像中的丢失细节，修复模糊和压缩块，不是简单锐化或滤镜。',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: ImageIcon,
    title: '超高清放大',
    description: '支持 2x～10x 超分辨率放大，免费版可达 4K，Crystal 付费版可达 10K。',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: CheckCircle,
    title: '人像细节优化',
    description: '优化面部细节和皮肤纹理，自然真实无塑料感。人像专精 Crystal 效果更佳。',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    icon: Zap,
    title: '快速处理',
    description: '基于云端 AI 模型，5-10 秒完成增强，无需等待，无需本地安装任何软件。',
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
    title: '人像专精',
    description: 'Crystal 模型专为真实人像优化，重建皮肤纹理和发丝，不改变人脸身份。',
    gradient: 'from-indigo-500 to-purple-500'
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
