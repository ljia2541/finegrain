/**
 * POST /api/upload
 * 上传图片
 */
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({
        error: 'Invalid file type. Supported: JPG, PNG, WebP, HEIC, AVIF'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证文件大小 (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({
        error: 'File too large. Maximum size is 10MB'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成唯一文件名
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${random}.${ext}`;

    // TODO: 上传到 R2
    // 目前返回模拟数据
    const imageUrl = `/uploads/${filename}`;

    return new Response(JSON.stringify({
      success: true,
      imageId: `${timestamp}-${random}`,
      imageUrl,
      filename,
      size: file.size,
      type: file.type,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
