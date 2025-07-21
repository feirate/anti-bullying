#!/bin/bash

# 本地开发脚本
echo "🚀 启动Anti-Bullying本地开发服务器..."

# 确保在正确的目录
cd "$(dirname "$0")"
echo "📁 当前目录: $(pwd)"

# 检查Python是否可用
if command -v python3 &> /dev/null; then
    echo "✅ 使用Python3启动服务器..."
    echo "📱 访问地址: http://localhost:8000"
    echo "🛠️  按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ 使用Python启动服务器..."
    echo "📱 访问地址: http://localhost:8000"
    echo "🛠️  按 Ctrl+C 停止服务器"
    echo ""
    python -m http.server 8000
else
    echo "❌ 未找到Python，请安装Python3"
    echo "💡 或者使用: npm run dev"
    exit 1
fi 