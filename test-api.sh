#!/bin/bash

echo "🧪 Finegrain API 测试脚本"
echo "=========================="
echo ""

# 检查服务器是否运行
echo "1️⃣ 检查开发服务器状态..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 开发服务器运行正常"
else
    echo "❌ 开发服务器未运行"
    echo "请先运行: npm run dev"
    exit 1
fi

echo ""
echo "2️⃣ 测试上传 API..."
# 创建一个测试图片（1x1 红色像素）
convert -size 1x1 xc:red /tmp/test-image.jpg 2>/dev/null || echo "⚠️  需要安装 ImageMagick 来创建测试图片"

if [ -f "/tmp/test-image.jpg" ]; then
    echo "📤 上传测试图片..."
    
    UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:3000/api/upload \
        -F "file=@/tmp/test-image.jpg" \
        -H "Content-Type: multipart/form-data")
    
    echo "响应: $UPLOAD_RESPONSE"
    
    # 提取 imageId
    IMAGE_ID=$(echo $UPLOAD_RESPONSE | grep -o '"imageId":"[^"]*' | cut -d'"' -f4)
    IMAGE_URL=$(echo $UPLOAD_RESPONSE | grep -o '"imageUrl":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$IMAGE_ID" ]; then
        echo "✅ 上传成功！"
        echo "   Image ID: $IMAGE_ID"
        echo "   Image URL: $IMAGE_URL"
        
        echo ""
        echo "3️⃣ 测试增强 API..."
        ENHANCE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/enhance \
            -H "Content-Type: application/json" \
            -d "{\"imageUrl\":\"$IMAGE_URL\",\"model\":\"realesrgan\",\"scale\":2}")
        
        echo "响应: $ENHANCE_RESPONSE"
        
        TASK_ID=$(echo $ENHANCE_RESPONSE | grep -o '"taskId":"[^"]*' | cut -d'"' -f4)
        
        if [ -n "$TASK_ID" ]; then
            echo "✅ 增强任务创建成功！"
            echo "   Task ID: $TASK_ID"
            
            echo ""
            echo "4️⃣ 查询任务状态..."
            sleep 3
            
            STATUS_RESPONSE=$(curl -s http://localhost:3000/api/task/$TASK_ID)
            echo "响应: $STATUS_RESPONSE"
            
            STATUS=$(echo $STATUS_RESPONSE | grep -o '"status":"[^"]*' | cut -d'"' -f4)
            echo "当前状态: $STATUS"
        else
            echo "❌ 增强任务创建失败"
        fi
    else
        echo "❌ 上传失败"
    fi
else
    echo "⚠️  跳过上传测试（没有测试图片）"
fi

echo ""
echo "=========================="
echo "测试完成！"
