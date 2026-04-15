import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Old Photo Restoration - Restore & Enhance Vintage Photos Online',
  description: 'Restore old, damaged, and vintage photos with AI. Fix blurry, faded, and low-resolution family photos. AI automatically enhances details, sharpens faces, and upscales to 4K. Try free.',
  keywords: ['old photo restoration', 'restore old photo AI', 'vintage photo enhancer', 'enhance old blurry photo', 'fix faded photo', 'AI photo restoration free', 'old family photo restoration', 'enhance vintage photo online', 'restore damaged photo AI', 'old photo quality improver'],
}

export default function OldPhotoRestorationPage() {
  return (
    <article className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">AI Old Photo Restoration: Fix Vintage & Damaged Photos</h1>
        <p className="text-lg text-gray-600 mb-8">
          Old photos carry irreplaceable memories, but time degrades them. AI photo restoration can breathe new life into vintage, faded, and blurry family photos — automatically enhancing details and upscaling to modern resolution.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What AI Photo Restoration Can Do</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Sharpen blurry details</strong> — AI reconstructs lost detail in out-of-focus areas</li>
            <li><strong>Enhance faces</strong> — GFPGAN neural network restores facial features in old portraits</li>
            <li><strong>Upscale resolution</strong> — Convert low-res scans to 4K with AI-generated detail</li>
            <li><strong>Reduce noise</strong> — Remove grain and artifacts from aged photos</li>
            <li><strong>Improve contrast</strong> — Recover faded details in washed-out photos</li>
          </ul>
          <p className="text-gray-700 mt-4">
            <strong>Note:</strong> AI excels at detail recovery and upscaling. For physical damage like scratches, tears, and discoloration, manual editing in Photoshop or specialized restoration tools may be needed alongside AI.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best AI Models for Old Photo Enhancement</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Real-ESRGAN — Best for General Old Photos (Free)</h3>
              <p className="text-gray-700">
                Real-ESRGAN includes built-in face enhancement (GFPGAN) making it ideal for old family portraits and vintage photos. It recovers real details, reduces noise, and upscales 4x — all for free on FineGrain.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Google Upscaler — Best for Natural Fidelity</h3>
              <p className="text-gray-700">
                If your old photo already has decent quality and you want the most natural enhancement possible, Google Upscaler preserves the authentic vintage feel while improving resolution.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Crystal AI — Best for Portrait Photos</h3>
              <p className="text-gray-700">
                For old portrait photos where face quality matters most, Crystal AI delivers the highest quality face enhancement with natural skin tones, upscale to 10K resolution.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Restore Old Photos with FineGrain</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-4">
            <li><strong>Scan your old photo</strong> — Use a scanner at 300+ DPI for best results, or a high-quality phone scan</li>
            <li><strong>Upload to FineGrain</strong> — Visit the free enhancement page and upload your scanned photo</li>
            <li><strong>Select Real-ESRGAN model</strong> — Best for old photos with its built-in face restoration</li>
            <li><strong>Enhance and compare</strong> — View the before/after slider to see recovered details</li>
            <li><strong>Download your restored photo</strong> — Get a 4x upscaled, enhanced version of your memory</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Best Old Photo Enhancement Results</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Scan at the highest resolution possible — more input detail means better AI output</li>
            <li>Crop to the subject area before enhancing — AI works best on focused content</li>
            <li>For group photos, consider enhancing faces separately for best results</li>
            <li>Multiple passes can sometimes improve results — enhance, then enhance again</li>
            <li>Preserve the original scan — always work on a copy</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Can AI remove scratches from old photos?</h3>
              <p className="text-gray-700">AI enhancement focuses on detail recovery and upscaling. FineGrain&apos;s models can significantly improve overall quality and reduce visual noise, but deep scratches may need manual inpainting tools alongside AI.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Is old photo restoration free?</h3>
              <p className="text-gray-700">Yes! FineGrain offers 3 free enhancements per day with Real-ESRGAN, which includes face restoration — perfect for old family photos.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">What resolution should I scan old photos at?</h3>
              <p className="text-gray-700">Scan at 300-600 DPI for photos. For slides or negatives, use 2400+ DPI. Higher input resolution gives AI more detail to work with.</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}
