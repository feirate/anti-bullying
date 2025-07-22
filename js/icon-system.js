/**
 * 图标系统
 * 提供SVG图标库，替代emoji
 */
class IconSystem {
  /**
   * 获取图标SVG
   * @param {string} iconName - 图标名称
   * @returns {string} 图标SVG代码
   */
  static getIconSvg(iconName) {
    // 图标映射表
    const iconMap = {
      // 情感图标
      'happy': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/></svg>',
      'sad': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 16s1.5-2 4-2 4 2 4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/></svg>',
      'neutral': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 14h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/></svg>',
      'surprised': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="14" r="2" fill="currentColor"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/></svg>',
      'angry': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 16s1.5-2 4-2 4 2 4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7.5 9l3-3M16.5 9l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      
      // 功能图标
      'close': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      'play': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
      'pause': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/></svg>',
      'stop': '<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="6" y="6" width="12" height="12" fill="currentColor"/></svg>',
      'settings': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      'volume': '<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      'mute': '<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      'info': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      'warning': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" fill="none"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      
      // 成就图标
      'achievement': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      'star': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      'trophy': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 0h1.5a2.5 2.5 0 0 1 0 5H18" stroke="currentColor" stroke-width="2" fill="none"/><path d="M6 9v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M6 4h12v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V4z" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      'medal': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="15" r="8" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 12V2M8 5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      
      // 技能图标
      'empathy': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      'courage': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" fill="currentColor"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" fill="currentColor"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" fill="currentColor"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" fill="currentColor"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" fill="currentColor"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" fill="currentColor"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" fill="currentColor"/></svg>',
      'wisdom': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      'shield': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      
      // 导航图标
      'home': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      'back': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
      'next': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
      'menu': '<svg viewBox="0 0 24 24" width="100%" height="100%"><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      
      // 社交图标
      'share': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2" fill="none"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" stroke-width="2"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" stroke-width="2"/></svg>',
      'chat': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      'help': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      
      // 场景类型图标
      'social': '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="8" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 12a4 4 0 110-8 4 4 0 010 8z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 12a4 4 0 110 8 4 4 0 010-8z" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      'verbal': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      'physical': '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M4 14h6v6M3 9l6-6 6 6M14 14h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
      'cyber': '<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      'property': '<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/><line x1="9" y1="21" x2="9" y2="9" stroke="currentColor" stroke-width="2"/></svg>'
    };
    
    // 如果图标不存在，返回空的占位符
    return iconMap[iconName] || '<svg viewBox="0 0 24 24" width="100%" height="100%"></svg>';
  }
  
  /**
   * 渲染图标
   * @param {string} iconName - 图标名称
   * @param {string} size - 图标尺寸 (small, medium, large)
   * @param {string} color - 图标颜色 (可选)
   * @returns {string} 图标HTML
   */
  static renderIcon(iconName, size = 'medium', color = null) {
    // 获取图标SVG
    const iconSvg = this.getIconSvg(iconName);
    
    // 尺寸类映射
    const sizeClass = `icon-${size}`;
    
    // 颜色样式
    const colorStyle = color ? `style="color: ${color};"` : '';
    
    return `<span class="game-icon ${sizeClass}" aria-label="${iconName}" ${colorStyle}>${iconSvg}</span>`;
  }
  
  /**
   * 获取所有可用图标名称
   * @returns {Array} 图标名称数组
   */
  static getAllIconNames() {
    return [
      // 情感图标
      'happy', 'sad', 'neutral', 'surprised', 'angry',
      
      // 功能图标
      'close', 'play', 'pause', 'stop', 'settings', 'volume', 'mute', 'info', 'warning',
      
      // 成就图标
      'achievement', 'star', 'trophy', 'medal',
      
      // 技能图标
      'empathy', 'courage', 'wisdom', 'shield',
      
      // 导航图标
      'home', 'back', 'next', 'menu',
      
      // 社交图标
      'share', 'chat', 'help',
      
      // 场景类型图标
      'social', 'verbal', 'physical', 'cyber', 'property'
    ];
  }
  
  /**
   * 获取图标分类
   * @returns {Object} 图标分类对象
   */
  static getIconCategories() {
    return {
      '情感图标': ['happy', 'sad', 'neutral', 'surprised', 'angry'],
      '功能图标': ['close', 'play', 'pause', 'stop', 'settings', 'volume', 'mute', 'info', 'warning'],
      '成就图标': ['achievement', 'star', 'trophy', 'medal'],
      '技能图标': ['empathy', 'courage', 'wisdom', 'shield'],
      '导航图标': ['home', 'back', 'next', 'menu'],
      '社交图标': ['share', 'chat', 'help'],
      '场景类型图标': ['social', 'verbal', 'physical', 'cyber', 'property']
    };
  }
  
  /**
   * 获取场景类型对应的图标
   * @param {string} category - 场景类型
   * @returns {string} 图标名称
   */
  static getCategoryIcon(category) {
    const categoryIconMap = {
      '社交排斥': 'social',
      '言语欺凌': 'verbal',
      '身体欺凌': 'physical',
      '网络欺凌': 'cyber',
      '财物欺凌': 'property'
    };
    
    return categoryIconMap[category] || 'info';
  }
  
  /**
   * 获取难度对应的图标
   * @param {string} difficulty - 难度级别
   * @returns {string} 图标名称
   */
  static getDifficultyIcon(difficulty) {
    const difficultyIconMap = {
      '简单': 'star',
      '中等': 'star',
      '困难': 'star'
    };
    
    return difficultyIconMap[difficulty] || 'star';
  }
}

// 导出图标系统
window.IconSystem = IconSystem;