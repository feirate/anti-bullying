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
    
    log_success "Vercel 部署完成!"
}

# 部署到 GitHub Pages
deploy_to_github_pages() {
    log_info "开始部署到 GitHub Pages..."
    
    # 检查是否有 GitHub Actions 配置
    if [ ! -f ".github/workflows/deploy.yml" ]; then
        log_error "未找到 GitHub Actions 配置文件"
        log_info "请确保 .github/workflows/deploy.yml 文件存在"
        exit 1
    fi
    
    # 检查 Git 远程仓库
    if ! git remote get-url origin &> /dev/null; then
        log_error "未找到 Git 远程仓库"
        log_info "请先添加 GitHub 远程仓库: git remote add origin <repository-url>"
        exit 1
    fi
    
    # 推送到 GitHub 触发自动部署
    log_info "推送代码到 GitHub..."
    git push origin main
    
    # 获取仓库信息
    local repo_url=$(git remote get-url origin)
    local repo_name=$(basename "$repo_url" .git)
    local username=$(echo "$repo_url" | sed -n 's/.*github.com[:/]\([^/]*\)\/.*/\1/p')
    
    log_success "GitHub Pages 部署已触发!"
    log_info "GitHub Actions 正在构建和部署..."
    log_info "部署完成后可访问: https://${username}.github.io/${repo_name}/"
    log_info "查看部署状态: https://github.com/${username}/${repo_name}/actions"
}

# 显示部署信息
show_deployment_info() {
    local platform=${1:-"vercel"}
    
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  部署信息${NC}"
    echo -e "${BLUE}================================${NC}"
    echo -e "项目名称: ${GREEN}$PROJECT_NAME${NC}"
    echo -e "部署平台: ${GREEN}${platform}${NC}"
    
    if [ "$platform" = "vercel" ]; then
        # 获取最新的部署 URL
        local deployment_url=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "无法获取部署URL")
        echo -e "部署URL: ${GREEN}$deployment_url${NC}"
    elif [ "$platform" = "github" ]; then
        # 获取仓库信息
        local repo_url=$(git remote get-url origin 2>/dev/null || echo "")
        if [ -n "$repo_url" ]; then
            local repo_name=$(basename "$repo_url" .git)
            local username=$(echo "$repo_url" | sed -n 's/.*github.com[:/]\([^/]*\)\/.*/\1/p')
            echo -e "部署URL: ${GREEN}https://${username}.github.io/${repo_name}/${NC}"
            echo -e "Actions状态: ${GREEN}https://github.com/${username}/${repo_name}/actions${NC}"
        fi
    fi
    
    echo -e "本地测试: ${GREEN}http://localhost:8000${NC}"
    echo ""
    echo -e "${YELLOW}下一步操作:${NC}"
    echo "1. 访问部署URL验证功能"
    echo "2. 检查控制台是否有错误"
    echo "3. 测试所有游戏功能"
    if [ "$platform" = "vercel" ]; then
        echo "4. 配置自定义域名（可选）"
    elif [ "$platform" = "github" ]; then
        echo "4. 在 GitHub 仓库设置中启用 Pages（如果未启用）"
    fi
    echo ""
}

# 显示帮助信息
show_help() {
    echo "使用方法: $0 [选项] [平台]"
    echo ""
    echo "选项:"
    echo "  deploy    部署项目 (默认)"
    echo "  build     仅构建项目"
    echo "  check     检查项目状态"
    echo "  help      显示此帮助信息"
    echo ""
    echo "部署平台:"
    echo "  vercel    部署到 Vercel (默认)"
    echo "  github    部署到 GitHub Pages"
    echo "  both      同时部署到两个平台"
    echo ""
    echo "示例:"
    echo "  $0                    # 部署到 Vercel"
    echo "  $0 deploy vercel      # 部署到 Vercel"
    echo "  $0 deploy github      # 部署到 GitHub Pages"
    echo "  $0 deploy both        # 同时部署到两个平台"
    echo "  $0 build              # 仅构建"
    echo "  $0 check              # 检查状态"
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
    local platform=${2:-vercel}
    
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
            
            case $platform in
                "vercel")
                    deploy_to_vercel
                    show_deployment_info "vercel"
                    ;;
                "github")
                    deploy_to_github_pages
                    show_deployment_info "github"
                    ;;
                "both")
                    log_info "部署到 GitHub Pages..."
                    deploy_to_github_pages
                    echo ""
                    log_info "部署到 Vercel..."
                    deploy_to_vercel
                    show_deployment_info "both"
                    ;;
                *)
                    log_error "未知部署平台: $platform"
                    log_info "支持的平台: vercel, github, both"
                    exit 1
                    ;;
            esac
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