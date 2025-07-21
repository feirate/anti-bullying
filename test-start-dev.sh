#!/bin/bash

# 测试 start-dev.sh 脚本的功能

echo "=========================================="
echo "测试 Anti-Bullying 开发服务器脚本"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# 测试函数
test_function() {
    local test_name="$1"
    local command="$2"
    local expected_exit="$3"
    
    echo "测试: $test_name"
    echo "命令: $command"
    
    eval "$command"
    local exit_code=$?
    
    if [ $exit_code -eq $expected_exit ]; then
        echo -e "${GREEN}✅ 测试通过${NC}"
    else
        echo -e "${RED}❌ 测试失败 (期望: $expected_exit, 实际: $exit_code)${NC}"
    fi
    echo ""
}

# 测试帮助功能
test_function "帮助信息" "./start-dev.sh help" 0

# 测试状态检查
test_function "状态检查" "./start-dev.sh status" 0

# 测试启动服务器
test_function "启动服务器" "./start-dev.sh start" 0

# 等待服务器启动
echo "等待服务器启动..."
sleep 5

# 测试服务器响应
test_function "服务器响应" "curl -s -o /dev/null -w '%{http_code}' http://localhost:8000" 0

# 测试重新启动
test_function "重新启动" "./start-dev.sh restart" 0

# 等待重启完成
sleep 3

# 测试重新部署
test_function "重新部署" "./start-dev.sh redeploy" 0

# 等待部署完成
sleep 3

# 测试停止服务器
test_function "停止服务器" "./start-dev.sh stop" 0

echo "=========================================="
echo "所有测试完成!"
echo "==========================================" 