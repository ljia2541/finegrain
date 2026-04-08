/**
 * 生成左右对比图：左边原图 | 右边增强后
 * 每个对比：原图(左) | 增强后(右)
 */
import { promises as fs } from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const ORIG = 'public/test-inputs'
const REAL_ESRGAN = 'public/test-results'
const RECRAFT = 'public/test-results-recraft'
const OUT = 'public/compare-final'

// 每个 tuple: (原图文件名, Real-ESRGAN结果, Recraft结果, 标签)
const PAIRS = [
  { orig: 'test_portrait_v2.jpg',  real: 'result_portrait.jpg',       realDir: 'public/test-results',     recraft: 'result_recraft_portrait_v2.jpg',  label: '01_人像' },
  { orig: 'test_landscape_v2.jpg', real: 'result_landscape.jpg',      realDir: 'public/test-results',     recraft: 'result_recraft_landscape_v2.jpg', label: '02_风景' },
  { orig: 'test_product_v2.jpg',   real: 'result_product.jpg',        realDir: 'public/test-results',     recraft: 'result_recraft_product_v2.jpg',  label: '03_产品' },
  { orig: 'test_oldphoto_v2.jpg',  real: 'result_oldphoto.jpg',       realDir: 'public/test-results',     recraft: 'result_recraft_oldphoto_v2.jpg', label: '04_复古' },
  { orig: 'test_aiart_v2.jpg',     real: 'result_aiart_v2.jpg',       realDir: 'public/test-results-v2',  recraft: 'result_recraft_aiart_v2.jpg',   label: '05_AI插画' },
]

async function main() {
  await fs.mkdir(OUT, { recursive: true })

  for (const pair of PAIRS) {
    const origPath     = path.join(ORIG, pair.orig)
    const realPath     = path.join(pair.realDir, pair.real)
    const recraftPath  = path.join(RECRAFT, pair.recraft)

    // Get Real-ESRGAN output dimensions
    const realInfo = execSync(`identify -format '%wx%h' "${realPath}"`).toString().trim()
    const [rw, rh] = realInfo.split('x').map(Number)

    // Resize original to match output height, square crop centered
    execSync(`convert "${origPath}" -resize x${rh} -gravity center -background '#111' -extent ${rh}x${rh} /tmp/orig_r.jpg`)

    // Resize Recraft result to same height
    execSync(`convert "${recraftPath}" -resize x${rh} -gravity center -background '#111' -extent ${rh}x${rh} /tmp/recraft_r.jpg`)

    // Triple: [原图 | Real-ESRGAN | Recraft]
    const outTriple = path.join(OUT, `${pair.label}_3.jpg`)
    execSync(`convert /tmp/orig_r.jpg "${realPath}" /tmp/recraft_r.jpg +append -font DejaVu-Sans-Bold -pointsize 24 -fill white -gravity northwest -annotate +10+10 '原图' -fill '#ff9944' -gravity north -annotate +10+10 'Real-ESRGAN 4x' -fill '#00ccff' -gravity northeast -annotate +10+10 'Recraft 4x' "${outTriple}"`)

    // Double: [原图 | Recraft]  (标注为网站案例展示)
    const outRecraft = path.join(OUT, `${pair.label}_Recraft.jpg`)
    execSync(`convert /tmp/orig_r.jpg /tmp/recraft_r.jpg +append -font DejaVu-Sans-Bold -pointsize 24 -fill white -gravity northwest -annotate +10+10 '原图' -fill '#00ccff' -gravity northeast -annotate +10+10 'Recraft 4x' "${outRecraft}"`)

    // Double: [原图 | Real-ESRGAN]
    const outReal = path.join(OUT, `${pair.label}_RealESRGAN.jpg`)
    execSync(`convert /tmp/orig_r.jpg "${realPath}" +append -font DejaVu-Sans-Bold -pointsize 24 -fill white -gravity northwest -annotate +10+10 '原图' -fill '#ff9944' -gravity northeast -annotate +10+10 'Real-ESRGAN 4x' "${outReal}"`)

    console.log(`✅ ${pair.label}: ${rh}x${rh}`)
  }

  console.log('\n完成！')
}

main().catch(console.error)
