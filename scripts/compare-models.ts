/**
 * 模型效果对比脚本
 * 同时调用 FineGrain 的 4 个模型，输出结果到 public/compare/
 */

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN!

const INPUT_IMAGE = 'public/examples/portrait_original.jpg'
const OUTPUT_DIR = 'public/compare'

// FineGrain 的 4 个模型
const MODELS = [
  {
    name: 'Real-ESRGAN',
    model: 'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
    scale: 4,
  },
  {
    name: 'Google Upscaler',
    model: 'google/upscaler:496385cf77d71de0a4ac353b4b7cf798e63e903196e4394b12174f68c9c042ce',
    scale: 2,
  },
  {
    name: 'Recraft',
    model: 'recraft-ai/recraft-crisp-upscale:2177c1e3a177f5a76c632e467c32b413e424c23d84e43f7b036a965e305f6557',
    scale: 4,
  },
  {
    name: 'Crystal 4x',
    model: 'philz1337x/crystal-upscaler:5d917b1444c89ed91055f3052d27e1ad433a1218599a36544510e1dfa9ac26c8',
    scale: 4,
  },
]

// 竞品模型（Replicate 上的）
const COMPETITORS = [
  {
    name: 'Magnific ( upscale)',
    model: 'magnific/magnific-upscaler:54e87ea8e14fe81386f7c1c2a43a94b7e33b59902e59f4ff2a5baaafbb0b1788',
    scale: 2,
    // Note: Magnific 不是开源的，这里用公开的 upscale 模型替代
  },
]

import { promises as fs } from 'fs'
import path from 'path'

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function upscale(model: typeof MODELS[0], inputPath: string, outputPath: string) {
  console.log(`  🔄 ${model.name}: 创建预测...`)
  
  // 上传文件或使用 URL
  // For local files, we'll base64 encode
  
  const fileData = await fs.readFile(inputPath)
  const base64 = fileData.toString('base64')
  const dataUri = `data:image/jpeg;base64,${base64}`

  const input: any = {
    image: dataUri,
  }
  
  // Crystal 有额外参数
  if (model.name === 'Crystal 4x') {
    input.prompt = 'enhance quality, sharpen, more details'
    input.creativity = 0.3
    input.scale = model.scale
  }

  console.log(`  🔄 ${model.name}: 等待结果...`)

  try {
    // Create prediction
    const createRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model.model,
        input,
      }),
    })

    if (!createRes.ok) {
      const err = await createRes.text()
      console.log(`  ❌ ${model.name}: 创建失败 - ${err.substring(0, 200)}`)
      return false
    }

    const prediction = await createRes.json()
    let result = prediction

    // Poll for completion
    let attempts = 0
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < 60) {
      await sleep(3000)
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` },
      })
      result = await pollRes.json()
      attempts++
      if (attempts % 5 === 0) {
        console.log(`  ⏳ ${model.name}: ${result.status} (${attempts * 3}s)`)
      }
    }

    if (result.status === 'succeeded') {
      const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output
      console.log(`  ✅ ${model.name}: 下载结果...`)
      
      const imgRes = await fetch(outputUrl!)
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
      await fs.writeFile(outputPath, imgBuffer)
      console.log(`  ✅ ${model.name}: 完成 → ${outputPath}`)
      return true
    } else {
      console.log(`  ❌ ${model.name}: ${result.status} - ${JSON.stringify(result.error || '').substring(0, 200)}`)
      return false
    }
  } catch (e: any) {
    console.log(`  ❌ ${model.name}: ${e.message}`)
    return false
  }
}

async function main() {
  console.log('🎨 FineGrain vs 竞品 模型效果对比')
  console.log(`📸 输入图片: ${INPUT_IMAGE}`)
  console.log('')

  // Create output dir
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  // Copy original
  await fs.copyFile(INPUT_IMAGE, path.join(OUTPUT_DIR, '00_original.jpg'))
  console.log('📋 原图已复制')
  console.log('')

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i]
    const outputPath = path.join(OUTPUT_DIR, `${model.name.replace(/\s+/g, '_').toLowerCase()}.jpg`)
    console.log(`\n🖼️  ${model.name} (${model.scale}x):`)
    await upscale(model, INPUT_IMAGE, outputPath)
    // Wait 15s between requests to avoid rate limit
    if (i < MODELS.length - 1) {
      console.log('  ⏳ 等待 15s 避免限流...')
      await sleep(15000)
    }
  }

  console.log('')
  console.log('═══════════════════════════════════════')
  console.log('✅ 对比完成！结果在 public/compare/')
  console.log('═══════════════════════════════════════')
}

main().catch(console.error)
