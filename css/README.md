# CSS样式库使用说明

## 文件结构

经过优化整合后，CSS文件结构如下：

### 核心文件（必须引入）

1. **base-variables.css** - 基础变量和全局样式
   - 颜色变量定义
   - 字体设置
   - 间距和尺寸变量
   - 全局重置样式

2. **components.css** - 通用组件样式
   - 按钮组件
   - 卡片组件
   - 进度条组件
   - 徽章组件
   - 通知组件
   - 对话框组件

3. **responsive.css** - 响应式样式
   - 断点定义
   - 响应式容器
   - 移动端优化
   - 触摸设备优化

### 功能模块文件

4. **forms.css** - 表单组件样式
   - 输入框样式
   - 选择框样式
   - 复选框和单选框
   - 表单验证样式

5. **navigation.css** - 导航组件样式
   - 主导航栏
   - 移动端导航
   - 底部导航
   - 面包屑导航

6. **accessibility.css** - 无障碍支持样式
   - 焦点指示器
   - 屏幕阅读器支持
   - 高对比度模式
   - 减少动画模式

### 专用文件（保留）

7. **ui-components.css** - 专用UI组件
   - 场景卡片
   - 技能点显示
   - 特殊布局组件

8. **responsive-media.css** - 媒体响应式
   - 图片响应式处理
   - 懒加载样式
   - 媒体查询优化

9. **scenario-detail.css** - 场景详情页样式
   - 场景详情布局
   - 模态框样式
   - 特殊交互样式

10. **user-progress-layout.css** - 用户进度页面
    - 用户信息卡片
    - 技能点展示
    - 进度条样式

## 优化成果

### 删除的冗余文件
- `doodle-style.css` - 内容整合到components.css
- `form-components.css` - 重构为forms.css
- `homepage-layout.css` - 内容整合到components.css和responsive.css
- `navigation-components.css` - 重构为navigation.css
- `text-scaling.css` - 内容整合到base-variables.css
- `ui-components-responsive.css` - 内容整合到responsive.css
- `unit-optimization.css` - 优化内容整合到各文件
- `fonts-local.css` - 未使用的字体定义文件

### 优化效果
- **文件数量减少**: 从13个文件减少到10个文件
- **代码重复消除**: 移除了重复的变量定义和样式规则
- **结构更清晰**: 按功能模块组织，便于维护
- **性能提升**: 减少了冗余代码，优化了加载性能

## 引入顺序

建议按以下顺序引入CSS文件：

```html
<!-- 1. 基础变量（必须第一个引入） -->
<link rel="stylesheet" href="css/base-variables.css">

<!-- 2. 通用组件 -->
<link rel="stylesheet" href="css/components.css">

<!-- 3. 响应式样式 -->
<link rel="stylesheet" href="css/responsive.css">

<!-- 4. 功能模块（按需引入） -->
<link rel="stylesheet" href="css/forms.css">
<link rel="stylesheet" href="css/navigation.css">
<link rel="stylesheet" href="css/accessibility.css">

<!-- 5. 专用组件（按需引入） -->
<link rel="stylesheet" href="css/ui-components.css">
<link rel="stylesheet" href="css/responsive-media.css">
<link rel="stylesheet" href="css/scenario-detail.css">
<link rel="stylesheet" href="css/user-progress-layout.css">
```

## 主要变量

### 颜色变量
```css
--primary-color: #FF7B8B;    /* 主色调 */
--secondary-color: #4CD4FF;  /* 次要色 */
--success-color: #5DE290;    /* 成功色 */
--warning-color: #FF9F1C;    /* 警告色 */
--danger-color: #FF6B6B;     /* 危险色 */
--info-color: #7B8CFF;       /* 信息色 */
```

### 间距变量
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
```

### 字体大小
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.25rem;    /* 20px */
--font-size-xl: 1.5rem;     /* 24px */
```

## 常用组件类名

### 按钮
```html
<!-- 基础按钮 -->
<button class="game-btn">按钮</button>

<!-- 不同类型 -->
<button class="game-btn primary">主要按钮</button>
<button class="game-btn secondary">次要按钮</button>
<button class="game-btn success">成功按钮</button>

<!-- 不同尺寸 -->
<button class="game-btn small">小按钮</button>
<button class="game-btn large">大按钮</button>

<!-- 全宽按钮 -->
<button class="game-btn full-width">全宽按钮</button>
```

### 卡片
```html
<!-- 基础卡片 -->
<div class="game-card">
  <div class="card-header">
    <h3 class="card-title">标题</h3>
  </div>
  <div class="card-content">
    内容
  </div>
  <div class="card-footer">
    <button class="game-btn primary">操作</button>
  </div>
</div>

<!-- 场景卡片 -->
<div class="scenario-card">
  <div class="scenario-header">
    <h3 class="scenario-title">场景标题</h3>
    <div class="scenario-meta">
      <span class="game-badge primary">简单</span>
    </div>
  </div>
  <div class="scenario-description">场景描述</div>
  <div class="scenario-actions">
    <button class="game-btn primary">开始</button>
  </div>
</div>
```

### 表单
```html
<div class="form-container">
  <div class="form-group">
    <label class="form-label">标签</label>
    <input type="text" class="form-input" placeholder="请输入">
    <div class="form-error-message">错误信息</div>
  </div>
  <div class="form-actions">
    <button class="game-btn primary">提交</button>
    <button class="game-btn">取消</button>
  </div>
</div>
```

### 进度条
```html
<div class="progress-container">
  <div class="progress-label">进度标签</div>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 60%"></div>
  </div>
</div>
```

## 响应式断点

```css
/* 小屏手机 */
@media (max-width: 29.9375rem) { /* < 479px */ }

/* 大屏手机 */
@media (min-width: 30rem) and (max-width: 47.9375rem) { /* 480px - 767px */ }

/* 平板 */
@media (min-width: 48rem) and (max-width: 63.9375rem) { /* 768px - 1023px */ }

/* 桌面 */
@media (min-width: 64rem) { /* > 1024px */ }
```

## 网格系统

```html
<!-- 响应式网格 -->
<div class="grid grid-responsive">
  <div>项目1</div>
  <div>项目2</div>
  <div>项目3</div>
</div>

<!-- 固定列数网格 -->
<div class="grid grid-3">
  <div>项目1</div>
  <div>项目2</div>
  <div>项目3</div>
</div>
```

## 工具类

```html
<!-- 文本对齐 -->
<div class="text-center">居中文本</div>
<div class="text-left">左对齐文本</div>
<div class="text-right">右对齐文本</div>

<!-- 间距 -->
<div class="mb-md">下边距中等</div>
<div class="p-lg">内边距大</div>
```

## 无障碍支持

所有组件都包含完整的无障碍支持：
- 键盘导航
- 屏幕阅读器支持
- 高对比度模式
- 减少动画模式
- 适当的焦点指示器

## 优化特性

1. **使用rem单位** - 支持用户字体大小设置
2. **最小触摸目标** - 移动端友好的44px最小触摸区域
3. **渐进增强** - 移动优先的响应式设计
4. **性能优化** - 减少重复代码，优化文件大小
5. **语义化** - 使用语义化的类名和结构

## 浏览器兼容性

- 现代浏览器（Chrome 60+, Firefox 60+, Safari 12+, Edge 79+）
- 支持CSS Grid和Flexbox
- 支持CSS自定义属性（变量）

## 维护建议

1. 新增组件时优先使用现有变量
2. 遵循BEM命名规范
3. 保持响应式设计原则
4. 确保无障碍支持
5. 定期检查和清理未使用的样式