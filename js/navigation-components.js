/**
 * 导航组件系统
 * 提供响应式导航组件的创建和管理功能
 */
class NavigationComponents {
  
  constructor() {
    this.isMobileMenuOpen = false;
    this.isSidebarOpen = false;
    this.init();
  }
  
  /**
   * 初始化导航组件
   */
  init() {
    this.bindEvents();
    this.updateNavigationForDevice();
    
    // 监听设备配置变化
    window.addEventListener('deviceConfigChanged', () => {
      this.updateNavigationForDevice();
    });
  }
  
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // 汉堡菜单切换
    document.addEventListener('click', (e) => {
      if (e.target.closest('.nav-toggle')) {
        this.toggleMobileMenu();
      }
      
      if (e.target.closest('.sidebar-close')) {
        this.closeSidebar();
      }
      
      if (e.target.closest('.nav-overlay')) {
        this.closeSidebar();
        this.closeMobileMenu();
      }
    });
    
    // ESC键关闭菜单
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSidebar();
        this.closeMobileMenu();
      }
    });
    
    // 窗口大小变化时更新导航
    window.addEventListener('resize', () => {
      this.updateNavigationForDevice();
    });
  }
  
  /**
   * 根据设备类型更新导航
   */
  updateNavigationForDevice() {
    const deviceType = window.responsiveHandler?.getDeviceConfig().deviceType || 'desktop';
    
    // 在桌面端自动关闭移动菜单
    if (deviceType === 'desktop') {
      this.closeMobileMenu();
      this.closeSidebar();
    }
  }
  
  /**
   * 切换移动端菜单
   */
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    const mobileMenu = document.querySelector('.nav-menu-mobile');
    const hamburger = document.querySelector('.hamburger');
    
    if (mobileMenu) {
      if (this.isMobileMenuOpen) {
        mobileMenu.classList.add('show');
      } else {
        mobileMenu.classList.remove('show');
      }
    }
    
    if (hamburger) {
      if (this.isMobileMenuOpen) {
        hamburger.classList.add('open');
      } else {
        hamburger.classList.remove('open');
      }
    }
  }
  
  /**
   * 关闭移动端菜单
   */
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    
    const mobileMenu = document.querySelector('.nav-menu-mobile');
    const hamburger = document.querySelector('.hamburger');
    
    if (mobileMenu) {
      mobileMenu.classList.remove('show');
    }
    
    if (hamburger) {
      hamburger.classList.remove('open');
    }
  }
  
  /**
   * 打开侧边栏
   */
  openSidebar() {
    this.isSidebarOpen = true;
    
    const sidebar = document.querySelector('.sidebar-navigation');
    const overlay = document.querySelector('.nav-overlay');
    
    if (sidebar) {
      sidebar.classList.add('open');
    }
    
    if (overlay) {
      overlay.classList.add('show');
    }
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * 关闭侧边栏
   */
  closeSidebar() {
    this.isSidebarOpen = false;
    
    const sidebar = document.querySelector('.sidebar-navigation');
    const overlay = document.querySelector('.nav-overlay');
    
    if (sidebar) {
      sidebar.classList.remove('open');
    }
    
    if (overlay) {
      overlay.classList.remove('show');
    }
    
    // 恢复背景滚动
    document.body.style.overflow = '';
  }
  
  /**
   * 渲染主导航栏
   * @param {Object} config - 导航配置
   * @returns {string} HTML字符串
   */
  static renderMainNavigation(config) {
    const {
      brand = { text: '反霸凌小英雄', href: 'index.html', icon: null },
      menuItems = [],
      showMobileToggle = true
    } = config;
    
    // 品牌HTML
    const brandIcon = brand.icon ? `<div class="nav-brand-icon">${brand.icon}</div>` : '';
    const brandHtml = `
      <a href="${brand.href}" class="nav-brand">
        ${brandIcon}
        <span>${brand.text}</span>
      </a>
    `;
    
    // 菜单项HTML
    const menuItemsHtml = menuItems.map(item => {
      const icon = item.icon ? `<span class="nav-icon">${item.icon}</span>` : '';
      const activeClass = item.active ? 'active' : '';
      
      return `
        <li class="nav-item">
          <a href="${item.href}" class="nav-link ${activeClass}">
            ${icon}
            <span>${item.text}</span>
          </a>
        </li>
      `;
    }).join('');
    
    // 汉堡菜单按钮
    const toggleButton = showMobileToggle ? `
      <button class="nav-toggle" aria-label="切换菜单">
        <div class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    ` : '';
    
    // 移动端菜单
    const mobileMenu = `
      <div class="nav-menu-mobile">
        <ul class="nav-menu">
          ${menuItemsHtml}
        </ul>
      </div>
    `;
    
    return `
      <nav class="main-navigation">
        <div class="nav-container">
          ${brandHtml}
          <ul class="nav-menu">
            ${menuItemsHtml}
          </ul>
          ${toggleButton}
        </div>
        ${mobileMenu}
      </nav>
    `;
  }
  
  /**
   * 渲染底部导航栏
   * @param {Array} items - 导航项数组
   * @returns {string} HTML字符串
   */
  static renderBottomNavigation(items) {
    const itemsHtml = items.map(item => {
      const activeClass = item.active ? 'active' : '';
      
      return `
        <a href="${item.href}" class="bottom-nav-item ${activeClass}">
          <span class="bottom-nav-icon">${item.icon}</span>
          <span>${item.text}</span>
        </a>
      `;
    }).join('');
    
    return `
      <nav class="bottom-navigation">
        <div class="bottom-nav-container">
          ${itemsHtml}
        </div>
      </nav>
    `;
  }
  
  /**
   * 渲染面包屑导航
   * @param {Array} items - 面包屑项数组
   * @returns {string} HTML字符串
   */
  static renderBreadcrumb(items) {
    const itemsHtml = items.map((item, index) => {
      const isLast = index === items.length - 1;
      const separator = !isLast ? '<span class="breadcrumb-separator">›</span>' : '';
      
      if (isLast) {
        return `
          <div class="breadcrumb-item">
            <span class="breadcrumb-current">${item.text}</span>
          </div>
        `;
      } else {
        return `
          <div class="breadcrumb-item">
            <a href="${item.href}" class="breadcrumb-link">${item.text}</a>
            ${separator}
          </div>
        `;
      }
    }).join('');
    
    return `
      <nav class="breadcrumb" aria-label="面包屑导航">
        ${itemsHtml}
      </nav>
    `;
  }
  
  /**
   * 渲染侧边栏导航
   * @param {Object} config - 侧边栏配置
   * @returns {string} HTML字符串
   */
  static renderSidebarNavigation(config) {
    const {
      brand = { text: '反霸凌小英雄', icon: null },
      menuItems = []
    } = config;
    
    // 品牌HTML
    const brandIcon = brand.icon ? brand.icon : '';
    const brandHtml = `
      <div class="sidebar-brand">
        ${brandIcon}
        <span>${brand.text}</span>
      </div>
    `;
    
    // 菜单项HTML
    const menuItemsHtml = menuItems.map(item => {
      const icon = item.icon ? `<span class="nav-icon">${item.icon}</span>` : '';
      const activeClass = item.active ? 'active' : '';
      
      return `
        <li class="nav-item">
          <a href="${item.href}" class="nav-link ${activeClass}">
            ${icon}
            <span>${item.text}</span>
          </a>
        </li>
      `;
    }).join('');
    
    return `
      <nav class="sidebar-navigation">
        <div class="sidebar-header">
          ${brandHtml}
          <button class="sidebar-close" aria-label="关闭侧边栏">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="sidebar-menu">
          <ul class="nav-menu">
            ${menuItemsHtml}
          </ul>
        </div>
      </nav>
      <div class="nav-overlay"></div>
    `;
  }
  
  /**
   * 渲染跳转链接（无障碍）
   * @param {string} targetId - 目标元素ID
   * @param {string} text - 链接文本
   * @returns {string} HTML字符串
   */
  static renderSkipLink(targetId, text = '跳转到主要内容') {
    return `<a href="#${targetId}" class="skip-link">${text}</a>`;
  }
  
  /**
   * 设置活动导航项
   * @param {string} href - 当前页面的href
   */
  static setActiveNavItem(href) {
    // 移除所有活动状态
    document.querySelectorAll('.nav-link.active').forEach(link => {
      link.classList.remove('active');
    });
    
    document.querySelectorAll('.bottom-nav-item.active').forEach(item => {
      item.classList.remove('active');
    });
    
    // 设置当前页面的活动状态
    document.querySelectorAll(`[href="${href}"]`).forEach(link => {
      if (link.classList.contains('nav-link') || link.classList.contains('bottom-nav-item')) {
        link.classList.add('active');
      }
    });
  }
  
  /**
   * 创建游戏专用导航配置
   * @returns {Object} 导航配置对象
   */
  static createGameNavigation() {
    return {
      brand: {
        text: '反霸凌小英雄',
        href: 'index.html',
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>`
      },
      menuItems: [
        {
          text: '首页',
          href: 'index.html',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            <path d="M9 22V12h6v10"/>
          </svg>`
        },
        {
          text: '场景挑战',
          href: '#scenarios',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
            <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
            <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
          </svg>`
        },
        {
          text: '我的进度',
          href: '#progress',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>`
        },
        {
          text: '反馈',
          href: 'feedback-form-demo.html',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>`
        }
      ]
    };
  }
  
  /**
   * 创建底部导航配置
   * @returns {Array} 底部导航项数组
   */
  static createBottomNavigation() {
    return [
      {
        text: '首页',
        href: 'index.html',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
          <path d="M9 22V12h6v10"/>
        </svg>`
      },
      {
        text: '挑战',
        href: '#scenarios',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12l2 2 4-4"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>`
      },
      {
        text: '进度',
        href: '#progress',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>`
      },
      {
        text: '反馈',
        href: 'feedback-form-demo.html',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>`
      }
    ];
  }
}

// 创建全局导航实例
window.navigationComponents = new NavigationComponents();

// 导出类
window.NavigationComponents = NavigationComponents;