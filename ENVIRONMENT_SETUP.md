# 环境变量配置指南

## 概述

本项目使用环境变量来管理敏感配置信息，确保生产环境的安全性。

## 配置步骤

### 1. 复制环境变量模板

```bash
cp .env.example .env
```

### 2. 配置Supabase

1. 登录 [Supabase控制台](https://app.supabase.com)
2. 创建新项目或选择现有项目
3. 在项目设置中找到API配置
4. 复制以下信息到 `.env` 文件：

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### 3. 验证配置

运行以下命令验证配置是否正确：

```bash
npm run security-check
```

## 安全注意事项

### ✅ 正确做法

- 使用 `.env` 文件存储敏感信息
- 确保 `.env` 文件在 `.gitignore` 中
- 使用不同的环境变量文件（开发、测试、生产）
- 定期轮换API密钥

### ❌ 错误做法

- 不要在代码中硬编码API密钥
- 不要将 `.env` 文件提交到版本控制
- 不要在日志中输出敏感信息
- 不要在客户端代码中暴露私钥

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `SUPABASE_URL` | Supabase项目URL | `https://abc123.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase匿名密钥 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## 部署配置

### Vercel部署

在Vercel控制台中设置环境变量：

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加所需的环境变量

### 其他平台

请参考相应平台的环境变量配置文档。

## 故障排除

### 常见问题

1. **配置未生效**
   - 检查 `.env` 文件是否在项目根目录
   - 确认变量名拼写正确
   - 重启开发服务器

2. **API调用失败**
   - 验证API密钥是否正确
   - 检查网络连接
   - 查看浏览器控制台错误信息

## 联系支持

如有问题，请联系开发团队或查看项目文档。