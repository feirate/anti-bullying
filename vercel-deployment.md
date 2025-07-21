# Vercel 部署配置指南

## 1. 项目准备

### 创建 vercel.json 配置文件
```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### 项目结构
```
BGH/
├── index.html          # 主页面
├── vercel.json         # Vercel 配置
├── css/
├── js/
├── data/
└── assets/
```

## 2. 部署步骤

### 方法一：GitHub 集成（推荐）
1. 将项目推送到 GitHub 仓库
2. 在 Vercel 控制台点击 "New Project"
3. 选择 GitHub 仓库
4. 配置项目设置：
   - **Framework Preset**: Other
   - **Root Directory**: BGH
   - **Build Command**: 留空
   - **Output Directory**: 留空
   - **Install Command**: 留空

### 方法二：直接上传
1. 在 Vercel 控制台点击 "New Project"
2. 选择 "Upload Template"
3. 上传 BGH 文件夹
4. 配置项目名称和域名

## 3. 环境变量配置

### Supabase 配置
在 Vercel 项目设置中添加环境变量：
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. 自定义域名设置

### 添加自定义域名
1. 在 Vercel 项目设置中点击 "Domains"
2. 添加您的域名
3. 配置 DNS 记录

### 推荐的域名格式
- `bullyguard.vercel.app` (Vercel 免费域名)
- `haohaozhangda.com` (自定义域名)

## 5. 部署后配置

### 检查部署状态
- 访问 `https://your-project.vercel.app`
- 检查控制台是否有错误
- 验证所有功能正常工作

### 性能优化
- 启用 Vercel 的 CDN 缓存
- 配置图片优化
- 启用 Gzip 压缩

## 6. 监控和维护

### 访问分析
- 使用 Vercel Analytics 查看访问数据
- 监控错误日志
- 跟踪性能指标

### 更新部署
- 每次推送到 GitHub 会自动触发重新部署
- 或手动在 Vercel 控制台重新部署 