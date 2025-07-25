/**
 * 键盘导航增强模块
 * 提供完整的键盘导航支持
 */
class KeyboardNavigation {
  
  constructor() {
    this.currentFocusIndex = -1;
    this.focusableElements = [];
    this.roving = false;
    this.init();
  }
  
  /**
   * 初始化键盘导航
   */
  init() {
    this.setupKeyboardHandlers();
    this.setupFocusManagement();
    this.setupRovingTabindex();
    this.setupCustomKeyboardShortcuts();
  }
  
  /**
   * 设置键盘事件处理器
   */
  setupKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });
    
    // 处理特定组件的键盘导航
    this.setupCardNavigation();
    this.setupMenuNavigation();
    this.setupFormNavigation();
    this.setupModalNavigation();
  }

  /**
   * 设置卡片导航
   */
  setupCardNavigation() {
    const cardContainers = document.querySelectorAll('.scenario-list, .card-grid');
    cardContainers.forEach(container => {
      const cards = container.querySelectorAll('.scenario-card, .game-card');
      cards.forEach(card => {
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.activateCard(card);
          }
        });
      });
    });
  }

  /**
   * 设置菜单导航
   */
  setupMenuNavigation() {
    const menus = document.querySelectorAll('.nav-menu, .bottom-navigation');
    menus.forEach(menu => {
      const menuItems = menu.querySelectorAll('a, button');
      menuItems.forEach(item => {
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (item.tagName === 'BUTTON') {
              e.preventDefault();
              item.click();
            }
          }
        });
      });
    });
  }

  /**
   * 设置表单导航
   */
  setupFormNavigation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') {
            e.preventDefault();
            this.focusNextFormElement(input);
          }
        });
      });
    });
  }

  /**
   * 设置模态框导航
   */
  setupModalNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay, .game-dialog-overlay');
        if (modal) {
          e.preventDefault();
          this.closeModal();
        }
      }
    });
  }
  
  /**
   * 处理键盘按下事件
   */
  handleKeyDown(e) {
    const { key, target, ctrlKey, altKey } = e;
    
    // 全局键盘快捷键
    if (ctrlKey || altKey) {
      this.handleShortcuts(e);
      return;
    }
    
    // 根据当前焦点元素的上下文处理导航
    const context = this.getNavigationContext(target);
    
    switch (context) {
      case 'card-grid':
        this.handleCardGridNavigation(e);
        break;
      case 'menu':
        this.handleMenuNavigation(e);
        break;
      case 'form':
        this.handleFormNavigation(e);
        break;
      case 'modal':
        this.handleModalNavigation(e);
        break;
      case 'scenario-list':
        this.handleScenarioListNavigation(e);
        break;
      default:
        this.handleGeneralNavigation(e);
    }
  }
  
  /**
   * 获取导航上下文
   */
  getNavigationContext(element) {
    if (element.closest('.scenario-list, .card-grid')) {
      return 'card-grid';
    }
    if (element.closest('.nav-menu, .bottom-navigation')) {
      return 'menu';
    }
    if (element.closest('form, .form-container')) {
      return 'form';
    }
    if (element.closest('.modal, .game-dialog')) {
      return 'modal';
    }
    if (element.closest('.scenarios-container')) {
      return 'scenario-list';
    }
    return 'general';
  }
  
  /**
   * 处理卡片网格导航
   */
  handleCardGridNavigation(e) {
    const { key, target } = e;
    const container = target.closest('.scenario-list, .card-grid');
    if (!container) return;
    
    const cards = Array.from(container.querySelectorAll('.scenario-card, .game-card'));
    const currentIndex = cards.indexOf(target.closest('.scenario-card, .game-card'));
    
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex;
    const columns = this.getGridColumns(container);
    
    switch (key) {
      case 'ArrowRight':
        newIndex = Math.min(currentIndex + 1, cards.length - 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        newIndex = Math.min(currentIndex + columns, cards.length - 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(currentIndex - columns, 0);
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = cards.length - 1;
        break;
      case 'Enter':
      case ' ':
        this.activateCard(cards[currentIndex]);
        break;
      default:
        return;
    }
    
    if (newIndex !== currentIndex) {
      e.preventDefault();
      this.focusCard(cards[newIndex]);
    }
  }
  
  /**
   * 处理菜单导航
   */
  handleMenuNavigation(e) {
    const { key, target } = e;
    const menu = target.closest('.nav-menu, .bottom-navigation');
    if (!menu) return;
    
    const menuItems = Array.from(menu.querySelectorAll('a, button'));
    const currentIndex = menuItems.indexOf(target);
    
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex;
    
    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = (currentIndex + 1) % menuItems.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = menuItems.length - 1;
        break;
      case 'Enter':
      case ' ':
        if (target.tagName === 'BUTTON') {
          target.click();
        }
        break;
      default:
        return;
    }
    
    if (newIndex !== currentIndex) {
      e.preventDefault();
      menuItems[newIndex].focus();
    }
  }
  
  /**
   * 处理表单导航
   */
  handleFormNavigation(e) {
    const { key, target } = e;
    
    // 处理单选框和复选框组
    if (target.type === 'radio' || target.type === 'checkbox') {
      this.handleRadioCheckboxNavigation(e);
      return;
    }
    
    // 处理选择框
    if (target.tagName === 'SELECT' && !target.multiple) {
      // 让浏览器处理默认的选择框导航
      return;
    }
    
    // 处理其他表单控件
    switch (key) {
      case 'Enter':
        if (target.tagName === 'BUTTON' || target.type === 'submit') {
          // 让浏览器处理默认行为
          return;
        }
        if (target.tagName === 'TEXTAREA') {
          // 在文本域中允许换行
          return;
        }
        // 在其他输入字段中，Enter键移动到下一个字段
        e.preventDefault();
        this.focusNextFormElement(target);
        break;
    }
  }
  
  /**
   * 处理单选框和复选框导航
   */
  handleRadioCheckboxNavigation(e) {
    const { key, target } = e;
    const group = target.closest('.form-radio-group, .form-checkbox-group');
    if (!group) return;
    
    const inputs = Array.from(group.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
    const currentIndex = inputs.indexOf(target);
    
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex;
    
    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % inputs.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + inputs.length) % inputs.length;
        break;
      case ' ':
        if (target.type === 'checkbox') {
          target.checked = !target.checked;
          target.dispatchEvent(new Event('change', { bubbles: true }));
        }
        break;
      default:
        return;
    }
    
    if (newIndex !== currentIndex) {
      e.preventDefault();
      inputs[newIndex].focus();
      if (target.type === 'radio') {
        inputs[newIndex].checked = true;
        inputs[newIndex].dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }
  
  /**
   * 处理模态框导航
   */
  handleModalNavigation(e) {
    const { key } = e;
    
    if (key === 'Escape') {
      e.preventDefault();
      this.closeModal();
    }
  }
  
  /**
   * 处理场景列表导航
   */
  handleScenarioListNavigation(e) {
    // 使用卡片网格导航逻辑
    this.handleCardGridNavigation(e);
  }
  
  /**
   * 处理一般导航
   */
  handleGeneralNavigation(e) {
    const { key, target } = e;
    
    switch (key) {
      case 'Tab':
        // 让浏览器处理默认的Tab导航
        break;
      case 'Enter':
        if (target.tagName === 'A' || target.tagName === 'BUTTON') {
          // 让浏览器处理默认行为
          return;
        }
        if (target.classList.contains('scenario-card') || target.classList.contains('game-card')) {
          e.preventDefault();
          this.activateCard(target);
        }
        break;
      case ' ':
        if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
          e.preventDefault();
          target.click();
        }
        break;
    }
  }
  
  /**
   * 处理键盘快捷键
   */
  handleShortcuts(e) {
    const { key, ctrlKey, altKey } = e;
    
    // Ctrl + 快捷键
    if (ctrlKey) {
      switch (key) {
        case 'h':
          e.preventDefault();
          this.goToHome();
          break;
        case 'f':
          e.preventDefault();
          this.focusSearch();
          break;
        case 'm':
          e.preventDefault();
          this.toggleMenu();
          break;
      }
    }
    
    // Alt + 快捷键
    if (altKey) {
      switch (key) {
        case '1':
          e.preventDefault();
          this.focusMainContent();
          break;
        case '2':
          e.preventDefault();
          this.focusNavigation();
          break;
        case 's':
          e.preventDefault();
          this.skipToContent();
          break;
      }
    }
  }
  
  /**
   * 设置焦点管理
   */
  setupFocusManagement() {
    // 确保所有交互元素都可以获得焦点
    this.makeFocusable();
    
    // 设置焦点指示器
    this.setupFocusIndicators();
    
    // 处理焦点丢失
    this.handleFocusLoss();
  }
  
  /**
   * 使元素可获得焦点
   */
  makeFocusable() {
    // 为卡片添加tabindex
    const cards = document.querySelectorAll('.scenario-card, .game-card');
    cards.forEach(card => {
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
    });
    
    // 为其他交互元素添加tabindex
    const interactiveElements = document.querySelectorAll('[onclick], .clickable');
    interactiveElements.forEach(element => {
      if (!element.hasAttribute('tabindex') && element.tagName !== 'BUTTON' && element.tagName !== 'A') {
        element.setAttribute('tabindex', '0');
      }
    });
  }
  
  /**
   * 设置焦点指示器
   */
  setupFocusIndicators() {
    // 焦点指示器已在CSS中定义
    // 这里可以添加动态焦点指示器的逻辑
  }
  
  /**
   * 处理焦点丢失
   */
  handleFocusLoss() {
    let lastFocusedElement = null;
    
    document.addEventListener('focusin', (e) => {
      lastFocusedElement = e.target;
    });
    
    document.addEventListener('focusout', (e) => {
      // 短暂延迟后检查是否有新的焦点
      setTimeout(() => {
        if (!document.activeElement || document.activeElement === document.body) {
          // 焦点丢失，恢复到最后的焦点元素
          if (lastFocusedElement && document.contains(lastFocusedElement)) {
            lastFocusedElement.focus();
          }
        }
      }, 10);
    });
  }
  
  /**
   * 设置漫游tabindex
   */
  setupRovingTabindex() {
    // 为卡片网格设置漫游tabindex
    const cardContainers = document.querySelectorAll('.scenario-list, .card-grid');
    cardContainers.forEach(container => {
      this.setupRovingTabindexForContainer(container);
    });
    
    // 为菜单设置漫游tabindex
    const menus = document.querySelectorAll('.nav-menu');
    menus.forEach(menu => {
      this.setupRovingTabindexForMenu(menu);
    });
  }
  
  /**
   * 为容器设置漫游tabindex
   */
  setupRovingTabindexForContainer(container) {
    const items = container.querySelectorAll('.scenario-card, .game-card');
    
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === 0 ? '0' : '-1');
      
      item.addEventListener('focus', () => {
        // 移除其他项目的tabindex
        items.forEach(otherItem => {
          otherItem.setAttribute('tabindex', '-1');
        });
        // 设置当前项目的tabindex
        item.setAttribute('tabindex', '0');
      });
    });
  }
  
  /**
   * 为菜单设置漫游tabindex
   */
  setupRovingTabindexForMenu(menu) {
    const items = menu.querySelectorAll('a, button');
    
    items.forEach((item, index) => {
      if (index > 0) {
        item.setAttribute('tabindex', '-1');
      }
      
      item.addEventListener('focus', () => {
        items.forEach(otherItem => {
          otherItem.setAttribute('tabindex', '-1');
        });
        item.setAttribute('tabindex', '0');
      });
    });
  }
  
  /**
   * 设置自定义键盘快捷键
   */
  setupCustomKeyboardShortcuts() {
    // 显示快捷键帮助
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F1' || (e.key === '?' && e.shiftKey)) {
        e.preventDefault();
        this.showKeyboardHelp();
      }
    });
  }
  
  /**
   * 获取网格列数
   */
  getGridColumns(container) {
    const computedStyle = window.getComputedStyle(container);
    const gridTemplateColumns = computedStyle.gridTemplateColumns;
    
    if (gridTemplateColumns && gridTemplateColumns !== 'none') {
      return gridTemplateColumns.split(' ').length;
    }
    
    // 回退：根据屏幕宽度估算
    const width = window.innerWidth;
    if (width < 480) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
  }
  
  /**
   * 激活卡片
   */
  activateCard(card) {
    const button = card.querySelector('button, .start-btn');
    if (button) {
      button.click();
    } else {
      // 如果没有按钮，触发点击事件
      card.click();
    }
  }
  
  /**
   * 聚焦卡片
   */
  focusCard(card) {
    card.focus();
    card.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }
  
  /**
   * 聚焦下一个表单元素
   */
  focusNextFormElement(currentElement) {
    const form = currentElement.closest('form');
    if (!form) return;
    
    const formElements = Array.from(form.querySelectorAll(
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
    ));
    
    const currentIndex = formElements.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % formElements.length;
    
    if (formElements[nextIndex]) {
      formElements[nextIndex].focus();
    }
  }
  
  /**
   * 关闭模态框
   */
  closeModal() {
    const modal = document.querySelector('.modal-overlay, .game-dialog-overlay');
    if (modal) {
      const closeButton = modal.querySelector('.modal-close, .dialog-close');
      if (closeButton) {
        closeButton.click();
      }
    }
  }
  
  /**
   * 跳转到首页
   */
  goToHome() {
    window.location.href = 'index.html';
  }
  
  /**
   * 聚焦搜索框
   */
  focusSearch() {
    const searchInput = document.querySelector('input[type="search"], .search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }
  
  /**
   * 切换菜单
   */
  toggleMenu() {
    const menuToggle = document.querySelector('.nav-toggle');
    if (menuToggle) {
      menuToggle.click();
    }
  }
  
  /**
   * 聚焦主要内容
   */
  focusMainContent() {
    const mainContent = document.querySelector('#main-content, main, [role="main"]');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  /**
   * 聚焦导航
   */
  focusNavigation() {
    const navigation = document.querySelector('nav, [role="navigation"]');
    if (navigation) {
      const firstLink = navigation.querySelector('a, button');
      if (firstLink) {
        firstLink.focus();
      }
    }
  }
  
  /**
   * 跳转到内容
   */
  skipToContent() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.click();
    }
  }
  
  /**
   * 显示键盘帮助
   */
  showKeyboardHelp() {
    const helpContent = `
      <h3>键盘快捷键帮助</h3>
      <div class="keyboard-help-content">
        <h4>全局快捷键</h4>
        <ul>
          <li><kbd>Ctrl + H</kbd> - 返回首页</li>
          <li><kbd>Ctrl + F</kbd> - 聚焦搜索框</li>
          <li><kbd>Ctrl + M</kbd> - 切换菜单</li>
          <li><kbd>Alt + 1</kbd> - 跳转到主要内容</li>
          <li><kbd>Alt + 2</kbd> - 跳转到导航</li>
          <li><kbd>Alt + S</kbd> - 跳转到内容</li>
          <li><kbd>F1</kbd> 或 <kbd>?</kbd> - 显示此帮助</li>
        </ul>
        
        <h4>导航快捷键</h4>
        <ul>
          <li><kbd>Tab</kbd> - 下一个元素</li>
          <li><kbd>Shift + Tab</kbd> - 上一个元素</li>
          <li><kbd>Enter</kbd> - 激活元素</li>
          <li><kbd>Space</kbd> - 激活按钮或复选框</li>
          <li><kbd>Escape</kbd> - 关闭对话框或菜单</li>
        </ul>
        
        <h4>卡片网格导航</h4>
        <ul>
          <li><kbd>↑↓←→</kbd> - 在卡片间移动</li>
          <li><kbd>Home</kbd> - 第一张卡片</li>
          <li><kbd>End</kbd> - 最后一张卡片</li>
          <li><kbd>Enter</kbd> 或 <kbd>Space</kbd> - 激活卡片</li>
        </ul>
        
        <h4>表单导航</h4>
        <ul>
          <li><kbd>Enter</kbd> - 移动到下一个字段</li>
          <li><kbd>↑↓</kbd> - 在单选框/复选框组中移动</li>
          <li><kbd>Space</kbd> - 切换复选框</li>
        </ul>
      </div>
    `;
    
    // 创建帮助对话框
    if (window.UIComponents) {
      const helpDialog = window.UIComponents.renderDialog(
        '键盘导航帮助',
        helpContent,
        [
          { text: '关闭', onClick: 'closeDialog()', type: 'primary' }
        ]
      );
      
      document.body.insertAdjacentHTML('beforeend', helpDialog);
    } else {
      alert('键盘快捷键：\nCtrl+H: 首页\nCtrl+F: 搜索\nCtrl+M: 菜单\nAlt+1: 主内容\nEsc: 关闭对话框');
    }
  }
}

// 创建全局键盘导航实例
window.keyboardNavigation = new KeyboardNavigation();

// 导出类
window.KeyboardNavigation = KeyboardNavigation;