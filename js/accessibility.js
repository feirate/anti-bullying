/**
 * 无障碍支持模块
 * 提供ARIA属性管理、键盘导航、焦点管理等功能
 */
class AccessibilityManager {
  
  constructor() {
    this.isKeyboardNavigation = false;
    this.focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');
    
    this.init();
  }
  
  /**
   * 初始化无障碍功能
   */
  init() {
    this.setupKeyboardDetection();
    this.setupFocusManagement();
    this.setupARIAAttributes();
    this.setupLiveRegions();
    this.setupSkipLinks();
    this.setupModalAccessibility();
    this.setupFormAccessibility();
    
    // 监听DOM变化以处理动态内容
    this.observeDOM();
  }
  
  /**
   * 设置键盘导航检测
   */
  setupKeyboardDetection() {
    // 检测键盘使用
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.isKeyboardNavigation = true;
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    // 检测鼠标使用
    document.addEventListener('mousedown', () => {
      this.isKeyboardNavigation = false;
      document.body.classList.remove('keyboard-navigation');
    });
    
    // 处理Escape键
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }
    });
  }
  
  /**
   * 设置焦点管理
   */
  setupFocusManagement() {
    // 焦点陷阱管理
    this.focusTraps = new Map();
    
    // 为所有交互元素添加焦点支持
    document.addEventListener('focusin', (e) => {
      this.handleFocusIn(e);
    });
    
    document.addEventListener('focusout', (e) => {
      this.handleFocusOut(e);
    });
  }
  
  /**
   * 设置ARIA属性
   */
  setupARIAAttributes() {
    // 为按钮添加ARIA属性
    this.enhanceButtons();
    
    // 为表单元素添加ARIA属性
    this.enhanceFormElements();
    
    // 为导航元素添加ARIA属性
    this.enhanceNavigation();
    
    // 为卡片和内容区域添加ARIA属性
    this.enhanceContentAreas();
    
    // 为进度条添加ARIA属性
    this.enhanceProgressBars();
  }
  
  /**
   * 增强按钮的无障碍性
   */
  enhanceButtons() {
    const buttons = document.querySelectorAll('button, .game-btn');
    buttons.forEach(button => {
      // 确保按钮有可访问的名称
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        console.warn('Button without accessible name found:', button);
      }
      
      // 为图标按钮添加标签
      if (button.querySelector('svg, .icon') && !button.getAttribute('aria-label')) {
        const iconType = this.getIconType(button);
        if (iconType) {
          button.setAttribute('aria-label', iconType);
        }
      }
      
      // 为禁用按钮添加ARIA属性
      if (button.disabled || button.classList.contains('disabled')) {
        button.setAttribute('aria-disabled', 'true');
      }
      
      // 为切换按钮添加ARIA状态
      if (button.classList.contains('toggle') || button.getAttribute('data-toggle')) {
        const isPressed = button.classList.contains('active') || button.getAttribute('data-active') === 'true';
        button.setAttribute('aria-pressed', isPressed.toString());
      }
    });
  }
  
  /**
   * 增强表单元素的无障碍性
   */
  enhanceFormElements() {
    // 为输入字段添加ARIA属性
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      const errorMessage = input.parentNode.querySelector('.form-error-message');
      const successMessage = input.parentNode.querySelector('.form-success-message');
      
      // 确保输入字段有标签
      if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        console.warn('Input without label found:', input);
      }
      
      // 关联错误消息
      if (errorMessage) {
        const errorId = `error-${input.id || Math.random().toString(36).substr(2, 9)}`;
        errorMessage.id = errorId;
        input.setAttribute('aria-describedby', errorId);
        input.setAttribute('aria-invalid', 'true');
      }
      
      // 关联成功消息
      if (successMessage) {
        const successId = `success-${input.id || Math.random().toString(36).substr(2, 9)}`;
        successMessage.id = successId;
        input.setAttribute('aria-describedby', successId);
        input.setAttribute('aria-invalid', 'false');
      }
      
      // 为必填字段添加ARIA属性
      if (input.required || input.getAttribute('aria-required')) {
        input.setAttribute('aria-required', 'true');
      }
    });
    
    // 为表单组添加fieldset和legend
    const formGroups = document.querySelectorAll('.form-checkbox-group, .form-radio-group');
    formGroups.forEach(group => {
      if (!group.closest('fieldset')) {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        const label = group.previousElementSibling;
        
        if (label && label.classList.contains('form-label')) {
          legend.textContent = label.textContent;
          legend.className = 'sr-only';
          fieldset.appendChild(legend);
          label.remove();
        }
        
        group.parentNode.insertBefore(fieldset, group);
        fieldset.appendChild(group);
      }
    });
  }
  
  /**
   * 增强导航的无障碍性
   */
  enhanceNavigation() {
    // 主导航
    const mainNav = document.querySelector('.main-navigation');
    if (mainNav) {
      mainNav.setAttribute('role', 'navigation');
      mainNav.setAttribute('aria-label', '主导航');
    }
    
    // 底部导航
    const bottomNav = document.querySelector('.bottom-navigation');
    if (bottomNav) {
      bottomNav.setAttribute('role', 'navigation');
      bottomNav.setAttribute('aria-label', '底部导航');
    }
    
    // 面包屑导航
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
      breadcrumb.setAttribute('role', 'navigation');
      breadcrumb.setAttribute('aria-label', '面包屑导航');
    }
    
    // 汉堡菜单按钮
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
      navToggle.setAttribute('aria-label', '切换导航菜单');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-controls', 'mobile-menu');
    }
    
    // 移动端菜单
    const mobileMenu = document.querySelector('.nav-menu-mobile');
    if (mobileMenu) {
      mobileMenu.id = 'mobile-menu';
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  }
  
  /**
   * 增强内容区域的无障碍性
   */
  enhanceContentAreas() {
    // 主要内容区域
    const main = document.querySelector('main') || document.querySelector('#app');
    if (main) {
      main.setAttribute('role', 'main');
      main.id = main.id || 'main-content';
    }
    
    // 场景卡片
    const scenarioCards = document.querySelectorAll('.scenario-card');
    scenarioCards.forEach((card, index) => {
      card.setAttribute('role', 'article');
      card.setAttribute('tabindex', '0');
      
      const title = card.querySelector('.scenario-title');
      if (title) {
        const titleId = `scenario-title-${index}`;
        title.id = titleId;
        card.setAttribute('aria-labelledby', titleId);
      }
      
      const description = card.querySelector('.scenario-description');
      if (description) {
        const descId = `scenario-desc-${index}`;
        description.id = descId;
        card.setAttribute('aria-describedby', descId);
      }
    });
    
    // 游戏卡片
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
      card.setAttribute('role', 'article');
      card.setAttribute('tabindex', '0');
      
      const title = card.querySelector('.card-title');
      if (title) {
        const titleId = `card-title-${index}`;
        title.id = titleId;
        card.setAttribute('aria-labelledby', titleId);
      }
    });
    
    // 通知
    const notifications = document.querySelectorAll('.game-notification');
    notifications.forEach(notification => {
      notification.setAttribute('role', 'alert');
      notification.setAttribute('aria-live', 'polite');
    });
  }
  
  /**
   * 增强进度条的无障碍性
   */
  enhanceProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(progressBar => {
      progressBar.setAttribute('role', 'progressbar');
      
      const progressFill = progressBar.querySelector('.progress-fill');
      const progressText = progressBar.parentNode.querySelector('.progress-text');
      
      if (progressFill && progressText) {
        // 从进度文本中提取数值
        const match = progressText.textContent.match(/(\d+)\/(\d+)/);
        if (match) {
          const current = parseInt(match[1]);
          const total = parseInt(match[2]);
          const percentage = Math.round((current / total) * 100);
          
          progressBar.setAttribute('aria-valuenow', current.toString());
          progressBar.setAttribute('aria-valuemin', '0');
          progressBar.setAttribute('aria-valuemax', total.toString());
          // progressBar.setAttribute('aria-valuetext', `${percentage}% 完成`);
        }
      }
    });
  }
  
  /**
   * 设置实时区域
   */
  setupLiveRegions() {
    // 创建全局实时区域用于状态更新
    if (!document.getElementById('live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'live-region';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }
    
    // 创建紧急实时区域
    if (!document.getElementById('live-region-assertive')) {
      const assertiveLiveRegion = document.createElement('div');
      assertiveLiveRegion.id = 'live-region-assertive';
      assertiveLiveRegion.className = 'sr-only';
      assertiveLiveRegion.setAttribute('aria-live', 'assertive');
      assertiveLiveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(assertiveLiveRegion);
    }
  }
  
  /**
   * 设置跳转链接
   */
  setupSkipLinks() {
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = '跳转到主要内容';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  }
  
  /**
   * 设置模态框无障碍性
   */
  setupModalAccessibility() {
    document.addEventListener('click', (e) => {
      // 检测模态框打开
      const modal = e.target.closest('.modal, .game-dialog');
      if (modal) {
        this.setupModalFocusTrap(modal);
      }
    });
  }
  
  /**
   * 设置表单无障碍性
   */
  setupFormAccessibility() {
    // 表单提交时的无障碍处理
    document.addEventListener('submit', (e) => {
      const form = e.target;
      this.announceFormSubmission(form);
    });
    
    // 表单验证错误的无障碍处理
    document.addEventListener('invalid', (e) => {
      const input = e.target;
      this.handleFormValidationError(input);
    }, true);
  }
  
  /**
   * 观察DOM变化
   */
  observeDOM() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processNewElement(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  /**
   * 处理新添加的元素
   */
  processNewElement(element) {
    // 为新添加的按钮设置ARIA属性
    const buttons = element.querySelectorAll ? element.querySelectorAll('button, .game-btn') : [];
    buttons.forEach(button => this.enhanceButton(button));
    
    // 为新添加的表单元素设置ARIA属性
    const inputs = element.querySelectorAll ? element.querySelectorAll('input, textarea, select') : [];
    inputs.forEach(input => this.enhanceFormElement(input));
    
    // 为新添加的通知设置ARIA属性
    if (element.classList && element.classList.contains('game-notification')) {
      element.setAttribute('role', 'alert');
      element.setAttribute('aria-live', 'polite');
    }
  }
  
  /**
   * 处理焦点进入
   */
  handleFocusIn(e) {
    const element = e.target;
    
    // 确保焦点元素可见
    this.ensureElementVisible(element);
    
    // 更新ARIA状态
    this.updateARIAStates(element);
  }
  
  /**
   * 处理焦点离开
   */
  handleFocusOut(e) {
    // 可以在这里添加焦点离开时的处理逻辑
  }
  
  /**
   * 处理Escape键
   */
  handleEscapeKey() {
    // 关闭模态框
    const openModal = document.querySelector('.modal-overlay:not([style*="display: none"]), .game-dialog-overlay:not([style*="display: none"])');
    if (openModal) {
      const closeButton = openModal.querySelector('.modal-close, .dialog-close');
      if (closeButton) {
        closeButton.click();
      }
    }
    
    // 关闭移动端菜单
    const mobileMenu = document.querySelector('.nav-menu-mobile.show');
    if (mobileMenu) {
      const toggleButton = document.querySelector('.nav-toggle');
      if (toggleButton) {
        toggleButton.click();
      }
    }
  }
  
  /**
   * 确保元素可见
   */
  ensureElementVisible(element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }
  
  /**
   * 更新ARIA状态
   */
  updateARIAStates(element) {
    // 更新展开/折叠状态
    if (element.getAttribute('aria-expanded') !== null) {
      // 这里可以添加展开状态的逻辑
    }
    
    // 更新选中状态
    if (element.getAttribute('aria-selected') !== null) {
      // 这里可以添加选中状态的逻辑
    }
  }
  
  /**
   * 获取图标类型
   */
  getIconType(button) {
    const iconMap = {
      'close': '关闭',
      'menu': '菜单',
      'search': '搜索',
      'home': '首页',
      'back': '返回',
      'next': '下一步',
      'prev': '上一步',
      'play': '播放',
      'pause': '暂停',
      'stop': '停止'
    };
    
    for (const [iconClass, label] of Object.entries(iconMap)) {
      if (button.classList.contains(iconClass) || button.querySelector(`.${iconClass}`)) {
        return label;
      }
    }
    
    return null;
  }
  
  /**
   * 设置模态框焦点陷阱
   */
  setupModalFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll(this.focusableElements);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    // 设置初始焦点
    if (firstFocusable) {
      firstFocusable.focus();
    }
    
    // 焦点陷阱
    const trapFocus = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };
    
    modal.addEventListener('keydown', trapFocus);
    this.focusTraps.set(modal, trapFocus);
  }
  
  /**
   * 移除模态框焦点陷阱
   */
  removeModalFocusTrap(modal) {
    const trapFocus = this.focusTraps.get(modal);
    if (trapFocus) {
      modal.removeEventListener('keydown', trapFocus);
      this.focusTraps.delete(modal);
    }
  }
  
  /**
   * 宣布表单提交
   */
  announceFormSubmission(form) {
    this.announce('表单正在提交，请稍候...');
  }
  
  /**
   * 处理表单验证错误
   */
  handleFormValidationError(input) {
    const errorMessage = input.validationMessage || '输入无效';
    this.announce(`${input.labels[0]?.textContent || '字段'}: ${errorMessage}`, 'assertive');
    
    // 滚动到错误字段
    input.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
  
  /**
   * 向屏幕阅读器宣布消息
   */
  announce(message, priority = 'polite') {
    const liveRegionId = priority === 'assertive' ? 'live-region-assertive' : 'live-region';
    const liveRegion = document.getElementById(liveRegionId);
    
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // 清除消息以便下次使用
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }
  
  /**
   * 增强单个按钮
   */
  enhanceButton(button) {
    // 实现单个按钮的增强逻辑
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      const iconType = this.getIconType(button);
      if (iconType) {
        button.setAttribute('aria-label', iconType);
      }
    }
  }
  
  /**
   * 增强单个表单元素
   */
  enhanceFormElement(input) {
    // 实现单个表单元素的增强逻辑
    if (input.required) {
      input.setAttribute('aria-required', 'true');
    }
  }
}

// 创建全局无障碍管理器实例
window.accessibilityManager = new AccessibilityManager();

// 导出类
window.AccessibilityManager = AccessibilityManager;