#!/bin/bash

# 本地化外部依赖脚本
# 将外部CDN资源下载到本地以提高安全性

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 创建本地资源目录
create_directories() {
    log_info "创建本地资源目录..."
    mkdir -p assets/fonts
    mkdir -p assets/js/vendor
    log_success "目录创建完成"
}

# 下载Google Fonts
download_fonts() {
    log_info "下载Google Fonts..."
    
    # Indie Flower字体
    if curl -s -o assets/fonts/indie-flower.woff2 "https://fonts.gstatic.com/s/indieflower/v17/m8JVjfNVeKWVnh3QMuKkFcZVaUuH.woff2"; then
        log_success "Indie Flower字体下载完成"
    else
        log_error "Indie Flower字体下载失败"
    fi
    
    # Comic Neue字体
    if curl -s -o assets/fonts/comic-neue-regular.woff2 "https://fonts.gstatic.com/s/comicneue/v8/4UaHrEJGsxNmFTPDnkaJx63j5pN1MwI.woff2"; then
        log_success "Comic Neue字体下载完成"
    else
        log_error "Comic Neue字体下载失败"
    fi
    
    # Comic Neue Bold字体
    if curl -s -o assets/fonts/comic-neue-bold.woff2 "https://fonts.gstatic.com/s/comicneue/v8/4UaErEJGsxNmFTPDnkaJx63j5pN1MwI.woff2"; then
        log_success "Comic Neue Bold字体下载完成"
    else
        log_error "Comic Neue Bold字体下载失败"
    fi
}

# 安装NPM依赖
install_npm_dependencies() {
    log_info "安装NPM依赖..."
    
    if npm install @supabase/supabase-js @lottiefiles/lottie-player; then
        log_success "NPM依赖安装完成"
    else
        log_error "NPM依赖安装失败"
        return 1
    fi
}

# 更新CSS文件中的字体引用
update_css_fonts() {
    log_info "更新CSS文件中的字体引用..."
    
    # 备份原文件
    cp css/doodle-style.css css/doodle-style.css.backup
    
    # 替换Google Fonts导入为本地字体
    cat > css/local-fonts.css << 'EOF'
/* 本地字体定义 */
@font-face {
  font-family: 'Indie Flower';
  src: url('../assets/fonts/indie-flower.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Comic Neue';
  src: url('../assets/fonts/comic-neue-regular.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Comic Neue';
  src: url('../assets/fonts/comic-neue-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Comic Neue';
  src: url('../assets/fonts/comic-neue-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
EOF
    
    log_success "本地字体CSS文件创建完成"
}

# 创建本地化的HTML模板
create_local_html_template() {
    log_info "创建本地化HTML模板..."
    
    cat > index-local.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>校园反霸凌互动游戏</title>
    
    <!-- 本地化字体 -->
    <link rel="stylesheet" href="css/local-fonts.css">
    <link rel="stylesheet" href="css/doodle-style.css">
    <link rel="stylesheet" href="css/ui-components.css">
    
    <!-- 环境变量配置 -->
    <meta name="SUPABASE_URL" content="">
    <meta name="SUPABASE_ANON_KEY" content="">
</head>
<body>
    <!-- 页面内容保持不变 -->
    <div id="app"></div>
    
    <!-- 本地化JavaScript -->
    <script src="node_modules/@supabase/supabase-js/dist/umd/supabase.js"></script>
    <script src="js/security-check.js"></script>
    <script src="js/supabase-client.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
EOF
    
    log_success "本地化HTML模板创建完成"
}

# 主函数
main() {
    echo "🔒 开始本地化外部依赖..."
    echo ""
    
    create_directories
    download_fonts
    install_npm_dependencies
    update_css_fonts
    create_local_html_template
    
    echo ""
    echo "🎉 本地化完成！"
    echo ""
    echo "下一步操作："
    echo "1. 将 index-local.html 重命名为 index.html（备份原文件）"
    echo "2. 在 css/doodle-style.css 中移除 Google Fonts 导入"
    echo "3. 测试所有功能是否正常"
    echo "4. 提交更改到版本控制"
}

# 执行主函数
main "$@"