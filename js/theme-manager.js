/**
 * 主题管理器
 * 提供高对比度模式、暗色模式等主题切换功能
 */
class ThemeManager {
  
  constructor() {
    this.currentTheme = 'default';
    this.themes = {
      default: '默认主题',
      'high-contrast': '高对比度',
      'dark': '暗色模式',
      'large-text': '大字体模式'
    };
    
    this.init();
  }
  
  /**
   * 初始化主题管理器
   */
  init() {
    this.loadSavedTheme();
    this.createThemeToggle();
    this.setupMediaQueryListeners();
    this.applyTheme(this.currentTheme);
  }
  
  /**
   * 加载保存的主题设置
   */
  loadSavedTheme() {
    let savedTheme = null;
    
    // 使用CoreUtils存储，如果不可用则使用内联实现
    if (window.CoreUtils) {
      savedTheme = CoreUtils.storage.get('preferred-theme');
    } else {
      try {
        savedTheme = localStorage.getItem('preferred-theme');
      } catch (e) {
        console.warn('读取主题设置失败:', e);
      }
    }
    
    if (savedTheme && this.themes[savedTheme]) {
      this.currentTheme = savedTheme;
    } else {
      // 检测系统偏好
      this.detectSystemPreferences();
    }
  }
  
  /**
   * 检测系统偏好设置
   */
  detectSystemPreferences() {
    // 检测高对比度偏好
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.currentTheme = 'high-contrast';
    }
    // 检测暗色模式偏好
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.currentTheme = 'dark';
    }
    // 检测减少动画偏好
    else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduce-motion');
    }
  }
  
  /**
   * 创建主题切换控件
   */
  createThemeToggle() {
    // 创建主题切换按钮
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
      <button class="theme-toggle-btn" aria-label="切换主题" aria-expanded="false" aria-haspopup="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <span class="sr-only">当前主题: ${this.themes[this.currentTheme]}</span>
      </button>
      <div class="theme-menu" role="menu" aria-hidden="true">
        ${Object.entries(this.themes).map(([key, name]) => `
          <button 
            class="theme-option ${key === this.currentTheme ? 'active' : ''}" 
            role="menuitem"
            data-theme="${key}"
            aria-pressed="${key === this.currentTheme}"
          >
            ${name}
            ${key === this.currentTheme ? '<span class="checkmark">✓</span>' : ''}
          </button>
        `).join('')}
      </div>
    `;
    
    // 添加样式
    this.addThemeToggleStyles();
    
    // 添加到页面
    document.body.appendChild(themeToggle);
    
    // 绑定事件
    this.bindThemeToggleEvents(themeToggle);
  }
  
  /**
   * 添加主题切换器样式
   */
  addThemeToggleStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .theme-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
      }
      
      .theme-toggle-btn {
        background: var(--bg-white);
        border: 2px solid var(--border-color);
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--shadow-medium);
        transition: all 0.3s ease;
        color: var(--text-dark);
      }
      
      .theme-toggle-btn:hover {
        background: var(--bg-light);
        transform: translateY(-1px);
        box-shadow: var(--shadow-large);
      }
      
      .theme-toggle-btn:focus {
        outline: 3px solid var(--primary-color);
        outline-offset: 2px;
      }
      
      .theme-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 8px;
        background: var(--bg-white);
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-large);
        min-width: 180px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
      }
      
      .theme-menu[aria-hidden="false"] {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      .theme-option {
        width: 100%;
        padding: 12px 16px;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: var(--text-dark);
        transition: background-color 0.2s ease;
      }
      
      .theme-option:hover {
        background: var(--bg-light);
      }
      
      .theme-option:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
        background: var(--bg-light);
      }
      
      .theme-option.active {
        background: rgba(255, 123, 139, 0.1);
        color: var(--primary-color);
        font-weight: 600;
      }
      
      .checkmark {
        color: var(--primary-color);
        font-weight: bold;
      }
      
      /* 高对比度主题样式 */
      .theme-high-contrast {
        --primary-color: #000000;
        --secondary-color: #000000;
        --text-dark: #000000;
        --text-medium: #000000;
        --text-light: #333333;
        --text-white: #ffffff;
        --bg-white: #ffffff;
        --bg-light: #f0f0f0;
        --bg-dark: #000000;
        --border-color: #000000;
        --success-color: #000000;
        --warning-color: #000000;
        --danger-color: #000000;
        --info-color: #000000;
        --shadow-small: 0 2px 4px rgba(0,0,0,0.5);
        --shadow-medium: 0 4px 8px rgba(0,0,0,0.5);
        --shadow-large: 0 8px 16px rgba(0,0,0,0.5);
      }
      
      .theme-high-contrast * {
        border-color: var(--text-dark) !important;
      }
      
      .theme-high-contrast .game-btn,
      .theme-high-contrast .form-input,
      .theme-high-contrast .form-textarea,
      .theme-high-contrast .form-select {
        border: 3px solid var(--text-dark) !important;
        background: var(--bg-white) !important;
        color: var(--text-dark) !important;
      }
      
      .theme-high-contrast .game-btn:hover,
      .theme-high-contrast .game-btn:focus {
        background: var(--text-dark) !important;
        color: var(--bg-white) !important;
      }
      
      .theme-high-contrast a {
        color: var(--text-dark) !important;
        text-decoration: underline !important;
      }
      
      .theme-high-contrast a:hover,
      .theme-high-contrast a:focus {
        background: var(--text-dark) !important;
        color: var(--bg-white) !important;
      }
      
      /* 暗色主题样式 */
      .theme-dark {
        --primary-color: #FF8C99;
        --secondary-color: #5DDBFF;
        --text-dark: #ffffff;
        --text-medium: #cccccc;
        --text-light: #999999;
        --text-white: #000000;
        --bg-white: #1a1a1a;
        --bg-light: #2a2a2a;
        --bg-dark: #000000;
        --border-color: #444444;
      }
      
      .theme-dark body {
        background-color: var(--bg-dark);
        color: var(--text-dark);
      }
      
      /* 大字体主题样式 */
      .theme-large-text {
        font-size: 120%;
      }
      
      .theme-large-text .game-btn {
        min-height: 52px;
        padding: 16px 24px;
        font-size: 18px;
      }
      
      .theme-large-text .form-input,
      .theme-large-text .form-textarea,
      .theme-large-text .form-select {
        min-height: 52px;
        padding: 16px 20px;
        font-size: 18px;
      }
      
      .theme-large-text .scenario-card {
        padding: 24px;
      }
      
      .theme-large-text .scenario-title {
        font-size: 20px;
      }
      
      .theme-large-text .scenario-description {
        font-size: 17px;
        line-height: 1.7;
      }
      
      /* 响应式调整 */
      @media (max-width: 479px) {
        .theme-toggle {
          top: 10px;
          right: 10px;
        }
        
        .theme-toggle-btn {
          width: 40px;
          height: 40px;
        }
        
        .theme-menu {
          right: -10px;
          min-width: 160px;
        }
        
        .theme-option {
          padding: 14px 12px;
          font-size: 16px;
        }
      }
      
      /* 减少动画模式 */
      @media (prefers-reduced-motion: reduce) {
        .theme-toggle-btn,
        .theme-menu,
        .theme-option {
          transition: none !important;
        }
        
        .theme-toggle-btn:hover {
          transform: none !important;
        }
        
        .theme-menu[aria-hidden="false"] {
          transform: none !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * 绑定主题切换器事件
   */
  bindThemeToggleEvents(themeToggle) {
    const toggleBtn = themeToggle.querySelector('.theme-toggle-btn');
    const themeMenu = themeToggle.querySelector('.theme-menu');
    const themeOptions = themeToggle.querySelectorAll('.theme-option');
    
    // 切换菜单显示
    toggleBtn.addEventListener('click', () => {
      const isOpen = themeMenu.getAttribute('aria-hidden') === 'false';
      this.toggleThemeMenu(!isOpen);
    });
    
    // 主题选项点击
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        this.setTheme(theme);
        this.toggleThemeMenu(false);
      });
    });
    
    // 键盘导航
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBtn.click();
      }
    });
    
    themeMenu.addEventListener('keydown', (e) => {
      this.handleMenuKeydown(e, themeOptions);
    });
    
    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      if (!themeToggle.contains(e.target)) {
        this.toggleThemeMenu(false);
      }
    });
    
    // ESC键关闭菜单
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && themeMenu.getAttribute('aria-hidden') === 'false') {
        this.toggleThemeMenu(false);
        toggleBtn.focus();
      }
    });
  }
  
  /**
   * 切换主题菜单显示状态
   */
  toggleThemeMenu(show) {
    const themeMenu = document.querySelector('.theme-menu');
    const toggleBtn = document.querySelector('.theme-toggle-btn');
    
    if (show) {
      themeMenu.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      // 聚焦第一个选项
      const firstOption = themeMenu.querySelector('.theme-option');
      if (firstOption) {
        firstOption.focus();
      }
    } else {
      themeMenu.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }
  
  /**
   * 处理菜单键盘导航
   */
  handleMenuKeydown(e, options) {
    const currentIndex = Array.from(options).indexOf(document.activeElement);
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (currentIndex + 1) % options.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = (currentIndex - 1 + options.length) % options.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = options.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        document.activeElement.click();
        return;
      default:
        return;
    }
    
    options[newIndex].focus();
  }
  
  /**
   * 设置媒体查询监听器
   */
  setupMediaQueryListeners() {
    // 监听系统主题变化
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addListener((e) => {
      if (this.currentTheme === 'default') {
        this.applyTheme(e.matches ? 'dark' : 'default');
      }
    });
    
    // 监听高对比度变化
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    highContrastQuery.addListener((e) => {
      if (e.matches && this.currentTheme === 'default') {
        this.applyTheme('high-contrast');
      }
    });
    
    // 监听减少动画偏好变化
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addListener((e) => {
      document.documentElement.classList.toggle('reduce-motion', e.matches);
    });
  }
  
  /**
   * 设置主题
   */
  setTheme(theme) {
    if (!this.themes[theme]) return;
    
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveTheme(theme);
    this.updateThemeToggle();
    this.announceThemeChange(theme);
  }
  
  /**
   * 应用主题
   */
  applyTheme(theme) {
    // 移除所有主题类
    Object.keys(this.themes).forEach(themeKey => {
      document.documentElement.classList.remove(`theme-${themeKey}`);
    });
    
    // 应用新主题类
    if (theme !== 'default') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
    
    // 更新meta标签
    this.updateMetaThemeColor(theme);
    
    // 触发主题变化事件
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme, themeName: this.themes[theme] }
    }));
  }
  
  /**
   * 保存主题设置
   */
  saveTheme(theme) {
    // 使用CoreUtils存储，如果不可用则使用内联实现
    if (window.CoreUtils) {
      CoreUtils.storage.set('preferred-theme', theme);
    } else {
      try {
        localStorage.setItem('preferred-theme', theme);
      } catch (e) {
        console.warn('无法保存主题设置:', e);
      }
    }
  }
  
  /**
   * 更新主题切换器状态
   */
  updateThemeToggle() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const srText = document.querySelector('.theme-toggle-btn .sr-only');
    
    themeOptions.forEach(option => {
      const isActive = option.dataset.theme === this.currentTheme;
      option.classList.toggle('active', isActive);
      option.setAttribute('aria-pressed', isActive.toString());
      
      const checkmark = option.querySelector('.checkmark');
      if (isActive && !checkmark) {
        option.insertAdjacentHTML('beforeend', '<span class="checkmark">✓</span>');
      } else if (!isActive && checkmark) {
        checkmark.remove();
      }
    });
    
    if (srText) {
      srText.textContent = `当前主题: ${this.themes[this.currentTheme]}`;
    }
  }
  
  /**
   * 更新meta主题颜色
   */
  updateMetaThemeColor(theme) {
    let themeColor = '#FF7B8B'; // 默认主色
    
    switch (theme) {
      case 'high-contrast':
        themeColor = '#000000';
        break;
      case 'dark':
        themeColor = '#1a1a1a';
        break;
    }
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = themeColor;
  }
  
  /**
   * 宣布主题变化
   */
  announceThemeChange(theme) {
    if (window.accessibilityManager) {
      window.accessibilityManager.announce(
        `主题已切换为${this.themes[theme]}`,
        'polite'
      );
    }
  }
  
  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  /**
   * 获取可用主题列表
   */
  getAvailableThemes() {
    return { ...this.themes };
  }
  
  /**
   * 切换到下一个主题
   */
  nextTheme() {
    const themeKeys = Object.keys(this.themes);
    const currentIndex = themeKeys.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    this.setTheme(themeKeys[nextIndex]);
  }
  
  /**
   * 重置为默认主题
   */
  resetTheme() {
    this.setTheme('default');
  }
}

// 创建全局主题管理器实例
window.themeManager = new ThemeManager();

// 导出类
window.ThemeManager = ThemeManager;