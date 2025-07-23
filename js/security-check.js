/**
 * 安全配置检查工具
 * 用于验证环境配置的安全性
 */
class SecurityCheck {
  constructor() {
    this.warnings = [];
    this.errors = [];
  }

  /**
   * 执行安全检查
   */
  performSecurityCheck() {
    this.checkEnvironmentVariables();
    this.checkDevelopmentMode();
    this.checkHTTPS();
    this.checkExternalDependencies();
    this.reportResults();
  }

  /**
   * 检查环境变量配置
   */
  checkEnvironmentVariables() {
    const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    
    requiredVars.forEach(varName => {
      const value = this.getEnvVar(varName);
      
      if (!value) {
        this.warnings.push(`环境变量 ${varName} 未配置，将使用本地存储模式`);
      } else if (this.isPlaceholderValue(value)) {
        this.errors.push(`环境变量 ${varName} 仍使用占位符值，请配置真实值`);
      } else if (varName === 'SUPABASE_ANON_KEY' && this.isServiceKey(value)) {
        this.errors.push(`${varName} 疑似使用了服务密钥，前端应使用匿名密钥`);
      }
    });
  }

  /**
   * 检查是否为开发模式
   */
  checkDevelopmentMode() {
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.port !== '';
    
    if (isDev) {
      this.warnings.push('当前运行在开发模式，请确保生产环境配置正确');
    }
  }

  /**
   * 检查HTTPS配置
   */
  checkHTTPS() {
    if (window.location.protocol !== 'https:' && 
        window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
      this.errors.push('生产环境必须使用HTTPS协议');
    }
  }

  /**
   * 检查外部资源依赖
   */
  checkExternalDependencies() {
    // 检查是否使用了外部CDN
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.src;
      if (src.includes('esm.sh') || src.includes('unpkg.com') || src.includes('jsdelivr.net')) {
        this.warnings.push(`使用外部CDN依赖: ${src}，建议本地化处理`);
      }
    });
    
    // 检查动态导入的外部模块
    this.checkDynamicImports();
  }

  /**
   * 检查动态导入的外部模块
   */
  checkDynamicImports() {
    // 检查代码中的动态导入
    const codeElements = document.querySelectorAll('script:not([src])');
    codeElements.forEach(element => {
      const code = element.textContent;
      const importMatches = code.match(/import\s*\(['"](https?:\/\/[^'"]+)['"]\)/g);
      if (importMatches) {
        importMatches.forEach(match => {
          const url = match.match(/https?:\/\/[^'"]+/)[0];
          this.warnings.push(`动态导入外部模块: ${url}，建议本地化处理`);
        });
      }
    });
  }

  /**
   * 获取环境变量
   */
  getEnvVar(key) {
    // 从meta标签获取
    const metaTag = document.querySelector(`meta[name="${key}"]`);
    if (metaTag) {
      return metaTag.getAttribute('content');
    }
    
    // 从全局变量获取
    if (window.ENV && window.ENV[key]) {
      return window.ENV[key];
    }
    
    return null;
  }

  /**
   * 检查是否为占位符值
   */
  isPlaceholderValue(value) {
    const placeholders = [
      'your_',
      '_here',
      'your-project',
      'placeholder',
      'example',
      'test',
      'localhost',
      'via.placeholder.com'
    ];
    
    return placeholders.some(placeholder => 
      value.toLowerCase().includes(placeholder)
    );
  }

  /**
   * 检查是否为服务密钥（通常更长且包含特定前缀）
   */
  isServiceKey(key) {
    // Supabase服务密钥通常以特定前缀开头且较长
    return key.startsWith('eyJ') && key.length > 200;
  }

  /**
   * 报告检查结果
   */
  reportResults() {
    if (this.errors.length > 0) {
      console.error('🚨 安全配置错误：');
      this.errors.forEach(error => console.error(`  - ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.warn('⚠️ 安全配置警告：');
      this.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ 安全配置检查通过');
    }
    
    return {
      hasErrors: this.errors.length > 0,
      hasWarnings: this.warnings.length > 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }
}

// 自动执行安全检查
document.addEventListener('DOMContentLoaded', () => {
  const securityCheck = new SecurityCheck();
  securityCheck.performSecurityCheck();
});

// 导出供其他模块使用
window.SecurityCheck = SecurityCheck;