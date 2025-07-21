# Anti-Bullying - 小学生反霸凌对话式成长游戏

一个专为小学生设计的反霸凌教育游戏，通过对话式场景帮助孩子们学习如何处理霸凌情况。

## 本地开发

### 快速开始

**方法1: 从项目根目录启动（推荐）**
```bash
# 在 ai-mate 目录下运行
./start-dev.sh
```

**方法2: 在BGH目录下启动**
```bash
# 进入BGH目录
cd BGH
./dev.sh
```

**方法3: 手动启动**
```bash
# 进入BGH目录
cd BGH
python3 -m http.server 8000
```

**方法4: 使用npm**
```bash
# 进入BGH目录
cd BGH
npm run dev
```

### 访问地址
```
http://localhost:8000
```

### 开发工具
- 打开浏览器开发者工具 (F12)
- 查看Console面板的错误信息
- 使用Network面板检查资源加载

### 调试技巧

1. **实时调试**
   - 修改代码后刷新浏览器即可看到效果
   - 使用浏览器开发者工具的Sources面板设置断点

2. **常见问题排查**
   - 检查Console面板的错误信息
   - 确认静态文件路径正确
   - 验证JSON数据格式

3. **部署前测试**
   ```bash
   # 本地测试通过后，部署到Vercel
   npm run deploy
   ```

## 项目结构

```
ai-mate/
├── start-dev.sh        # 快速启动脚本（根目录）
└── BGH/               # 项目主目录
    ├── index.html      # 主页面
    ├── dev.sh         # 开发启动脚本
    ├── debug.js       # 调试工具
    ├── package.json   # 项目配置
    ├── README.md      # 项目说明
    ├── DEVELOPMENT.md # 开发指南
    ├── css/           # 样式文件
    │   └── doodle-style.css
    ├── js/            # JavaScript文件
    │   ├── main.js        # 主程序
    │   ├── game-engine.js # 游戏引擎
    │   ├── user-system.js # 用户系统
    │   └── supabase-client.js # 数据库客户端
    ├── data/          # 游戏数据
    │   ├── scenarios.json # 场景数据
    │   └── contact-info.json # 联系信息
    └── assets/        # 静态资源
```

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **样式**: 手绘涂鸦风格CSS
- **数据**: JSON格式的游戏数据
- **部署**: Vercel

## 功能特性

- 🎮 年级匹配系统
- 🏆 成就系统
- 📊 技能点统计
- 💾 本地数据存储
- 📱 响应式设计

## 开发规范

- 使用中文注释
- 遵循ES6+语法
- 保持代码简洁可读
- 错误处理要完善

## 部署

```bash
# 进入BGH目录
cd BGH

# 部署到Vercel
vercel --prod
```

## 许可证

MIT License 