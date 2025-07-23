# 安全检查清单

## 部署前安全检查

### 1. 环境变量配置
- [ ] 确保 `.env` 文件包含真实的配置值
- [ ] 验证 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 已正确设置
- [ ] 确认使用的是匿名密钥而非服务密钥

### 2. 敏感信息检查
- [ ] 运行 `node scripts/security-audit.js` 进行自动检查
- [ ] 确保没有硬编码的API密钥
- [ ] 验证 `.gitignore` 包含所有敏感文件

### 3. 外部依赖安全
- [ ] 检查所有外部CDN依赖
- [ ] 考虑本地化关键依赖
- [ ] 使用固定版本号而非 `@latest`

### 4. HTTPS配置
- [ ] 生产环境必须使用HTTPS
- [ ] 验证所有API调用使用安全连接

### 5. 输入验证
- [ ] 检查所有用户输入点
- [ ] 实施XSS防护
- [ ] 验证数据类型和格式

## 生产环境配置

### 环境变量示例
```bash
# 生产环境 .env 文件
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 安全标头配置
```javascript
// 建议在服务器配置中添加
{
  "Content-Security-Policy": "default-src 'self'",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff"
}
```

## 监控和维护

- 定期运行安全审计脚本
- 监控依赖包的安全更新
- 定期轮换API密钥
- 监控异常访问模式