/**
 * 核心工具库
 * 提供全局工具函数和基础功能
 */
class CoreUtils {
  /**
   * 生成UUID
   */
  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  /**
   * 安全的本地存储操作
   */
  static storage = {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('读取本地存储失败:', e);
        return defaultValue;
      }
    },
    
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn('保存到本地存储失败:', e);
        return false;
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn('删除本地存储失败:', e);
        return false;
      }
    },
    
    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        console.warn('清空本地存储失败:', e);
        return false;
      }
    }
  };
  
  /**
   * 防抖函数
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * 节流函数
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  /**
   * 深拷贝对象
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }
  
  /**
   * 获取环境变量
   */
  static getEnvVar(key, defaultValue = '') {
    // 浏览器环境中的环境变量获取
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || defaultValue;
    }
    
    // 从meta标签获取
    const metaTag = document.querySelector(`meta[name="${key}"]`);
    if (metaTag) {
      const value = metaTag.getAttribute('content');
      if (value && !value.includes('your_') && !value.includes('_here')) {
        return value;
      }
    }
    
    // 从全局变量获取
    if (window.ENV && window.ENV[key]) {
      const value = window.ENV[key];
      if (value && !value.includes('your_') && !value.includes('_here')) {
        return value;
      }
    }
    
    return defaultValue;
  }
  
  /**
   * 获取当前环境
   */
  static getEnvironment() {
    if (typeof process !== 'undefined' && process.env.NODE_ENV) {
      return process.env.NODE_ENV;
    }
    
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    } else if (hostname.includes('staging') || hostname.includes('test')) {
      return 'staging';
    } else {
      return 'production';
    }
  }
  
  /**
   * 检查功能支持
   */
  static checkSupport() {
    return {
      localStorage: (() => {
        try {
          const test = 'test';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch (e) {
          return false;
        }
      })(),
      
      intersectionObserver: 'IntersectionObserver' in window,
      resizeObserver: 'ResizeObserver' in window,
      mutationObserver: 'MutationObserver' in window,
      
      touchEvents: 'ontouchstart' in window,
      pointerEvents: 'onpointerdown' in window,
      
      cssGrid: CSS.supports('display', 'grid'),
      cssFlexbox: CSS.supports('display', 'flex'),
      cssCustomProperties: CSS.supports('--test', 'value'),
      
      webWorkers: 'Worker' in window,
      serviceWorker: 'serviceWorker' in navigator,
      
      networkInformation: 'connection' in navigator,
      onlineStatus: 'onLine' in navigator
    };
  }
  
  /**
   * 设备和浏览器检测
   */
  static detectDevice() {
    const ua = navigator.userAgent;
    
    const browser = {
      name: 'unknown',
      version: 0,
      engine: 'unknown'
    };
    
    // 检测浏览器
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      browser.name = 'chrome';
      browser.version = parseInt(ua.match(/Chrome\/(\d+)/)?.[1] || '0');
      browser.engine = 'blink';
    } else if (ua.includes('Firefox')) {
      browser.name = 'firefox';
      browser.version = parseInt(ua.match(/Firefox\/(\d+)/)?.[1] || '0');
      browser.engine = 'gecko';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browser.name = 'safari';
      browser.version = parseInt(ua.match(/Version\/(\d+)/)?.[1] || '0');
      browser.engine = 'webkit';
    } else if (ua.includes('Edg')) {
      browser.name = 'edge';
      browser.version = parseInt(ua.match(/Edg\/(\d+)/)?.[1] || '0');
      browser.engine = 'blink';
    }
    
    const device = {
      type: 'desktop',
      os: 'unknown',
      version: 0
    };
    
    // 检测操作系统
    if (ua.includes('iPhone') || ua.includes('iPad')) {
      device.os = 'ios';
      device.type = ua.includes('iPad') ? 'tablet' : 'mobile';
      device.version = parseInt(ua.match(/OS (\d+)/)?.[1] || '0');
    } else if (ua.includes('Android')) {
      device.os = 'android';
      device.type = ua.includes('Mobile') ? 'mobile' : 'tablet';
      device.version = parseFloat(ua.match(/Android (\d+\.?\d*)/)?.[1] || '0');
    } else if (ua.includes('Windows')) {
      device.os = 'windows';
      device.type = 'desktop';
    } else if (ua.includes('Mac')) {
      device.os = 'macos';
      device.type = 'desktop';
    } else if (ua.includes('Linux')) {
      device.os = 'linux';
      device.type = 'desktop';
    }
    
    return { browser, device };
  }
  
  /**
   * 复制文本到剪贴板
   */
  static async copyToClipboard(text) {
    // 尝试使用现代API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        console.warn('现代剪贴板API失败，使用降级方案');
      }
    }
    
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      // 使用现代剪贴板API替代废弃的execCommand
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        document.body.removeChild(textArea);
        return true;
      } else {
        // 最后的降级方案：提示用户手动复制
        document.body.removeChild(textArea);
        return false;
      }
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
  
  /**
   * 格式化日期
   */
  static formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }
  
  /**
   * 事件发射器
   */
  static createEventEmitter() {
    const events = {};
    
    return {
      on(event, callback) {
        if (!events[event]) {
          events[event] = [];
        }
        events[event].push(callback);
      },
      
      off(event, callback) {
        if (events[event]) {
          events[event] = events[event].filter(cb => cb !== callback);
        }
      },
      
      emit(event, ...args) {
        if (events[event]) {
          events[event].forEach(callback => callback(...args));
        }
      },
      
      once(event, callback) {
        const onceCallback = (...args) => {
          callback(...args);
          this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
      }
    };
  }
}

// 导出到全局
window.CoreUtils = CoreUtils;