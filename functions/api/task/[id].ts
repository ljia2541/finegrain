/**
 * GET /api/task/[id]
 * 查询任务状态
 */
export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    
    // 从 URL 路径提取 task ID，例如 /api/task/abc123 -> abc123
    const match = url.pathname.match(/\/api\/task\/([^/]+)/);
    const taskId = match ? match[1] : null;

    if (!taskId) {
      return new Response(JSON.stringify({ error: 'Task ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await getTaskStatus(taskId, env);

    if (!result.success) {
      return new Response(JSON.stringify({
        error: result.error || 'Failed to get task status'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      taskId,
      status: result.status,
      output: result.output,
      error: result.error,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Get task error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get task status' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Replicate API 调用函数
async function getTaskStatus(taskId, env) {
  const REPLICATE_API_TOKEN = env.REPLICATE_API_TOKEN;

  if (!REPLICATE_API_TOKEN) {
    return { success: false, error: 'Replicate API token not configured' };
  }

  try {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${taskId}`, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      }
    });

    const data = await response.json();

    if (data.error) {
      return { success: false, error: data.error };
    }

    return {
      success: true,
      status: data.status,
      output: data.output,
    };
  } catch (error) {
    console.error('Replicate API error:', error);
    return { success: false, error: error.message };
  }
}
