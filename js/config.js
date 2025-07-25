/**
 * 配置管理器
 * 统一管理应用配置，支持环境变量
 */
class ConfigManager {
  constructor() {
    this.config = this.loadConfig();
  }
  
  /**
   * 加载配置
   */
  loadConfig() {
    return {
      // 应用基础配置
      app: {
        name: '反霸凌小英雄',
        version: '1.0.0',
        environment: this.getEnvironment()
      },
      
      // API配置（从环境变量读取）
      api: {
        baseUrl: this.getEnvVar('API_BASE_URL', '/api'),
        timeout: 10000
      },
      
      // Supabase配置（从环境变量读取）
      supabase: {
        url: this.getEnvVar('SUPABASE_URL', ''),
        anonKey: this.getEnvVar('SUPABASE_ANON_KEY', '')
      },
      
      // 功能开关
      features: {
        analytics: this.getEnvVar('ENABLE_ANALYTICS', 'false') === 'true',
        debugMode: this.getEnvVar('DEBUG_MODE', 'false') === 'true'
      },
      
      // 本地存储配置
      storage: {
        prefix: 'bgh_',
        userKey: 'user',
        settingsKey: 'settings'
      }
    };
  }
  
  /**
   * 获取环境变量
   */
  getEnvVar(key, defaultValue = '') {
    // 确保CoreUtils可用，否则使用内联实现
    if (window.CoreUtils) {
      return CoreUtils.getEnvVar(key, defaultValue);
    }
    
    // 降级实现
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || defaultValue;
    }
    
    const metaTag = document.querySelector(`meta[name="${key}"]`);
    if (metaTag) {
      const value = metaTag.getAttribute('content');
      if (value && !value.includes('your_') && !value.includes('_here')) {
        return value;
      }
    }
    
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
  getEnvironment() {
    if (window.CoreUtils) {
      return CoreUtils.getEnvironment();
    }
    
    // 降级实现
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
   * 获取配置值
   */
  get(path) {
    const keys = path.split('.');
    let value = this.config;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }
  
  /**
   * 检查是否为生产环境
   */
  isProduction() {
    return this.get('app.environment') === 'production';
  }
  
  /**
   * 检查是否为开发环境
   */
  isDevelopment() {
    return this.get('app.environment') === 'development';
  }
  
  /**
   * 验证必需的环境变量
   */
  validateRequiredEnvVars() {
    const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    const missing = [];
    
    for (const key of required) {
      if (!this.getEnvVar(key)) {
        missing.push(key);
      }
    }
    
    if (missing.length > 0 && this.isProduction()) {
      console.error('缺少必需的环境变量:', missing);
      return false;
    }
    
    return true;
  }
  
  /**
   * 获取安全的配置信息（用于调试）
   */
  getSafeConfig() {
    const safeConfig = JSON.parse(JSON.stringify(this.config));
    
    // 移除敏感信息
    if (safeConfig.supabase) {
      safeConfig.supabase.anonKey = safeConfig.supabase.anonKey ? '[HIDDEN]' : '';
    }
    
    return safeConfig;
  }
}

// 创建全局配置实例
window.config = new ConfigManager();

// 导出类
window.ConfigManager = ConfigManager;