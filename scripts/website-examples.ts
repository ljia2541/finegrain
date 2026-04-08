/**
 * 生成左右对比图：左边原图 | 右边 Recraft 4x
 */
import { promises as fs } from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const ORIG = 'public/test-inputs'
const RECRAFT = 'public/test-results-recraft'
const OUT = 'public/examples'

const PAIRS = [
  { orig: 'test_portrait_v2.jpg',  recraft: 'result_recraft_portrait_v2.jpg',  label: 'portrait' },
  { orig: 'test_landscape_v2.jpg', recraft: 'result_recraft_landscape_v2.jpg', label: 'landscape' },
  { orig: 'test_product_v2.jpg',   recraft: 'result_recraft_product_v2.jpg',  label: 'product' },
  { orig: 'test_oldphoto_v2.jpg',  recraft: 'result_recraft_oldphoto_v2.jpg', label: 'oldphoto' },
  { orig: 'test_aiart_v2.jpg',     recraft: 'result_recraft_aiart_v2.jpg',   label: 'aiart' },
]

async function main() {
  for (const pair of PAIRS) {
    const origPath    = path.join(ORIG, pair.orig)
    const recraftPath = path.join(RECRAFT, pair.recraft)

    // Get Recraft output dimensions
    const recraftInfo = execSync(`identify -format '%wx%h' "${recraftPath}"`).toString().trim()
    const [rw, rh] = recraftInfo.split('x').map(Number)

    // Resize original to match output height, centered
    execSync(`convert "${origPath}" -resize x${rh} -gravity center -background '#111' -extent ${rh}x${rh} /tmp/orig_r.jpg`)

    // Resize Recraft result to same height
    execSync(`convert "${recraftPath}" -resize x${rh} -gravity center -background '#111' -extent ${rh}x${rh} /tmp/recraft_r.jpg`)

    // Create: [原图 | Recraft]
    const outPath = path.join(OUT, `${pair.label}_original.jpg`)
    const outEnhPath = path.join(OUT, `${pair.label}_enhanced.jpg`)
    execSync(`convert /tmp/orig_r.jpg /tmp/recraft_r.jpg +append -font DejaVu-Sans-Bold -pointsize 24 -fill white -gravity northwest -annotate +10+10 '原图' -fill '#00ccff' -gravity northeast -annotate +10+10 'Recraft 4x' "${outPath}"`)
    execSync(`cp /tmp/recraft_r.jpg "${outEnhPath}"`)

    console.log(`✅ ${pair.label}`)
  }

  console.log('\n完成！')
}

main().catch(console.error)
