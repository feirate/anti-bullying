# 本地开发指南

## 🚀 快速开始

### 方法1: 使用开发脚本（推荐）
```bash
./dev.sh
```

### 方法2: 使用Python
```bash
python3 -m http.server 8000
```

### 方法3: 使用npm
```bash
npm run dev
```

## 📱 访问地址
```
http://localhost:8000
```

## 🔧 调试工具

在浏览器控制台中可以使用以下调试命令：

### 基础检查
```javascript
// 检查游戏状态
debugTools.checkGameState()

// 检查DOM元素
debugTools.checkDOM()

// 检查静态资源
debugTools.checkResources()
```

### 用户管理
```javascript
// 创建测试用户（三年级）
debugTools.createTestUser(3)

// 重置用户数据
debugTools.resetUser()
```

### 帮助信息
```javascript
// 显示所有可用方法
debugTools.help()
```

## 🐛 常见问题排查

### 1. 静态资源404错误
- 检查文件路径是否正确
- 确认文件名大小写
- 运行 `debugTools.checkResources()` 检查

### 2. JavaScript错误
- 打开浏览器开发者工具 (F12)
- 查看Console面板的错误信息
- 使用 `debugTools.checkGameState()` 检查状态

### 3. 用户数据问题
- 使用 `debugTools.resetUser()` 重置数据
- 使用 `debugTools.createTestUser()` 创建测试用户

### 4. DOM元素问题
- 使用 `debugTools.checkDOM()` 检查元素
- 确认HTML结构正确

## 📝 开发流程

1. **启动本地服务器**
   ```bash
   ./dev.sh
   ```

2. **打开浏览器**
   ```
   http://localhost:8000
   ```

3. **修改代码**
   - 编辑HTML、CSS、JavaScript文件
   - 保存文件

4. **刷新浏览器**
   - 按F5或Ctrl+R刷新页面
   - 查看效果

5. **调试问题**
   - 打开开发者工具 (F12)
   - 使用调试工具检查状态
   - 修复问题

6. **测试通过后部署**
   ```bash
   vercel --prod
   ```

## 🛠️ 开发技巧

### 实时调试
- 修改代码后刷新浏览器即可看到效果
- 使用浏览器开发者工具的Sources面板设置断点
- 使用Console面板查看变量值

### 错误处理
- 所有JavaScript错误都会在Console中显示
- 使用try-catch包装可能出错的代码
- 添加console.log进行调试

### 性能优化
- 使用Network面板检查资源加载时间
- 优化图片和静态资源大小
- 减少不必要的DOM操作

## 📁 文件结构说明

```
BGH/
├── index.html          # 主页面
├── dev.sh             # 开发启动脚本
├── debug.js           # 调试工具
├── package.json       # 项目配置
├── README.md          # 项目说明
├── DEVELOPMENT.md     # 开发指南
├── css/               # 样式文件
├── js/                # JavaScript文件
├── data/              # 游戏数据
└── assets/            # 静态资源
```

## 🔄 部署流程

1. **本地测试**
   - 确保所有功能正常工作
   - 检查Console无错误

2. **提交代码**
   ```bash
   git add .
   git commit -m "修复描述"
   git push origin main
   ```

3. **部署到Vercel**
   ```bash
   vercel --prod
   ```

4. **验证部署**
   - 访问部署的URL
   - 测试所有功能
   - 检查Console无错误

## 📞 技术支持

- 查看Console错误信息
- 使用调试工具检查状态
- 参考此开发指南
- 检查README.md文件 