/**
 * 设备管理器
 * 整合设备检测、响应式处理和兼容性修复
 */
class DeviceManager {
  constructor() {
    this.breakpoints = {
      small: 480,
      medium: 768,
      large: 1024
    };
    
    // 使用CoreUtils的设备检测，如果不可用则使用内联实现
    this.deviceInfo = window.CoreUtils ? CoreUtils.detectDevice() : this.detectDeviceInline();
    this.supportInfo = window.CoreUtils ? CoreUtils.checkSupport() : this.checkSupportInline();
    
    this.deviceConfig = {
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      deviceType: this.getDeviceType(),
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      touchCapable: this.supportInfo.touchEvents,
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false
      }
    };
    
    this.init();
  }
  
  init() {
    this.applyCompatibilityFixes();
    this.setupEventListeners();
    this.detectAccessibilitySettings();
    this.applyDeviceClasses();
    this.saveDeviceConfig();
  }
  
  getDeviceType() {
    const width = window.innerWidth;
    
    if (width < this.breakpoints.small) {
      return 'mobile-small';
    } else if (width < this.breakpoints.medium) {
      return 'mobile-large';
    } else if (width < this.breakpoints.large) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }
  
  setupEventListeners() {
    // 窗口大小变化
    const handleResize = CoreUtils.debounce(() => {
      this.updateDeviceConfig();
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // 设备方向变化
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.updateDeviceConfig();
      }, 300);
    });
    
    // 网络状态变化
    if (this.supportInfo.networkInformation && navigator.connection) {
      navigator.connection.addEventListener('change', () => {
        this.handleNetworkChange();
      });
    }
  }
  
  updateDeviceConfig() {
    this.deviceConfig.screenSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    const newDeviceType = this.getDeviceType();
    if (this.deviceConfig.deviceType !== newDeviceType) {
      this.deviceConfig.deviceType = newDeviceType;
      this.applyDeviceClasses();
    }
    
    const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    if (this.deviceConfig.orientation !== newOrientation) {
      this.deviceConfig.orientation = newOrientation;
      this.applyOrientationClasses();
    }
    
    this.saveDeviceConfig();
    
    // 触发设备配置变化事件
    window.dispatchEvent(new CustomEvent('deviceConfigChanged', {
      detail: this.deviceConfig
    }));
  }
  
  applyDeviceClasses() {
    // 移除所有设备类型类
    document.documentElement.classList.remove(
      'device-mobile-small',
      'device-mobile-large',
      'device-tablet',
      'device-desktop'
    );
    
    // 添加当前设备类型类
    document.documentElement.classList.add(`device-${this.deviceConfig.deviceType}`);
    
    // 添加浏览器和操作系统类
    document.documentElement.classList.add(`browser-${this.deviceInfo.browser.name}`);
    document.documentElement.classList.add(`os-${this.deviceInfo.device.os}`);
    
    // 添加触摸能力类
    if (this.deviceConfig.touchCapable) {
      document.documentElement.classList.add('touch-device');
    } else {
      document.documentElement.classList.remove('touch-device');
    }
    
    // 添加功能支持类
    Object.entries(this.supportInfo).forEach(([feature, supported]) => {
      document.documentElement.classList.toggle(`supports-${feature}`, supported);
      document.documentElement.classList.toggle(`no-${feature}`, !supported);
    });
  }
  
  applyOrientationClasses() {
    document.documentElement.classList.remove('orientation-portrait', 'orientation-landscape');
    document.documentElement.classList.add(`orientation-${this.deviceConfig.orientation}`);
  }
  
  detectAccessibilitySettings() {
    // 检测高对比度模式
    const highContrast = window.matchMedia('(forced-colors: active)').matches ||
                        window.matchMedia('(prefers-contrast: high)').matches;
    
    // 检测减少动画偏好
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 检测暗色模式偏好
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.deviceConfig.accessibility = {
      highContrast,
      reducedMotion,
      darkMode,
      screenReader: false // 无法可靠检测
    };
    
    // 应用无障碍类
    document.documentElement.classList.toggle('high-contrast', highContrast);
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
    document.documentElement.classList.toggle('prefers-dark', darkMode);
  }
  
  applyCompatibilityFixes() {
    const { browser, device } = this.deviceInfo;
    
    // Safari特定修复
    if (browser.name === 'safari') {
      this.applySafariFixes();
    }
    
    // iOS特定修复
    if (device.os === 'ios') {
      this.applyIOSFixes();
    }
    
    // Android特定修复
    if (device.os === 'android') {
      this.applyAndroidFixes();
    }
    
    // 移动设备通用修复
    if (device.type === 'mobile' || device.type === 'tablet') {
      this.applyMobileFixes();
    }
    
    // 设置Polyfills
    this.setupPolyfills();
  }
  
  applySafariFixes() {
    // 修复Safari的100vh问题
    const fixViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    fixViewportHeight();
    window.addEventListener('resize', fixViewportHeight);
    window.addEventListener('orientationchange', () => {
      setTimeout(fixViewportHeight, 300);
    });
    
    // 修复Safari的滚动问题
    document.body.style.webkitOverflowScrolling = 'touch';
  }
  
  applyIOSFixes() {
    // 修复iOS的滚动问题
    document.addEventListener('touchstart', () => {}, { passive: true });
    
    // 修复iOS的输入焦点问题
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        setTimeout(() => {
          if (document.activeElement === input) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      });
    });
  }
  
  applyAndroidFixes() {
    // 修复Android的键盘问题
    let initialViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      
      if (heightDifference > 150) {
        document.documentElement.classList.add('keyboard-open');
      } else {
        document.documentElement.classList.remove('keyboard-open');
      }
    });
  }
  
  applyMobileFixes() {
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
    
    // 优化触摸滚动
    document.addEventListener('touchmove', (e) => {
      if (e.target.closest('.scroll-container, .modal, .dialog')) {
        return;
      }
      
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  setupPolyfills() {
    // IntersectionObserver polyfill
    if (!this.supportInfo.intersectionObserver) {
      window.IntersectionObserver = class {
        constructor(callback, options = {}) {
          this.callback = callback;
          this.options = options;
          this.elements = new Set();
        }
        
        observe(element) {
          this.elements.add(element);
          setTimeout(() => {
            this.callback([{
              target: element,
              isIntersecting: true,
              intersectionRatio: 1
            }]);
          }, 100);
        }
        
        unobserve(element) {
          this.elements.delete(element);
        }
        
        disconnect() {
          this.elements.clear();
        }
      };
    }
    
    // ResizeObserver polyfill
    if (!this.supportInfo.resizeObserver) {
      window.ResizeObserver = class {
        constructor(callback) {
          this.callback = callback;
          this.elements = new Set();
          this.setupListener();
        }
        
        observe(element) {
          this.elements.add(element);
        }
        
        unobserve(element) {
          this.elements.delete(element);
        }
        
        disconnect() {
          this.elements.clear();
        }
        
        setupListener() {
          let timeout;
          window.addEventListener('resize', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              const entries = Array.from(this.elements).map(element => ({
                target: element,
                contentRect: element.getBoundingClientRect()
              }));
              this.callback(entries);
            }, 100);
          });
        }
      };
    }
  }
  
  handleNetworkChange() {
    if (navigator.connection) {
      const connection = navigator.connection;
      const effectiveType = connection.effectiveType;
      
      // 根据网络状况调整功能
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        document.documentElement.classList.add('slow-connection');
        this.enableDataSavingMode();
      } else {
        document.documentElement.classList.remove('slow-connection');
        this.disableDataSavingMode();
      }
    }
  }
  
  enableDataSavingMode() {
    // 启用数据节省模式
    document.documentElement.classList.add('data-saving');
    
    // 延迟加载非关键资源
    const images = document.querySelectorAll('img:not([data-critical])');
    images.forEach(img => {
      if (!img.dataset.src) {
        img.dataset.src = img.src;
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=';
      }
    });
  }
  
  disableDataSavingMode() {
    document.documentElement.classList.remove('data-saving');
  }
  
  /**
   * 内联设备检测（降级方案）
   */
  detectDeviceInline() {
    const ua = navigator.userAgent;
    
    const browser = {
      name: 'unknown',
      version: 0,
      engine: 'unknown'
    };
    
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
    }
    
    const device = {
      type: 'desktop',
      os: 'unknown',
      version: 0
    };
    
    if (ua.includes('iPhone') || ua.includes('iPad')) {
      device.os = 'ios';
      device.type = ua.includes('iPad') ? 'tablet' : 'mobile';
      device.version = parseInt(ua.match(/OS (\d+)/)?.[1] || '0');
    } else if (ua.includes('Android')) {
      device.os = 'android';
      device.type = ua.includes('Mobile') ? 'mobile' : 'tablet';
      device.version = parseFloat(ua.match(/Android (\d+\.?\d*)/)?.[1] || '0');
    }
    
    return { browser, device };
  }
  
  /**
   * 内联功能支持检测（降级方案）
   */
  checkSupportInline() {
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
      touchEvents: 'ontouchstart' in window,
      
      cssGrid: CSS.supports('display', 'grid'),
      cssFlexbox: CSS.supports('display', 'flex')
    };
  }
  
  saveDeviceConfig() {
    const configData = {
      deviceType: this.deviceConfig.deviceType,
      orientation: this.deviceConfig.orientation,
      touchCapable: this.deviceConfig.touchCapable,
      accessibility: this.deviceConfig.accessibility
    };
    
    // 使用CoreUtils存储，如果不可用则使用内联实现
    if (window.CoreUtils) {
      CoreUtils.storage.set('deviceConfig', configData);
    } else {
      try {
        localStorage.setItem('deviceConfig', JSON.stringify(configData));
      } catch (e) {
        console.warn('保存设备配置失败:', e);
      }
    }
  }
  
  getDeviceConfig() {
    return { ...this.deviceConfig };
  }
  
  getBrowserInfo() {
    return { ...this.deviceInfo.browser };
  }
  
  getSupportInfo() {
    return { ...this.supportInfo };
  }
}

// 创建全局设备管理器实例
window.deviceManager = new DeviceManager();

// 导出类
window.DeviceManager = DeviceManager;