# Supabase 配置指南

## 1. 获取 API 密钥

### 步骤：
1. 登录您的 Supabase 项目：https://supabase.com/dashboard/project/msyzkvfgdcgqcbxvzhec
2. 进入 **Settings** → **API**
3. 复制以下信息：
   - **Project URL** (格式：https://msyzkvfgdcgqcbxvzhec.supabase.co)
   - **anon public** key (以 `eyJ` 开头的长字符串)

## 2. 创建环境变量文件

### 创建 .env 文件（本地开发）
```bash
# 在 BGH 目录下创建 .env 文件
touch .env
```

### 添加环境变量
```env
# Supabase 配置
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. 数据库表结构

### 创建用户表
```sql
-- 在 Supabase SQL Editor 中执行
CREATE TABLE users (
  uuid TEXT PRIMARY KEY,
  grade INTEGER NOT NULL,
  empathy INTEGER DEFAULT 0,
  courage INTEGER DEFAULT 0,
  wisdom INTEGER DEFAULT 0,
  completed_scenarios TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_users_uuid ON users(uuid);
CREATE INDEX idx_users_grade ON users(grade);
```

### 启用 RLS (Row Level Security)
```sql
-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 创建策略（允许匿名插入和查询）
CREATE POLICY "Allow anonymous insert" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update" ON users
  FOR UPDATE USING (true);
```

## 4. 前端集成

### 创建 Supabase 客户端配置
```javascript
// js/supabase-client.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 5. Vercel 环境变量配置

### 在 Vercel 控制台设置：
1. 进入项目设置
2. 点击 **Environment Variables**
3. 添加以下变量：
   - `SUPABASE_URL` = 您的项目URL
   - `SUPABASE_ANON_KEY` = 您的匿名密钥

## 6. 安全注意事项

### 正确的做法：
- 使用环境变量存储密钥
- 将 .env 文件加入 .gitignore
- 在 Vercel 中设置环境变量
- 使用匿名密钥（anon key）

### 错误的做法：
- 在代码中硬编码密钥
- 将密钥提交到 Git 仓库
- 使用服务端密钥（service_role key）在前端

## 7. 测试连接

### 创建测试脚本
```javascript
// test-supabase.js
import { supabase } from './js/supabase-client.js'

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('连接失败:', error)
    } else {
      console.log('连接成功!')
    }
  } catch (err) {
    console.error('测试失败:', err)
  }
}

testConnection()
```

## 8. 部署检查清单

- [ ] 环境变量已正确设置
- [ ] 数据库表已创建
- [ ] RLS 策略已配置
- [ ] .env 文件已加入 .gitignore
- [ ] 测试连接成功
- [ ] Vercel 环境变量已配置 