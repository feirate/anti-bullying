# 安全改进计划

## 高优先级改进

### 1. 本地化外部CDN依赖
```bash
# 安装Supabase客户端
npm install @supabase/supabase-js

# 安装Lottie播放器
npm install @lottiefiles/lottie-player

# 下载Google Fonts到本地
mkdir -p assets/fonts
curl -o assets/fonts/indie-flower.woff2 "https://fonts.gstatic.com/s/indieflower/v17/m8JVjfNVeKWVnh3QMuKkFcZVaUuH.woff2"
curl -o assets/fonts/comic-neue.woff2 "https://fonts.gstatic.com/s/comicneue/v8/4UaHrEJGsxNmFTPDnkaJx63j5pN1MwI.woff2"
```

### 2. 更新导入方式
```javascript
// 替换 js/supabase-client.js 中的动态导入
import { createClient } from '@supabase/supabase-js';

// 替换CSS中的字体导入
@font-face {
  font-family: 'Indie Flower';
  src: url('../assets/fonts/indie-flower.woff2') format('woff2');
}
```

### 3. 环境变量验证
```javascript
// 添加到 js/security-check.js
validateEnvironmentConfig() {
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missingVars = requiredVars.filter(key => !this.getEnvVar(key));
  
  if (missingVars.length > 0) {
    this.errors.push(`缺少必需的环境变量: ${missingVars.join(', ')}`);
  }
}
```

## 中优先级改进

### 1. 内容安全策略(CSP)
```html
<!-- 添加到 index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self' https://*.supabase.co;
">
```

### 2. 图片资源本地化
```bash
# 创建默认图片目录
mkdir -p data/pic/defaults

# 替换占位符图片
cp data/pic/default.png data/pic/defaults/scenario-placeholder.png
```

### 3. 安全头部配置
```javascript
// 添加到服务器配置或vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 低优先级改进

### 1. 代码混淆
```bash
# 生产环境代码混淆
npm install terser
terser js/*.js --compress --mangle -o dist/js/bundle.min.js
```

### 2. 依赖安全扫描
```bash
# 定期执行依赖安全扫描
npm audit
npm audit fix
```

### 3. 自动化安全检查
```bash
# 添加到package.json scripts
"scripts": {
  "security-check": "node scripts/security-audit.js",
  "pre-commit": "npm run security-check"
}
```