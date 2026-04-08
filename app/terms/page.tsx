import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Finegrain',
  description: 'Finegrain AI image enhancement platform terms of service.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 2, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Service Description</h2>
<p>Finegrain (the "Platform") provides AI-powered online image enhancement services. By using this Platform, you agree to the following Terms of Service. The Platform reserves the right to modify these terms at any time. Continued use after modifications constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. User Account</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You need to sign in with a Google account to use paid features.</li>
              <li>You are responsible for keeping your account secure and must not share it with others.</li>
              <li>If you discover unauthorized use, please contact us immediately.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Credits & Payments</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Credits can be obtained by purchasing credit packs or monthly subscriptions.</li>
              <li>Credit packs expire: 100/200 credits in 90 days, 500/1000 credits in 180 days</li>
              <li>Monthly subscription credits reset each month and do not roll over</li>
              <li>Credits are non-refundable once purchased, except as required by law</li>
              <li>Credits are non-transferable, not redeemable for cash, and cannot be transferred to other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the Platform to process illegal, violating, or infringing content</li>
              <li>Use automated tools for bulk image processing (unless authorized)</li>
              <li>Reverse engineer, hack, or attack the Platform</li>
              <li>Use the Platform for any illegal purpose</li>
              <li>Resell Platform services or credits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Intellectual Property</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Uploaded images retain their original intellectual property rights</li>
              <li>Enhanced images retain their original intellectual property rights</li>
              <li>AI models and technology on the Platform are owned by the Platform</li>
              <li>Images output by the free version contain a watermark</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Disclaimer</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>The Platform is provided "as is" without warranty of accuracy or fitness for purpose</li>
              <li>AI enhancement results may vary. Users should judge whether results meet their needs</li>
              <li>The Platform is not liable for any losses arising from use of the Platform</li>
              <li>The Platform is not responsible for interruptions in third-party services (e.g., payment processing)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Service Changes & Termination</h2>
            <p>The Platform reserves the right to modify, suspend, or terminate any or all services at any time. For free services, we may change or terminate them at any time without notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Governing Law</h2>
            <p>These Terms of Service are governed by the laws of the United States. Any disputes shall be submitted to the competent courts for resolution.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Contact Us</h2>
            <p>For any questions, contact: support@finegrainimageenhancer.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
