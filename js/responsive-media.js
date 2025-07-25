/**
 * 响应式媒体资源管理器
 * 负责根据设备特性优化图片和媒体资源的加载
 */
class ResponsiveMedia {
  
  constructor() {
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.connectionType = this.getConnectionType();
    this.imageCache = new Map();
    this.lazyLoadObserver = null;
    this.init();
  }
  
  /**
   * 初始化响应式媒体管理器
   */
  init() {
    this.setupLazyLoading();
    this.setupImageErrorHandling();
    this.preloadCriticalImages();
    
    // 监听网络状态变化
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.connectionType = this.getConnectionType();
        this.adjustQualityForConnection();
      });
    }
    
    // 监听设备配置变化
    window.addEventListener('deviceConfigChanged', () => {
      this.adjustQualityForConnection();
    });
  }
  
  /**
   * 获取网络连接类型
   * @returns {string} 连接类型
   */
  getConnectionType() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const effectiveType = connection.effectiveType;
      
      // 根据有效连接类型分类
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        return 'slow';
      } else if (effectiveType === '3g') {
        return 'medium';
      } else {
        return 'fast';
      }
    }
    
    // 默认假设为中等速度连接
    return 'medium';
  }
  
  /**
   * 根据设备和网络条件生成优化的图片URL
   * @param {string} originalUrl - 原始图片URL
   * @param {Object} options - 优化选项
   * @returns {string} 优化后的图片URL
   */
  getOptimizedImageUrl(originalUrl, options = {}) {
    if (!originalUrl) return null;
    
    const {
      width = null,
      height = null,
      quality = null,
      format = null,
      deviceType = null
    } = options;
    
    // 获取设备信息
    const deviceConfig = window.deviceManager?.getDeviceConfig() || {};
    const currentDeviceType = deviceType || deviceConfig.deviceType || 'desktop';
    
    // 根据设备类型设置默认参数
    const deviceSettings = this.getDeviceImageSettings(currentDeviceType);
    
    // 合并设置
    const finalWidth = width || deviceSettings.width;
    const finalHeight = height || deviceSettings.height;
    const finalQuality = quality || deviceSettings.quality;
    const finalFormat = format || deviceSettings.format;
    
    // 如果是本地图片，添加优化参数
    if (originalUrl.startsWith('data/pic/') || originalUrl.startsWith('/data/pic/')) {
      const params = new URLSearchParams();
      
      if (finalWidth) params.set('w', finalWidth);
      if (finalHeight) params.set('h', finalHeight);
      if (finalQuality) params.set('q', finalQuality);
      if (finalFormat) params.set('f', finalFormat);
      
      // 考虑设备像素比
      if (this.devicePixelRatio > 1 && finalWidth) {
        params.set('w', Math.round(finalWidth * Math.min(this.devicePixelRatio, 2)));
      }
      
      const separator = originalUrl.includes('?') ? '&' : '?';
      return `${originalUrl}${separator}${params.toString()}`;
    }
    
    // 对于外部图片，返回原始URL（可以在这里集成CDN服务）
    return originalUrl;
  }
  
  /**
   * 根据设备类型获取图片设置
   * @param {string} deviceType - 设备类型
   * @returns {Object} 图片设置
   */
  getDeviceImageSettings(deviceType) {
    const connectionQuality = this.getQualityForConnection();
    
    const settings = {
      'mobile-small': {
        width: 400,
        height: null,
        quality: connectionQuality.mobile,
        format: 'webp'
      },
      'mobile-large': {
        width: 600,
        height: null,
        quality: connectionQuality.mobile,
        format: 'webp'
      },
      'tablet': {
        width: 800,
        height: null,
        quality: connectionQuality.tablet,
        format: 'webp'
      },
      'desktop': {
        width: 1200,
        height: null,
        quality: connectionQuality.desktop,
        format: 'webp'
      }
    };
    
    return settings[deviceType] || settings.desktop;
  }
  
  /**
   * 根据网络连接获取质量设置
   * @returns {Object} 质量设置
   */
  getQualityForConnection() {
    const qualitySettings = {
      slow: { mobile: 60, tablet: 65, desktop: 70 },
      medium: { mobile: 75, tablet: 80, desktop: 85 },
      fast: { mobile: 85, tablet: 90, desktop: 95 }
    };
    
    return qualitySettings[this.connectionType] || qualitySettings.medium;
  }
  
  /**
   * 设置懒加载
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.lazyLoadObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      // 观察所有懒加载图片
      this.observeLazyImages();
    } else {
      // 降级：立即加载所有图片
      this.loadAllImages();
    }
  }
  
  /**
   * 观察懒加载图片
   */
  observeLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src], img[data-lazy]');
    lazyImages.forEach(img => {
      this.lazyLoadObserver.observe(img);
    });
  }
  
  /**
   * 加载图片
   * @param {HTMLImageElement} img - 图片元素
   */
  loadImage(img) {
    const src = img.dataset.src || img.dataset.lazy;
    if (!src) return;
    
    // 获取优化的图片URL
    const optimizedSrc = this.getOptimizedImageUrl(src, {
      width: img.dataset.width ? parseInt(img.dataset.width) : null,
      height: img.dataset.height ? parseInt(img.dataset.height) : null,
      quality: img.dataset.quality ? parseInt(img.dataset.quality) : null
    });
    
    // 预加载图片
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = optimizedSrc;
      img.classList.add('loaded');
      
      // 缓存图片
      this.imageCache.set(src, optimizedSrc);
    };
    
    tempImg.onerror = () => {
      this.handleImageError(img, src);
    };
    
    tempImg.src = optimizedSrc;
  }
  
  /**
   * 加载所有图片（降级方案）
   */
  loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src], img[data-lazy]');
    lazyImages.forEach(img => {
      this.loadImage(img);
    });
  }
  
  /**
   * 设置图片错误处理
   */
  setupImageErrorHandling() {
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        this.handleImageError(e.target);
      }
    }, true);
  }
  
  /**
   * 处理图片加载错误
   * @param {HTMLImageElement} img - 图片元素
   * @param {string} originalSrc - 原始图片URL
   */
  handleImageError(img, originalSrc = null) {
    const src = originalSrc || img.src;
    
    // 如果已经是占位符，不再处理
    if (img.classList.contains('error-placeholder')) {
      return;
    }
    
    // 尝试降级到更低质量
    if (src.includes('q=')) {
      const url = new URL(src, window.location.origin);
      const currentQuality = parseInt(url.searchParams.get('q')) || 80;
      
      if (currentQuality > 50) {
        url.searchParams.set('q', Math.max(50, currentQuality - 20));
        img.src = url.toString();
        return;
      }
    }
    
    // 使用占位符
    this.setImagePlaceholder(img);
  }
  
  /**
   * 设置图片占位符
   * @param {HTMLImageElement} img - 图片元素
   */
  setImagePlaceholder(img) {
    img.classList.add('error-placeholder');
    
    // 创建SVG占位符
    const placeholder = this.createImagePlaceholder(
      img.width || 400,
      img.height || 300,
      img.alt || '图片加载失败'
    );
    
    img.src = placeholder;
  }
  
  /**
   * 创建SVG占位符
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @param {string} text - 显示文本
   * @returns {string} Data URL
   */
  createImagePlaceholder(width, height, text) {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0" stroke="#ddd" stroke-width="2"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" 
              fill="#999" text-anchor="middle" dominant-baseline="middle">
          ${text}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }
  
  /**
   * 预加载关键图片
   */
  preloadCriticalImages() {
    // 预加载首屏关键图片
    const criticalImages = [
      'data/pic/hero-bg.jpg',
      'data/pic/logo.png'
    ];
    
    criticalImages.forEach(src => {
      if (this.imageCache.has(src)) return;
      
      const img = new Image();
      const optimizedSrc = this.getOptimizedImageUrl(src);
      
      img.onload = () => {
        this.imageCache.set(src, optimizedSrc);
      };
      
      img.src = optimizedSrc;
    });
  }
  
  /**
   * 根据网络状况调整图片质量
   */
  adjustQualityForConnection() {
    // 重新处理页面上的图片
    const images = document.querySelectorAll('img[src*="q="]');
    images.forEach(img => {
      const currentSrc = img.src;
      const url = new URL(currentSrc, window.location.origin);
      const qualitySettings = this.getQualityForConnection();
      
      // 优先使用设备管理器获取设备类型
      let deviceType = 'desktop';
      if (window.deviceManager) {
        deviceType = window.deviceManager.getDeviceConfig().deviceType;
      } else if (window.responsiveHandler) {
        deviceType = window.responsiveHandler.getDeviceConfig().deviceType;
      }
      
      let newQuality;
      if (deviceType.includes('mobile')) {
        newQuality = qualitySettings.mobile;
      } else if (deviceType === 'tablet') {
        newQuality = qualitySettings.tablet;
      } else {
        newQuality = qualitySettings.desktop;
      }
      
      url.searchParams.set('q', newQuality);
      
      if (url.toString() !== currentSrc) {
        img.src = url.toString();
      }
    });
  }
  
  /**
   * 创建响应式图片元素
   * @param {Object} config - 图片配置
   * @returns {string} HTML字符串
   */
  static createResponsiveImage(config) {
    const {
      src,
      alt = '',
      className = '',
      lazy = true,
      width = null,
      height = null,
      quality = null,
      sizes = null
    } = config;
    
    const lazyAttr = lazy ? 'data-src' : 'src';
    const lazyClass = lazy ? 'lazy-load' : '';
    const sizeAttrs = sizes ? `sizes="${sizes}"` : '';
    
    // 生成不同尺寸的srcset
    const srcset = ResponsiveMedia.generateSrcSet(src, { width, height, quality });
    
    return `
      <img 
        ${lazyAttr}="${src}"
        ${srcset ? `srcset="${srcset}"` : ''}
        ${sizeAttrs}
        alt="${alt}"
        class="${className} ${lazyClass}"
        ${width ? `width="${width}"` : ''}
        ${height ? `height="${height}"` : ''}
        loading="${lazy ? 'lazy' : 'eager'}"
      />
    `;
  }
  
  /**
   * 生成srcset属性
   * @param {string} src - 原始图片URL
   * @param {Object} options - 选项
   * @returns {string} srcset字符串
   */
  static generateSrcSet(src, options = {}) {
    if (!src || !src.startsWith('data/pic/')) {
      return '';
    }
    
    const { width, height, quality = 80 } = options;
    const baseWidth = width || 400;
    
    const sizes = [
      { w: Math.round(baseWidth * 0.5), descriptor: '0.5x' },
      { w: baseWidth, descriptor: '1x' },
      { w: Math.round(baseWidth * 1.5), descriptor: '1.5x' },
      { w: Math.round(baseWidth * 2), descriptor: '2x' }
    ];
    
    const srcsetItems = sizes.map(size => {
      const params = new URLSearchParams();
      params.set('w', size.w);
      if (height) params.set('h', Math.round(height * (size.w / baseWidth)));
      params.set('q', quality);
      
      const separator = src.includes('?') ? '&' : '?';
      return `${src}${separator}${params.toString()} ${size.descriptor}`;
    });
    
    return srcsetItems.join(', ');
  }
  
  /**
   * 刷新懒加载观察器
   */
  refreshLazyLoading() {
    if (this.lazyLoadObserver) {
      this.observeLazyImages();
    }
  }
  
  /**
   * 获取图片缓存统计
   * @returns {Object} 缓存统计信息
   */
  getCacheStats() {
    return {
      cacheSize: this.imageCache.size,
      connectionType: this.connectionType,
      devicePixelRatio: this.devicePixelRatio
    };
  }
}

// 创建全局实例
window.responsiveMedia = new ResponsiveMedia();

// 导出类
window.ResponsiveMedia = ResponsiveMedia;

// 页面加载完成后刷新懒加载
document.addEventListener('DOMContentLoaded', () => {
  if (window.responsiveMedia) {
    window.responsiveMedia.refreshLazyLoading();
  }
});

// 动态内容加载后刷新懒加载
document.addEventListener('contentLoaded', () => {
  if (window.responsiveMedia) {
    window.responsiveMedia.refreshLazyLoading();
  }
});