#!/bin/bash

# Anti-Bullying 项目部署脚本
# 自动部署到 Vercel

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
    log_info "检查部署依赖..."
    
    # 检查 Vercel CLI
    if command -v vercel &> /dev/null; then
        log_success "找到 Vercel CLI"
    else
        log_error "未找到 Vercel CLI，请先安装: npm i -g vercel"
        exit 1
    fi
    
    # 检查 Git
    if command -v git &> /dev/null; then
        log_success "找到 Git"
    else
        log_error "未找到 Git"
        exit 1
    fi
    
    # 检查 Node.js
    if command -v node &> /dev/null; then
        log_success "找到 Node.js"
    else
        log_error "未找到 Node.js"
        exit 1
    fi
}

# 检查项目文件
check_project_files() {
    log_info "检查项目文件..."
    
    cd "$PROJECT_DIR"
    
    # 检查关键文件
    local required_files=("index.html" "vercel.json" "package.json")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_error "缺少关键文件: $file"
            exit 1
        fi
    done
    
    log_success "项目文件检查完成"
}

# 构建项目
build_project() {
    log_info "构建项目..."
    
    # 运行构建脚本
    if [ -f "package.json" ]; then
        log_info "运行 npm build..."
        npm run build
        log_success "构建完成"
    else
        log_warning "跳过构建步骤"
    fi
}

# 检查 Git 状态
check_git_status() {
    log_info "检查 Git 状态..."
    
    if [ -d ".git" ]; then
        # 检查是否有未提交的更改
        if [ -n "$(git status --porcelain)" ]; then
            log_warning "发现未提交的更改"
            read -p "是否要提交更改? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                log_info "提交更改..."
                git add .
                git commit -m "部署前提交 - $(date)"
                log_success "更改已提交"
            fi
        else
            log_success "工作目录干净"
        fi
    else
        log_warning "未找到 Git 仓库"
    fi
}

# 部署到 Vercel
deploy_to_vercel() {
    log_info "开始部署到 Vercel..."
    
    # 检查是否已登录 Vercel
    if ! vercel whoami &> /dev/null; then
        log_info "需要登录 Vercel..."
        vercel login
    fi
    
    # 部署项目
    log_info "部署项目..."
    vercel --prod --yes
    
    log_success "部署完成!"
}

# 显示部署信息
show_deployment_info() {
    log_info "获取部署信息..."
    
    # 获取最新的部署 URL
    local deployment_url=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "无法获取部署URL")
    
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  部署信息${NC}"
    echo -e "${BLUE}================================${NC}"
    echo -e "项目名称: ${GREEN}$PROJECT_NAME${NC}"
    echo -e "部署URL: ${GREEN}$deployment_url${NC}"
    echo -e "本地测试: ${GREEN}http://localhost:8000${NC}"
    echo ""
    echo -e "${YELLOW}下一步操作:${NC}"
    echo "1. 访问部署URL验证功能"
    echo "2. 检查控制台是否有错误"
    echo "3. 测试所有游戏功能"
    echo "4. 配置自定义域名（可选）"
    echo ""
}

# 显示帮助信息
show_help() {
    echo "使用方法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  deploy    部署到 Vercel (默认)"
    echo "  build     仅构建项目"
    echo "  check     检查项目状态"
    echo "  help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0              # 部署项目"
    echo "  $0 build        # 仅构建"
    echo "  $0 check        # 检查状态"
}

# 检查项目状态
check_project_status() {
    log_info "检查项目状态..."
    
    check_dependencies
    check_project_files
    check_git_status
    
    log_success "项目状态检查完成"
}

# 主函数
main() {
    local action=${1:-deploy}
    
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  $PROJECT_NAME 部署工具${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    
    case $action in
        "deploy")
            check_dependencies
            check_project_files
            check_git_status
            build_project
            deploy_to_vercel
            show_deployment_info
            ;;
        "build")
            check_project_files
            build_project
            ;;
        "check")
            check_project_status
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