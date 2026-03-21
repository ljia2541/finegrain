#!/bin/bash
cd /root/.openclaw/workspace/project/finegrain

echo "等待依赖安装完成..."
while [ ! -f "node_modules/.bin/next" ]; do
    sleep 2
done

echo "依赖安装完成，启动开发服务器..."
echo "服务器将运行在: http://0.0.0.0:3000"
echo "外网访问地址: http://49.51.183.3:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev -- --hostname 0.0.0.0 --port 3000
