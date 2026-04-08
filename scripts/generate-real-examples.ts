/**
 * 生成真实案例对比图
 * 用 Real-ESRGAN 4x 放大，生成真实的增强前后对比
 */
import { promises as fs } from 'fs'
import path from 'path'

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN!
const INPUT_DIR = 'public/test-inputs'
const OUTPUT_DIR = 'public/test-results'

const MODEL = 'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b'

const TESTS = [
  { name: 'portrait', file: 'test_portrait.jpg', label: '人像照片' },
  { name: 'landscape', file: 'test_landscape.jpg', label: '风景照片' },
  { name: 'product', file: 'test_product.jpg', label: '产品照片' },
  { name: 'oldphoto', file: 'test_oldphoto.jpg', label: '老照片' },
]

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function upscale(inputPath: string, outputPath: string) {
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
      version: MODEL.split(':')[1],
      input: { image: dataUri },
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
    throw new Error(`Failed: ${result.status} ${JSON.stringify(result.error || '')}`)
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  for (const test of TESTS) {
    const inputPath = path.join(INPUT_DIR, test.file)
    const outputPath = path.join(OUTPUT_DIR, test.file.replace('test_', 'result_'))
    console.log(`🖼️  ${test.label} (${test.file}):`)
    
    // Copy original to results
    await fs.copyFile(inputPath, path.join(OUTPUT_DIR, test.file))
    
    try {
      await upscale(inputPath, outputPath)
      console.log(`    ✅ 完成`)
    } catch (e: any) {
      console.log(`    ❌ ${e.message}`)
    }
    
    // Wait to avoid rate limit
    console.log('    ⏳ 等待 15s...')
    await sleep(15000)
  }

  console.log('\n✅ 全部完成！结果在 public/test-results/')
}

main().catch(console.error)
