import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    COS_SECRET_ID_SET: !!process.env.TENCENT_COS_SECRET_ID,
    COS_SECRET_KEY_SET: !!process.env.TENCENT_COS_SECRET_KEY,
    COS_BUCKET: process.env.TENCENT_COS_BUCKET || 'NOT SET',
    COS_REGION: process.env.TENCENT_COS_REGION || 'NOT SET',
    REGION_MATCH: /^([a-z\d-]+)$/.test(process.env.TENCENT_COS_REGION || ''),
  })
}
