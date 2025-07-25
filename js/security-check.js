/**
 * 运行时安全检查
 * 在应用启动时进行安全验证
 */
class SecurityCheck {
  
  constructor() {
    this.checks = [];
    this.init();
  }
  
  /**
   * 初始化安全检查
   */
  init() {
    this.registerChecks();
    this.runChecks();
  }
  
  /**
   * 注册安全检查项
   */
  registerChecks() {
    this.checks = [
      {
        name: 'HTTPS检查',
        check: () => this.checkHTTPS(),
        critical: true
      },
      {
        name: '环境变量检查',
        check: () => this.checkEnvironmentVars(),
        critical: false
      },
      {
        name: '本地存储安全检查',
        check: () => this.checkLocalStorage(),
        critical: false
      },
      {
        name: 'CSP检查',
        check: () => this.checkCSP(),
        critical: false
      },
      {
        name: '开发工具检查',
        check: () => this.checkDevTools(),
        critical: false
      }
    ];
  }
  
  /**
   * 运行所有安全检查
   */
  runChecks() {
    const results = [];
    
    for (const checkItem of this.checks) {
      try {
        const result = checkItem.check();
        results.push({
          name: checkItem.name,
          passed: result.passed,
          message: result.message,
          critical: checkItem.critical
        });
      } catch (error) {
        results.push({
          name: checkItem.name,
          passed: false,
          message: `检查失败: ${error.message}`,
          critical: checkItem.critical
        });
      }
    }
    
    this.handleResults(results);
  }
  
  /**
   * 检查HTTPS
   */
  checkHTTPS() {
    const isHTTPS = window.location.protocol === 'https:';
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    if (isHTTPS || isLocalhost) {
      return {
        passed: true,
        message: 'HTTPS连接正常'
      };
    } else {
      return {
        passed: false,
        message: '生产环境必须使用HTTPS'
      };
    }
  }
  
  /**
   * 检查环境变量配置
   */
  checkEnvironmentVars() {
    const config = window.config;
    if (!config) {
      return {
        passed: false,
        message: '配置管理器未初始化'
      };
    }
    
    const supabaseUrl = config.get('supabase.url');
    const supabaseKey = config.get('supabase.anonKey');
    
    if (config.isProduction() && (!supabaseUrl || !supabaseKey)) {
      return {
        passed: false,
        message: '生产环境缺少必要的环境变量配置'
      };
    }
    
    return {
      passed: true,
      message: '环境变量配置正常'
    };
  }
  
  /**
   * 检查本地存储安全性
   */
  checkLocalStorage() {
    try {
      // 检查是否有敏感信息存储在localStorage中
      const sensitiveKeys = ['password', 'secret', 'key', 'token'];
      const storageKeys = Object.keys(localStorage);
      
      for (const key of storageKeys) {
        const value = localStorage.getItem(key);
        if (value) {
          for (const sensitiveKey of sensitiveKeys) {
            if (key.toLowerCase().includes(sensitiveKey) || 
                value.toLowerCase().includes(sensitiveKey)) {
              return {
                passed: false,
                message: `本地存储中可能包含敏感信息: ${key}`
              };
            }
          }
        }
      }
      
      return {
        passed: true,
        message: '本地存储安全检查通过'
      };
    } catch (error) {
      return {
        passed: false,
        message: '无法访问本地存储'
      };
    }
  }
  
  /**
   * 检查内容安全策略
   */
  checkCSP() {
    const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (metaCSP) {
      return {
        passed: true,
        message: 'CSP策略已配置'
      };
    } else {
      return {
        passed: false,
        message: '建议配置内容安全策略(CSP)'
      };
    }
  }
  
  /**
   * 检查开发工具
   */
  checkDevTools() {
    const config = window.config;
    
    if (config && config.isProduction()) {
      // 在生产环境中检查是否有调试信息
      if (window.console && typeof window.console.log === 'function') {
        const originalLog = window.console.log;
        let debugCount = 0;
        
        window.console.log = function() {
          debugCount++;
          if (debugCount > 10) {
            console.warn('生产环境检测到大量调试输出');
          }
          return originalLog.apply(console, arguments);
        };
      }
      
      return {
        passed: true,
        message: '开发工具检查完成'
      };
    }
    
    return {
      passed: true,
      message: '开发环境跳过开发工具检查'
    };
  }
  
  /**
   * 处理检查结果
   */
  handleResults(results) {
    const criticalFailures = results.filter(r => !r.passed && r.critical);
    const warnings = results.filter(r => !r.passed && !r.critical);
    
    if (criticalFailures.length > 0) {
      console.error('🚨 发现严重安全问题:');
      criticalFailures.forEach(failure => {
        console.error(`- ${failure.name}: ${failure.message}`);
      });
      
      // 在生产环境中可能需要阻止应用启动
      if (window.config && window.config.isProduction()) {
        this.showSecurityWarning(criticalFailures);
      }
    }
    
    if (warnings.length > 0) {
      console.warn('⚠️ 安全建议:');
      warnings.forEach(warning => {
        console.warn(`- ${warning.name}: ${warning.message}`);
      });
    }
    
    if (criticalFailures.length === 0 && warnings.length === 0) {
      console.log('✅ 安全检查通过');
    }
  }
  
  /**
   * 显示安全警告
   */
  showSecurityWarning(failures) {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #dc3545;
      color: white;
      padding: 15px;
      text-align: center;
      z-index: 9999;
      font-family: Arial, sans-serif;
    `;
    
    warningDiv.innerHTML = `
      <strong>安全警告</strong><br>
      检测到安全问题，请联系管理员
    `;
    
    document.body.insertBefore(warningDiv, document.body.firstChild);
  }
}

// 在DOM加载完成后运行安全检查
document.addEventListener('DOMContentLoaded', () => {
  new SecurityCheck();
});

// 导出类
window.SecurityCheck = SecurityCheck;