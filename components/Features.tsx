import { Zap, Shield, Image as ImageIcon } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: '快速处理',
    description: '基于云端 AI 模型，实时处理您的图片，无需本地安装任何软件。',
  },
  {
    icon: ImageIcon,
    title: '细节修复',
    description: '使用先进的 AI 模型恢复图像细节，支持 2x/4x 超分辨率放大。',
  },
  {
    icon: Shield,
    title: '隐私保护',
    description: '所有图片 24 小时内自动删除，全程 HTTPS 加密，不存储用户数据。',
  },
]

export default function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <feature.icon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-center mb-3">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-center">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  )
}
