import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '服务条款 | Finegrain',
  description: 'Finegrain AI 图像增强平台服务条款',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">服务条款</h1>
        <p className="text-sm text-gray-500 mb-8">最后更新：2026年4月2日</p>

        <div className="prose prose-gray max-w-none space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. 服务说明</h2>
            <p>Finegrain（以下简称"本平台"）提供基于人工智能的在线图像增强服务。通过使用本平台，您同意遵守以下服务条款。本平台保留随时修改服务条款的权利，修改后继续使用即表示同意。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. 用户账户</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>您需要通过 Google 账号登录才能使用付费功能</li>
              <li>您有责任保护账户安全，不得与他人共享账户</li>
              <li>如发现未授权使用，请立即联系我们</li>
              <li>我们有权暂停或终止违反条款的账户</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. 积分与付费</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>积分可通过购买积分包或月订阅获得</li>
              <li>积分包积分有有效期：100/200 积分 90 天，500/1000 积分 180 天</li>
              <li>月订阅积分每月重置，不可累积</li>
              <li>Crystal 10x 按 $3.99/张 单独计费，不消耗积分</li>
              <li>积分一旦购买，除法律要求外不予退款</li>
              <li>积分不可转让、兑换现金或转移给其他用户</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. 使用规范</h2>
            <p>您同意不会：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>使用本平台处理违法、违规或侵权内容</li>
              <li>利用自动化工具批量处理图片（除非获得授权）</li>
              <li>对本平台进行反向工程、破解或攻击</li>
              <li>将本平台用于任何非法目的</li>
              <li>转售本平台服务或积分</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. 知识产权</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>上传图片的知识产权归用户所有</li>
              <li>增强后图片的知识产权归用户所有</li>
              <li>本平台的 AI 模型和技术归本平台所有</li>
              <li>免费版输出的图片带有水印</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. 免责声明</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>本平台按"原样"提供服务，不保证结果的准确性或适用性</li>
              <li>AI 增强结果可能存在偏差，用户应自行判断是否满足需求</li>
              <li>对于因使用本平台导致的任何损失，本平台不承担责任</li>
              <li>本平台不对第三方服务（如支付处理）的中断负责</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. 服务变更与终止</h2>
            <p>本平台保留随时修改、暂停或终止部分或全部服务的权利。对于免费服务，我们可能随时变更或终止，恕不另行通知。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. 适用法律</h2>
            <p>本服务条款受美国法律管辖。如有争议，应提交至有管辖权的法院解决。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. 联系我们</h2>
            <p>如有任何问题，请联系：support@finegrainimageenhancer.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
