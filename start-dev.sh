#!/bin/bash

# Anti-Bullying 项目开发服务器启动脚本
# 支持重新部署、重新启动功能

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="Anti-Bullying"
PROJECT_DIR="$(dirname "$0")"
PORT=8000
URL="http://localhost:$PORT"

# 日志函数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查依赖
check_dependencies() {
    log_info "检查系统依赖..."
    
    # 检查Python
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
        log_success "找到 Python3"
    elif command -v python &> /dev/null; then
        PYTHON_CMD="python"
        log_success "找到 Python"
    else
        log_error "未找到Python，请安装Python3"
        exit 1
    fi
    
    # 检查Node.js (可选)
    if command -v node &> /dev/null; then
        log_success "找到 Node.js"
        NODE_AVAILABLE=true
    else
        log_warning "未找到Node.js，将使用Python服务器"
        NODE_AVAILABLE=false
    fi
    
    # 检查npm (可选)
    if command -v npm &> /dev/null; then
        log_success "找到 npm"
        NPM_AVAILABLE=true
    else
        log_warning "未找到npm"
        NPM_AVAILABLE=false
    fi
}

# 检查项目文件
check_project_files() {
    log_info "检查项目文件..."
    
    cd "$PROJECT_DIR"
    
    # 检查关键文件
    local required_files=("index.html" "js/main.js" "css/doodle-style.css")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_error "缺少关键文件: $file"
            exit 1
        fi
    done
    
    log_success "项目文件检查完成"
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."
    
    if [ "$NPM_AVAILABLE" = true ] && [ -f "package.json" ]; then
        log_info "安装npm依赖..."
        npm install
        log_success "npm依赖安装完成"
    else
        log_warning "跳过npm依赖安装"
    fi
}

# 检查端口占用
check_port() {
    log_info "检查端口 $PORT 占用情况..."
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "端口 $PORT 已被占用"
        read -p "是否要终止占用端口的进程? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "终止占用端口的进程..."
            lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
            sleep 2
            log_success "端口已释放"
        else
            log_error "端口被占用，无法启动服务器"
            exit 1
        fi
    else
        log_success "端口 $PORT 可用"
    fi
}

# 启动开发服务器
start_server() {
    log_info "启动开发服务器..."
    
    # 优先使用npm脚本
    if [ "$NPM_AVAILABLE" = true ] && [ -f "package.json" ]; then
        log_info "使用npm启动服务器..."
        npm run dev &
    else
        log_info "使用Python启动服务器..."
        python3 -m http.server $PORT &
    fi
    
    SERVER_PID=$!
    echo $SERVER_PID > .server.pid
    
    # 等待服务器启动
    log_info "等待服务器启动..."
    sleep 3
    
    # 检查服务器是否成功启动
    if curl -s "$URL" > /dev/null 2>&1; then
        log_success "服务器启动成功!"
        log_info "访问地址: $URL"
        log_info "按 Ctrl+C 停止服务器"
    else
        log_error "服务器启动失败"
        exit 1
    fi
}

# 停止服务器
stop_server() {
    log_info "停止开发服务器..."
    
    if [ -f ".server.pid" ]; then
        local pid=$(cat .server.pid)
        if kill -0 $pid 2>/dev/null; then
            kill $pid
            log_success "服务器已停止"
        fi
        rm -f .server.pid
    fi
    
    # 清理可能的残留进程
    if lsof -ti:$PORT >/dev/null 2>&1; then
        lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    fi
}

# 重新部署
redeploy() {
    log_info "开始重新部署..."
    
    # 停止当前服务器
    stop_server
    
    # 安装依赖
    install_dependencies
    
    # 检查项目文件
    check_project_files
    
    # 启动服务器
    start_server
    
    log_success "重新部署完成!"
}

# 重新启动
restart() {
    log_info "重新启动服务器..."
    
    stop_server
    sleep 2
    start_server
    
    log_success "服务器重新启动完成!"
}

# 显示帮助信息
show_help() {
    echo "使用方法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  start     启动开发服务器 (默认)"
    echo "  stop      停止开发服务器"
    echo "  restart   重新启动服务器"
    echo "  redeploy  重新部署 (停止+安装依赖+启动)"
    echo "  status    显示服务器状态"
    echo "  help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0              # 启动服务器"
    echo "  $0 restart      # 重新启动"
    echo "  $0 redeploy     # 重新部署"
}

# 显示状态
show_status() {
    log_info "服务器状态检查..."
    
    if [ -f ".server.pid" ]; then
        local pid=$(cat .server.pid)
        if kill -0 $pid 2>/dev/null; then
            log_success "服务器正在运行 (PID: $pid)"
            log_info "访问地址: $URL"
        else
            log_warning "服务器进程不存在"
            rm -f .server.pid
        fi
    else
        log_warning "服务器未运行"
    fi
    
    # 检查端口占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_success "端口 $PORT 正在监听"
    else
        log_warning "端口 $PORT 未在监听"
    fi
}

# 主函数
main() {
    local action=${1:-start}
    
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  $PROJECT_NAME 开发服务器${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    
    case $action in
        "start")
            check_dependencies
            check_project_files
            check_port
            install_dependencies
            start_server
            
            # 等待用户中断
            trap 'log_info "正在停止服务器..."; stop_server; exit 0' INT
            wait
            ;;
        "stop")
            stop_server
            ;;
        "restart")
            restart
            ;;
        "redeploy")
            redeploy
            ;;
        "status")
            show_status
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "未知选项: $action"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@" 