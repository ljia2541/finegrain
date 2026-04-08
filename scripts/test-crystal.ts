/**
 * 测试 Crystal 4x（不指定 version，用 latest）
 */
import { promises as fs } from 'fs'
import path from 'path'

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN!
const INPUT_DIR = 'public/test-inputs'
const OUTPUT_DIR = 'public/test-results-crystal'

const TESTS = [
  { file: 'test_portrait_v2.jpg', label: '人像' },
  { file: 'test_landscape_v2.jpg', label: '风景' },
  { file: 'test_product_v2.jpg', label: '产品' },
]

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function upscale(model: string, inputPath: string, outputPath: string, extraInput?: Record<string, any>) {
  const fileData = await fs.readFile(inputPath)
  const base64 = fileData.toString('base64')
  const dataUri = `data:image/jpeg;base64,${base64}`

  // Create prediction without specifying version (uses latest)
  const body: any = {
    model,
    input: { image: dataUri, ...extraInput },
  }

  const createRes = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!createRes.ok) {
    const err = await createRes.text()
    throw new Error(`Create failed: ${err}`)
  }

  const prediction = await createRes.json()
  console.log(`    🔗 Prediction: ${prediction.id}`)
  console.log(`    📌 Version used: ${prediction.version?.id || 'latest'}`)

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
    return result.version?.id
  } else {
    throw new Error(`Failed: ${result.status} - ${JSON.stringify(result.error || '')}`)
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  // Crystal 4x - use model slug without version (let Replicate pick latest)
  const MODEL = 'philz1337x/crystal-upscaler'

  for (let i = 0; i < TESTS.length; i++) {
    const test = TESTS[i]
    const inputPath = path.join(INPUT_DIR, test.file)
    const outputPath = path.join(OUTPUT_DIR, test.file.replace('test_', 'result_crystal_'))
    console.log(`\n🖼️  ${test.label} - Crystal 4x:`)

    try {
      const version = await upscale(MODEL, inputPath, outputPath, { scale: 4, creativity: 0.3, prompt: 'enhance quality' })
      console.log(`    ✅ 完成 (version: ${version})`)
    } catch (e: any) {
      console.log(`    ❌ ${e.message}`)
    }

    if (i < TESTS.length - 1) {
      console.log('    ⏳ 等待 15s...')
      await sleep(15000)
    }
  }

  console.log('\n✅ 完成！')
}

main().catch(console.error)
