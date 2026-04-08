import { promises as fs } from 'fs'
import path from 'path'

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN!
const INPUT_DIR = 'public/test-inputs'
const OUTPUT_DIR = 'public/test-results-recraft'

const TESTS = [
  { file: 'test_portrait_v2.jpg', label: '人像照片' },
  { file: 'test_landscape_v2.jpg', label: '风景建筑' },
  { file: 'test_product_v2.jpg', label: '产品特写' },
  { file: 'test_oldphoto_v2.jpg', label: '复古人像' },
  { file: 'test_aiart_v2.jpg', label: 'AI插画' },
]

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function upscale(model: string, version: string, inputPath: string, outputPath: string, extraInput?: Record<string, any>) {
  const fileData = await fs.readFile(inputPath)
  const base64 = fileData.toString('base64')
  const dataUri = `data:image/jpeg;base64,${base64}`

  const createRes = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version,
      input: { image: dataUri, ...extraInput },
    }),
  })

  if (!createRes.ok) {
    const err = await createRes.text()
    throw new Error(`Create failed: ${err}`)
  }

  const prediction = await createRes.json()
  let result = prediction

  let attempts = 0
  while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < 120) {
    await sleep(3000)
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` },
    })
    result = await pollRes.json()
    attempts++
    if (attempts % 10 === 0) console.log(`    ⏳ ${result.status} (${attempts * 3}s)`)
  }

  if (result.status === 'succeeded') {
    const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output
    const imgRes = await fetch(outputUrl!)
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
    await fs.writeFile(outputPath, imgBuffer)
    return true
  } else {
    throw new Error(`Failed: ${result.status}`)
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  // Recraft 4x
  const RECRAFT_V = '2177c1e3a177f5a76c632e467c32b413e424c23d84e43f7b036a965e305f6557'

  for (let i = 0; i < TESTS.length; i++) {
    const test = TESTS[i]
    const inputPath = path.join(INPUT_DIR, test.file)
    const outputPath = path.join(OUTPUT_DIR, test.file.replace('test_', 'result_recraft_'))
    console.log(`🖼️  ${test.label} - Recraft 4x:`)
    
    try {
      await upscale('recraft-ai/recraft-crisp-upscale', RECRAFT_V, inputPath, outputPath, { scale: 4 })
      console.log(`    ✅ 完成`)
    } catch (e: any) {
      console.log(`    ❌ ${e.message}`)
    }
    
    if (i < TESTS.length - 1) {
      console.log('    ⏳ 等待 15s...')
      await sleep(15000)
    }
  }

  console.log('\n✅ 全部完成！')
}

main().catch(console.error)
