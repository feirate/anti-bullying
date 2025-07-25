# JavaScript 文件使用说明文档

## 概述

本项目包含18个JavaScript文件，采用模块化架构设计，每个文件负责特定的功能领域。所有文件都遵循ES6+标准，支持现代浏览器，并提供了降级兼容方案。

## 文件架构图

```
js/
├── 核心基础层
│   ├── core.js              # 核心工具库
│   ├── config.js            # 配置管理器
│   └── device-manager.js    # 设备管理器
├── UI组件层
│   ├── ui-components.js     # UI组件库
│   ├── icon-system.js       # 图标系统
│   ├── form-components.js   # 表单组件
│   └── navigation-components.js # 导航组件
├── 功能增强层
│   ├── responsive-media.js  # 响应式媒体管理
│   ├── accessibility.js     # 无障碍支持
│   ├── keyboard-navigation.js # 键盘导航
│   ├── theme-manager.js     # 主题管理
│   └── performance-monitor.js # 性能监控
├── 业务逻辑层
│   ├── user-system.js       # 用户系统
│   ├── game-engine.js       # 游戏引擎
│   ├── scenario-detail.js   # 场景详情
│   └── supabase-client.js   # 数据库客户端
├── 安全与监控
│   └── security-check.js    # 安全检查
└── 主程序
    └── main.js              # 主程序入口
```

## 核心基础层

### core.js - 核心工具库
**功能**: 提供全局工具函数和基础功能
**主要类**: `CoreUtils`

**核心功能**:
- UUID生成
- 本地存储安全操作
- 防抖和节流函数
- 深拷贝对象
- 环境变量获取
- 设备和浏览器检测
- 剪贴板操作
- 日期格式化
- 事件发射器

**使用示例**:
```javascript
// 生成UUID
const id = CoreUtils.generateUUID();

// 本地存储操作
CoreUtils.storage.set('key', value);
const data = CoreUtils.storage.get('key', defaultValue);

// 防抖函数
const debouncedFn = CoreUtils.debounce(myFunction, 300);

// 复制到剪贴板
await CoreUtils.copyToClipboard('要复制的文本');
```

### config.js - 配置管理器
**功能**: 统一管理应用配置，支持环境变量
**主要类**: `ConfigManager`

**配置项**:
- 应用基础配置
- API配置
- Supabase配置
- 功能开关
- 本地存储配置

**使用示例**:
```javascript
// 获取配置值
const apiUrl = window.config.get('api.baseUrl');
const isProduction = window.config.isProduction();

// 验证环境变量
const isValid = window.config.validateRequiredEnvVars();
```

### device-manager.js - 设备管理器
**功能**: 整合设备检测、响应式处理和兼容性修复
**主要类**: `DeviceManager`

**核心功能**:
- 设备类型检测
- 浏览器兼容性修复
- 响应式断点管理
- 无障碍设置检测
- 网络状态监控

**使用示例**:
```javascript
// 获取设备配置
const deviceConfig = window.deviceManager.getDeviceConfig();
const browserInfo = window.deviceManager.getBrowserInfo();

// 监听设备配置变化
window.addEventListener('deviceConfigChanged', (e) => {
  console.log('设备配置已更新:', e.detail);
});
```

## UI组件层

### ui-components.js - UI组件库
**功能**: 提供统一的UI组件，替代emoji和不一致的视觉元素
**主要类**: `UIComponents`

**组件类型**:
- 按钮组件 (各种类型和尺寸)
- 卡片组件 (普通卡片、特性卡片、场景卡片)
- 进度条组件
- 徽章组件
- 通知组件
- 对话框组件
- 技能点显示

**使用示例**:
```javascript
// 渲染按钮
const buttonHtml = UIComponents.renderButton('点击我', 'handleClick()', 'primary', 'medium');

// 渲染卡片
const cardHtml = UIComponents.renderCard('标题', '内容', 'image.jpg');

// 渲染通知
UIComponents.renderNotification('操作成功！', 'success', 3000);
```

### icon-system.js - 图标系统
**功能**: 提供SVG图标库，替代emoji
**主要类**: `IconSystem`

**图标分类**:
- 情感图标 (happy, sad, neutral, surprised, angry)
- 功能图标 (close, play, pause, settings, etc.)
- 成就图标 (achievement, star, trophy, medal)
- 技能图标 (empathy, courage, wisdom, shield)
- 导航图标 (home, back, next, menu)
- 社交图标 (share, chat, help)
- 场景类型图标 (social, verbal, physical, cyber, property)

**使用示例**:
```javascript
// 渲染图标
const iconHtml = IconSystem.renderIcon('empathy', 'large', '#FF7B8B');

// 获取所有图标名称
const allIcons = IconSystem.getAllIconNames();

// 获取场景类型对应的图标
const categoryIcon = IconSystem.getCategoryIcon('社交排斥');
```

### form-components.js - 表单组件系统
**功能**: 提供响应式表单组件的创建和管理功能
**主要类**: `FormComponents`

**组件类型**:
- 基础输入字段
- 文本域
- 选择框
- 复选框组
- 单选框组
- 搜索表单
- 文件上传
- 表单按钮组

**使用示例**:
```javascript
// 渲染输入字段
const inputHtml = FormComponents.renderInput('text', 'username', '用户名', {
  required: true,
  placeholder: '请输入用户名'
});

// 表单验证
const isValid = FormComponents.validation.required(value);
const isEmail = FormComponents.validation.email(email);

// 设置字段错误
FormComponents.setFieldError('username', '用户名不能为空');
```

### navigation-components.js - 导航组件系统
**功能**: 提供响应式导航组件的创建和管理功能
**主要类**: `NavigationComponents`

**组件类型**:
- 主导航栏
- 底部导航栏
- 面包屑导航
- 侧边栏导航
- 跳转链接

**使用示例**:
```javascript
// 渲染主导航
const navConfig = NavigationComponents.createGameNavigation();
const navHtml = NavigationComponents.renderMainNavigation(navConfig);

// 设置活动导航项
NavigationComponents.setActiveNavItem('index.html');

// 切换移动菜单
window.navigationComponents.toggleMobileMenu();
```

## 功能增强层

### responsive-media.js - 响应式媒体资源管理器
**功能**: 根据设备特性优化图片和媒体资源的加载
**主要类**: `ResponsiveMedia`

**核心功能**:
- 图片URL优化
- 懒加载设置
- 网络状况适配
- 图片错误处理
- 性能优化

**使用示例**:
```javascript
// 获取优化的图片URL
const optimizedUrl = window.responsiveMedia.getOptimizedImageUrl('image.jpg', {
  width: 400,
  quality: 80
});

// 创建响应式图片
const imgHtml = ResponsiveMedia.createResponsiveImage({
  src: 'image.jpg',
  alt: '描述',
  lazy: true,
  width: 400
});
```

### accessibility.js - 无障碍支持模块
**功能**: 提供ARIA属性管理、键盘导航、焦点管理等功能
**主要类**: `AccessibilityManager`

**核心功能**:
- 键盘导航检测
- 焦点管理
- ARIA属性设置
- 实时区域管理
- 跳转链接
- 模态框无障碍性
- 表单无障碍性

**使用示例**:
```javascript
// 向屏幕阅读器宣布消息
window.accessibilityManager.announce('操作完成', 'polite');

// 设置模态框焦点陷阱
window.accessibilityManager.setupModalFocusTrap(modalElement);
```

### keyboard-navigation.js - 键盘导航增强模块
**功能**: 提供完整的键盘导航支持
**主要类**: `KeyboardNavigation`

**支持的导航**:
- 卡片网格导航
- 菜单导航
- 表单导航
- 模态框导航
- 全局快捷键

**快捷键**:
- `Ctrl + H`: 返回首页
- `Ctrl + F`: 聚焦搜索框
- `Ctrl + M`: 切换菜单
- `Alt + 1`: 跳转到主要内容
- `F1` 或 `?`: 显示键盘帮助

### theme-manager.js - 主题管理器
**功能**: 提供高对比度模式、暗色模式等主题切换功能
**主要类**: `ThemeManager`

**支持的主题**:
- 默认主题
- 高对比度模式
- 暗色模式
- 大字体模式

**使用示例**:
```javascript
// 设置主题
window.themeManager.setTheme('dark');

// 获取当前主题
const currentTheme = window.themeManager.getCurrentTheme();

// 监听主题变化
window.addEventListener('themeChanged', (e) => {
  console.log('主题已切换为:', e.detail.theme);
});
```

### performance-monitor.js - 性能监控和优化模块
**功能**: 提供性能监控、优化建议和用户反馈收集功能
**主要类**: `PerformanceMonitor`

**监控指标**:
- 页面加载时间
- 核心Web指标 (FCP, LCP, CLS, FID)
- 内存使用情况
- 网络状况
- 长任务检测

**快捷键**:
- `Ctrl + Shift + P`: 切换性能面板
- `Ctrl + Shift + F`: 显示反馈表单

## 业务逻辑层

### user-system.js - 用户系统管理
**功能**: 管理用户数据、进度跟踪、成就系统
**主要类**: `UserSystem`

**核心功能**:
- 用户创建和管理
- 进度跟踪
- 技能点系统
- 成就检查
- 场景过滤

**使用示例**:
```javascript
// 创建用户
window.userSystem.createUser(3); // 三年级

// 更新进度
window.userSystem.updateProgress('scenario1', {
  empathy: 2,
  courage: 1,
  wisdom: 1
});

// 检查成就
window.userSystem.checkAchievements();
```

### game-engine.js - 游戏引擎
**功能**: 管理游戏流程、场景渲染、选择处理
**主要类**: `GameEngine`

**核心功能**:
- 游戏数据加载
- 场景渲染
- 选择处理
- 结果显示
- 主菜单管理

**使用示例**:
```javascript
// 开始游戏
window.gameEngine.startGame();

// 开始特定场景
window.gameEngine.startScenario('scenario1');

// 显示主菜单
window.gameEngine.showMainMenu();
```

### scenario-detail.js - 场景详情页功能
**功能**: 提供场景详情页的显示和交互功能

**核心功能**:
- 场景详情显示
- 选项选择处理
- 结果展示
- 模态框管理

**使用示例**:
```javascript
// 显示场景详情
showScenarioDetail('scenario1');

// 选择选项
selectChoice('choice1');

// 隐藏详情页
hideScenarioDetail();
```

### supabase-client.js - 数据库客户端
**功能**: 管理与Supabase数据库的连接和数据操作
**主要类**: `SupabaseClient`

**核心功能**:
- 数据库连接管理
- 用户数据同步
- 统计信息获取
- 本地存储备用

**使用示例**:
```javascript
// 保存用户数据
await window.supabaseClient.saveUser(userData);

// 获取用户数据
const user = await window.supabaseClient.getUser(uuid);

// 获取统计信息
const stats = await window.supabaseClient.getUserStats();
```

## 安全与监控

### security-check.js - 运行时安全检查
**功能**: 在应用启动时进行安全验证
**主要类**: `SecurityCheck`

**检查项目**:
- HTTPS检查
- 环境变量检查
- 本地存储安全检查
- CSP检查
- 开发工具检查

## 主程序

### main.js - 主程序入口
**功能**: 应用程序的主入口点，协调各个模块的初始化和交互

**核心功能**:
- 应用初始化
- 全局函数定义
- 错误处理
- 键盘快捷键
- 页面可见性处理

**全局函数**:
- `startGame()`: 开始游戏
- `copyUserID()`: 复制用户ID
- `resetProgress()`: 重置进度
- `restartGame()`: 重新开始游戏
- `goToHomepage()`: 回到首页

## 依赖关系

### 核心依赖
- `core.js` → 被所有其他模块依赖
- `config.js` → 被大部分模块依赖
- `device-manager.js` → 被UI和媒体模块依赖

### UI依赖
- `ui-components.js` → 依赖 `icon-system.js`, `responsive-media.js`
- `form-components.js` → 独立模块
- `navigation-components.js` → 依赖 `responsive-media.js`

### 功能依赖
- `accessibility.js` → 依赖 `core.js`
- `keyboard-navigation.js` → 依赖 `accessibility.js`
- `theme-manager.js` → 依赖 `core.js`, `accessibility.js`
- `performance-monitor.js` → 依赖 `core.js`, `ui-components.js`

### 业务依赖
- `user-system.js` → 依赖 `core.js`, `ui-components.js`
- `game-engine.js` → 依赖 `user-system.js`, `ui-components.js`
- `scenario-detail.js` → 依赖 `game-engine.js`
- `supabase-client.js` → 依赖 `core.js`

## 加载顺序

根据 `index.html` 中的脚本加载顺序：

1. **核心基础层** (必须最先加载)
   - `core.js`
   - `config.js`
   - `device-manager.js`

2. **UI组件和功能模块**
   - `icon-system.js`
   - `ui-components.js`
   - `form-components.js`
   - `navigation-components.js`
   - `responsive-media.js`
   - `accessibility.js`
   - `keyboard-navigation.js`
   - `theme-manager.js`
   - `performance-monitor.js`
   - `security-check.js`

3. **业务逻辑模块**
   - `user-system.js`
   - `game-engine.js`
   - `scenario-detail.js`
   - `supabase-client.js`

4. **主程序** (最后加载)
   - `main.js`

## 最佳实践

### 1. 错误处理
所有模块都包含完善的错误处理机制，包括：
- try-catch 块
- 降级方案
- 用户友好的错误消息

### 2. 性能优化
- 懒加载
- 防抖和节流
- 内存管理
- 网络优化

### 3. 无障碍支持
- ARIA属性
- 键盘导航
- 屏幕阅读器支持
- 焦点管理

### 4. 响应式设计
- 设备适配
- 断点管理
- 触摸支持
- 媒体查询

### 5. 安全性
- 输入验证
- XSS防护
- 环境变量保护
- 安全检查

## 调试和开发

### 调试模式
启用调试模式可以显示性能面板：
```javascript
localStorage.setItem('debug-mode', 'true');
location.reload();
```

### 快捷键
- `Ctrl + Shift + P`: 切换性能面板
- `Ctrl + Shift + F`: 显示反馈表单
- `F1`: 显示键盘帮助

### 控制台命令
```javascript
// 获取性能报告
window.performanceMonitor.getPerformanceReport();

// 获取设备信息
window.deviceManager.getDeviceConfig();

// 获取用户数据
window.userSystem.user;

// 获取游戏数据
window.gameData;
```

## 扩展指南

### 添加新的UI组件
1. 在 `ui-components.js` 中添加新的静态方法
2. 遵循现有的命名约定和参数结构
3. 添加相应的CSS样式
4. 更新文档

### 添加新的图标
1. 在 `icon-system.js` 的 `iconMap` 中添加SVG代码
2. 更新 `getAllIconNames()` 方法
3. 在相应的分类中添加图标名称

### 添加新的主题
1. 在 `theme-manager.js` 的 `themes` 对象中添加主题
2. 在CSS中添加对应的主题样式类
3. 更新主题切换UI

### 添加新的性能监控指标
1. 在 `performance-monitor.js` 中添加新的监控逻辑
2. 更新性能面板显示
3. 添加相应的优化建议

## 故障排除

### 常见问题

1. **模块未定义错误**
   - 检查脚本加载顺序
   - 确保依赖模块已正确加载

2. **本地存储错误**
   - 检查浏览器是否支持localStorage
   - 检查存储空间是否已满

3. **网络请求失败**
   - 检查网络连接
   - 检查API端点配置

4. **样式不生效**
   - 检查CSS文件是否正确加载
   - 检查CSS选择器优先级

5. **键盘导航不工作**
   - 检查元素是否有正确的tabindex
   - 检查ARIA属性是否正确设置

### 日志级别
- `console.log()`: 一般信息
- `console.warn()`: 警告信息
- `console.error()`: 错误信息

### 性能问题
如果遇到性能问题，可以：
1. 启用性能监控面板
2. 检查网络状况
3. 查看内存使用情况
4. 优化图片加载

## 版本兼容性

### 浏览器支持
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 功能降级
所有模块都提供了降级方案，确保在不支持某些现代API的浏览器中仍能正常工作。

## 总结

本JavaScript架构采用模块化设计，职责分离清晰，具有良好的可维护性和扩展性。每个模块都有明确的功能边界，通过全局对象进行通信，支持现代Web标准，并提供了完善的降级方案。

所有模块都遵循以下原则：
- 单一职责原则
- 开放封闭原则
- 依赖倒置原则
- 接口隔离原则

这确保了代码的质量、可维护性和可扩展性。