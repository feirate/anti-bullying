/**
 * 性能监控和优化模块
 * 提供性能监控、优化建议和用户反馈收集功能
 */
class PerformanceMonitor {
  
  constructor() {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      interactionTime: 0,
      memoryUsage: 0,
      networkSpeed: 'unknown'
    };
    
    this.optimizations = [];
    this.feedbackData = [];
    
    this.init();
  }
  
  /**
   * 初始化性能监控
   */
  init() {
    this.measureLoadPerformance();
    this.setupPerformanceObserver();
    this.monitorNetworkConditions();
    this.setupMemoryMonitoring();
    this.createPerformancePanel();
    this.setupFeedbackSystem();
    
    // 定期收集性能数据
    setInterval(() => {
      this.collectPerformanceData();
    }, 30000); // 每30秒收集一次
  }
  
  /**
   * 测量页面加载性能
   */
  measureLoadPerformance() {
    // 使用Performance API测量加载时间
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
        this.metrics.renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        // 记录关键性能指标
        this.recordCoreWebVitals();
        
        // 分析性能并提供优化建议
        this.analyzePerformance();
      }
    });
  }
  
  /**
   * 记录核心Web指标
   */
  recordCoreWebVitals() {
    // First Contentful Paint (FCP)
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      this.metrics.fcp = fcpEntry.startTime;
    }
    
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }
    }
    
    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cls = clsValue;
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS monitoring not supported');
      }
    }
    
    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.fid = entry.processingStart - entry.startTime;
        }
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID monitoring not supported');
      }
    }
  }
  
  /**
   * 设置性能观察器
   */
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // 监控长任务
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            this.recordLongTask(entry);
          }
        }
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task monitoring not supported');
      }
      
      // 监控资源加载
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.analyzeResourcePerformance(entry);
        }
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (e) {
        console.warn('Resource monitoring not supported');
      }
    }
  }
  
  /**
   * 监控网络条件
   */
  monitorNetworkConditions() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      this.metrics.networkSpeed = connection.effectiveType;
      this.metrics.downlink = connection.downlink;
      this.metrics.rtt = connection.rtt;
      
      // 监听网络变化
      connection.addEventListener('change', () => {
        this.metrics.networkSpeed = connection.effectiveType;
        this.metrics.downlink = connection.downlink;
        this.metrics.rtt = connection.rtt;
        
        this.adaptToNetworkConditions();
      });
    }
  }
  
  /**
   * 设置内存监控
   */
  setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.metrics.memoryUsage = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        };
        
        // 检查内存使用是否过高
        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
          this.suggestMemoryOptimization();
        }
      }, 10000); // 每10秒检查一次
    }
  }
  
  /**
   * 创建性能面板
   */
  createPerformancePanel() {
    // 只在开发模式或调试模式下显示
    if (localStorage.getItem('debug-mode') === 'true') {
      const panel = document.createElement('div');
      panel.id = 'performance-panel';
      panel.innerHTML = `
        <div class="performance-panel-header">
          <h4>性能监控</h4>
          <button class="performance-panel-toggle" aria-label="切换性能面板">−</button>
        </div>
        <div class="performance-panel-content">
          <div class="metric">
            <span class="metric-label">加载时间:</span>
            <span class="metric-value" id="load-time">--</span>
          </div>
          <div class="metric">
            <span class="metric-label">渲染时间:</span>
            <span class="metric-value" id="render-time">--</span>
          </div>
          <div class="metric">
            <span class="metric-label">网络速度:</span>
            <span class="metric-value" id="network-speed">--</span>
          </div>
          <div class="metric">
            <span class="metric-label">内存使用:</span>
            <span class="metric-value" id="memory-usage">--</span>
          </div>
          <div class="optimizations" id="optimizations"></div>
        </div>
      `;
      
      this.addPerformancePanelStyles();
      document.body.appendChild(panel);
      this.bindPerformancePanelEvents();
      this.updatePerformancePanel();
    }
  }
  
  /**
   * 添加性能面板样式
   */
  addPerformancePanelStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #performance-panel {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 280px;
        background: var(--bg-white);
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-large);
        z-index: 1000;
        font-size: 12px;
      }
      
      .performance-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: var(--bg-light);
        border-bottom: 1px solid var(--border-color);
      }
      
      .performance-panel-header h4 {
        margin: 0;
        font-size: 14px;
        color: var(--text-dark);
      }
      
      .performance-panel-toggle {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .performance-panel-content {
        padding: 12px;
        max-height: 300px;
        overflow-y: auto;
      }
      
      .performance-panel-content.collapsed {
        display: none;
      }
      
      .metric {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        padding: 4px 0;
        border-bottom: 1px solid var(--bg-light);
      }
      
      .metric-label {
        color: var(--text-medium);
        font-weight: 500;
      }
      
      .metric-value {
        color: var(--text-dark);
        font-weight: 600;
      }
      
      .optimizations {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--border-color);
      }
      
      .optimization-item {
        background: rgba(255, 159, 28, 0.1);
        border-left: 3px solid var(--warning-color);
        padding: 8px;
        margin-bottom: 8px;
        border-radius: 4px;
        font-size: 11px;
        line-height: 1.4;
      }
      
      @media (max-width: 479px) {
        #performance-panel {
          bottom: 80px;
          left: 10px;
          right: 10px;
          width: auto;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * 绑定性能面板事件
   */
  bindPerformancePanelEvents() {
    const toggle = document.querySelector('.performance-panel-toggle');
    const content = document.querySelector('.performance-panel-content');
    
    toggle.addEventListener('click', () => {
      const isCollapsed = content.classList.contains('collapsed');
      content.classList.toggle('collapsed');
      toggle.textContent = isCollapsed ? '−' : '+';
      toggle.setAttribute('aria-label', isCollapsed ? '折叠性能面板' : '展开性能面板');
    });
  }
  
  /**
   * 更新性能面板
   */
  updatePerformancePanel() {
    const loadTimeEl = document.getElementById('load-time');
    const renderTimeEl = document.getElementById('render-time');
    const networkSpeedEl = document.getElementById('network-speed');
    const memoryUsageEl = document.getElementById('memory-usage');
    const optimizationsEl = document.getElementById('optimizations');
    
    if (loadTimeEl) {
      loadTimeEl.textContent = `${Math.round(this.metrics.loadTime)}ms`;
    }
    
    if (renderTimeEl) {
      renderTimeEl.textContent = `${Math.round(this.metrics.renderTime)}ms`;
    }
    
    if (networkSpeedEl) {
      networkSpeedEl.textContent = this.metrics.networkSpeed;
    }
    
    if (memoryUsageEl && this.metrics.memoryUsage) {
      const usedMB = Math.round(this.metrics.memoryUsage.used / 1024 / 1024);
      memoryUsageEl.textContent = `${usedMB}MB`;
    }
    
    if (optimizationsEl) {
      optimizationsEl.innerHTML = this.optimizations.map(opt => 
        `<div class="optimization-item">${opt}</div>`
      ).join('');
    }
  }
  
  /**
   * 设置反馈系统
   */
  setupFeedbackSystem() {
    // 创建反馈收集器
    this.createFeedbackCollector();
    
    // 监听用户交互以收集反馈数据
    this.monitorUserInteractions();
    
    // 定期发送反馈数据
    setInterval(() => {
      this.sendFeedbackData();
    }, 300000); // 每5分钟发送一次
  }
  
  /**
   * 创建反馈收集器
   */
  createFeedbackCollector() {
    // 创建隐藏的反馈表单
    const feedbackForm = document.createElement('div');
    feedbackForm.id = 'feedback-collector';
    feedbackForm.innerHTML = `
      <div class="feedback-overlay" style="display: none;">
        <div class="feedback-modal">
          <h3>遇到问题了吗？</h3>
          <p>请告诉我们您遇到的问题，帮助我们改进体验。</p>
          <form id="feedback-form">
            <div class="form-group">
              <label for="feedback-type">问题类型:</label>
              <select id="feedback-type" required>
                <option value="">请选择</option>
                <option value="performance">性能问题</option>
                <option value="accessibility">无障碍问题</option>
                <option value="responsive">响应式问题</option>
                <option value="functionality">功能问题</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="form-group">
              <label for="feedback-description">问题描述:</label>
              <textarea id="feedback-description" rows="4" required></textarea>
            </div>
            <div class="form-group">
              <label for="feedback-device">设备信息:</label>
              <input type="text" id="feedback-device" readonly>
            </div>
            <div class="form-actions">
              <button type="button" id="feedback-cancel">取消</button>
              <button type="submit">提交反馈</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(feedbackForm);
    this.bindFeedbackEvents();
    this.populateDeviceInfo();
  }
  
  /**
   * 绑定反馈事件
   */
  bindFeedbackEvents() {
    const form = document.getElementById('feedback-form');
    const overlay = document.querySelector('.feedback-overlay');
    const cancelBtn = document.getElementById('feedback-cancel');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitFeedback();
    });
    
    cancelBtn.addEventListener('click', () => {
      this.hideFeedbackForm();
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.hideFeedbackForm();
      }
    });
    
    // 键盘快捷键显示反馈表单
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        this.showFeedbackForm();
      }
    });
  }
  
  /**
   * 填充设备信息
   */
  populateDeviceInfo() {
    const deviceInfo = document.getElementById('feedback-device');
    if (deviceInfo) {
      const info = [
        `浏览器: ${navigator.userAgent}`,
        `屏幕: ${screen.width}x${screen.height}`,
        `视口: ${window.innerWidth}x${window.innerHeight}`,
        `设备像素比: ${window.devicePixelRatio}`,
        `网络: ${this.metrics.networkSpeed}`,
        `内存: ${this.metrics.memoryUsage ? Math.round(this.metrics.memoryUsage.used / 1024 / 1024) + 'MB' : '未知'}`
      ].join('\n');
      
      deviceInfo.value = info;
    }
  }
  
  /**
   * 显示反馈表单
   */
  showFeedbackForm() {
    const overlay = document.querySelector('.feedback-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      document.getElementById('feedback-type').focus();
    }
  }
  
  /**
   * 隐藏反馈表单
   */
  hideFeedbackForm() {
    const overlay = document.querySelector('.feedback-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
  
  /**
   * 提交反馈
   */
  submitFeedback() {
    const type = document.getElementById('feedback-type').value;
    const description = document.getElementById('feedback-description').value;
    const deviceInfo = document.getElementById('feedback-device').value;
    
    const feedback = {
      type,
      description,
      deviceInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      metrics: this.metrics
    };
    
    // 保存到本地存储
    this.saveFeedbackLocally(feedback);
    
    // 显示成功消息
    if (window.UIComponents) {
      window.UIComponents.renderNotification('反馈已提交，感谢您的建议！', 'success');
    } else {
      alert('反馈已提交，感谢您的建议！');
    }
    
    this.hideFeedbackForm();
    
    // 重置表单
    document.getElementById('feedback-form').reset();
  }
  
  /**
   * 本地保存反馈
   */
  saveFeedbackLocally(feedback) {
    // 使用CoreUtils存储，如果不可用则使用内联实现
    if (window.CoreUtils) {
      const existingFeedback = CoreUtils.storage.get('user-feedback', []);
      existingFeedback.push(feedback);
      
      // 只保留最近50条反馈
      if (existingFeedback.length > 50) {
        existingFeedback.splice(0, existingFeedback.length - 50);
      }
      
      CoreUtils.storage.set('user-feedback', existingFeedback);
    } else {
      try {
        const existingFeedback = JSON.parse(localStorage.getItem('user-feedback') || '[]');
        existingFeedback.push(feedback);
        
        // 只保留最近50条反馈
        if (existingFeedback.length > 50) {
          existingFeedback.splice(0, existingFeedback.length - 50);
        }
        
        localStorage.setItem('user-feedback', JSON.stringify(existingFeedback));
      } catch (e) {
        console.warn('无法保存反馈到本地存储:', e);
      }
    }
  }
  
  /**
   * 监控用户交互
   */
  monitorUserInteractions() {
    let interactionCount = 0;
    let errorCount = 0;
    
    // 监控点击事件
    document.addEventListener('click', () => {
      interactionCount++;
    });
    
    // 监控JavaScript错误
    window.addEventListener('error', (e) => {
      errorCount++;
      this.recordError(e);
    });
    
    // 监控Promise拒绝
    window.addEventListener('unhandledrejection', (e) => {
      errorCount++;
      this.recordError(e);
    });
    
    // 定期记录交互数据
    setInterval(() => {
      this.feedbackData.push({
        timestamp: new Date().toISOString(),
        interactions: interactionCount,
        errors: errorCount,
        url: window.location.href
      });
      
      interactionCount = 0;
      errorCount = 0;
    }, 60000); // 每分钟记录一次
  }
  
  /**
   * 记录错误
   */
  recordError(error) {
    const errorData = {
      message: error.message || error.reason,
      filename: error.filename,
      lineno: error.lineno,
      colno: error.colno,
      stack: error.error ? error.error.stack : null,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // 保存错误到本地存储
    try {
      const existingErrors = JSON.parse(localStorage.getItem('js-errors') || '[]');
      existingErrors.push(errorData);
      
      // 只保留最近20个错误
      if (existingErrors.length > 20) {
        existingErrors.splice(0, existingErrors.length - 20);
      }
      
      localStorage.setItem('js-errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.warn('无法保存错误信息:', e);
    }
  }
  
  /**
   * 收集性能数据
   */
  collectPerformanceData() {
    // 更新性能面板
    if (document.getElementById('performance-panel')) {
      this.updatePerformancePanel();
    }
    
    // 记录当前性能状态
    const performanceData = {
      timestamp: new Date().toISOString(),
      metrics: { ...this.metrics },
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    
    // 保存到本地存储
    try {
      const existingData = JSON.parse(localStorage.getItem('performance-data') || '[]');
      existingData.push(performanceData);
      
      // 只保留最近100条记录
      if (existingData.length > 100) {
        existingData.splice(0, existingData.length - 100);
      }
      
      localStorage.setItem('performance-data', JSON.stringify(existingData));
    } catch (e) {
      console.warn('无法保存性能数据:', e);
    }
  }
  
  /**
   * 分析性能并提供优化建议
   */
  analyzePerformance() {
    this.optimizations = [];
    
    // 检查加载时间
    if (this.metrics.loadTime > 3000) {
      this.optimizations.push('页面加载时间较长，建议优化资源加载');
    }
    
    // 检查LCP
    if (this.metrics.lcp > 2500) {
      this.optimizations.push('最大内容绘制时间过长，建议优化关键资源');
    }
    
    // 检查CLS
    if (this.metrics.cls > 0.1) {
      this.optimizations.push('布局偏移较大，建议为图片和广告预留空间');
    }
    
    // 检查FID
    if (this.metrics.fid > 100) {
      this.optimizations.push('首次输入延迟较长，建议优化JavaScript执行');
    }
    
    // 检查网络条件
    if (this.metrics.networkSpeed === 'slow-2g' || this.metrics.networkSpeed === '2g') {
      this.optimizations.push('网络连接较慢，已启用低质量图片模式');
    }
    
    // 检查内存使用
    if (this.metrics.memoryUsage && this.metrics.memoryUsage.used / this.metrics.memoryUsage.limit > 0.7) {
      this.optimizations.push('内存使用较高，建议刷新页面');
    }
  }
  
  /**
   * 记录长任务
   */
  recordLongTask(entry) {
    console.warn('Long task detected:', entry.duration + 'ms');
    this.optimizations.push(`检测到长任务: ${Math.round(entry.duration)}ms`);
  }
  
  /**
   * 分析资源性能
   */
  analyzeResourcePerformance(entry) {
    // 检查慢资源
    if (entry.duration > 1000) {
      console.warn('Slow resource:', entry.name, entry.duration + 'ms');
    }
    
    // 检查大资源
    if (entry.transferSize > 1024 * 1024) { // 1MB
      console.warn('Large resource:', entry.name, Math.round(entry.transferSize / 1024) + 'KB');
    }
  }
  
  /**
   * 适应网络条件
   */
  adaptToNetworkConditions() {
    if (window.responsiveMedia) {
      window.responsiveMedia.adjustQualityForConnection();
    }
    
    // 根据网络条件调整功能
    if (this.metrics.networkSpeed === 'slow-2g' || this.metrics.networkSpeed === '2g') {
      // 禁用非关键动画
      document.documentElement.classList.add('reduce-motion');
      
      // 延迟加载非关键资源
      this.deferNonCriticalResources();
    }
  }
  
  /**
   * 延迟加载非关键资源
   */
  deferNonCriticalResources() {
    // 延迟加载图片
    const images = document.querySelectorAll('img:not([data-critical])');
    images.forEach(img => {
      if (!img.dataset.src) {
        img.dataset.src = img.src;
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=';
      }
    });
  }
  
  /**
   * 建议内存优化
   */
  suggestMemoryOptimization() {
    this.optimizations.push('内存使用过高，建议刷新页面或关闭其他标签页');
    
    if (window.UIComponents) {
      window.UIComponents.renderNotification(
        '内存使用较高，建议刷新页面以获得更好的性能',
        'warning',
        5000
      );
    }
  }
  
  /**
   * 发送反馈数据
   */
  sendFeedbackData() {
    // 在实际应用中，这里会发送数据到服务器
    // 目前只是清理本地数据
    try {
      const feedbackData = localStorage.getItem('user-feedback');
      const performanceData = localStorage.getItem('performance-data');
      const errorData = localStorage.getItem('js-errors');
      
      if (feedbackData || performanceData || errorData) {
        console.log('Performance data collected:', {
          feedback: feedbackData ? JSON.parse(feedbackData).length : 0,
          performance: performanceData ? JSON.parse(performanceData).length : 0,
          errors: errorData ? JSON.parse(errorData).length : 0
        });
      }
    } catch (e) {
      console.warn('Error processing feedback data:', e);
    }
  }
  
  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    return {
      metrics: this.metrics,
      optimizations: this.optimizations,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * 启用调试模式
   */
  enableDebugMode() {
    localStorage.setItem('debug-mode', 'true');
    location.reload();
  }
  
  /**
   * 禁用调试模式
   */
  disableDebugMode() {
    localStorage.removeItem('debug-mode');
    const panel = document.getElementById('performance-panel');
    if (panel) {
      panel.remove();
    }
  }
}

// 创建全局性能监控实例
window.performanceMonitor = new PerformanceMonitor();

// 导出类
window.PerformanceMonitor = PerformanceMonitor;

// 添加全局快捷键
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+P 显示性能面板
  if (e.ctrlKey && e.shiftKey && e.key === 'P') {
    e.preventDefault();
    if (localStorage.getItem('debug-mode') === 'true') {
      window.performanceMonitor.disableDebugMode();
    } else {
      window.performanceMonitor.enableDebugMode();
    }
  }
  
  // Ctrl+Shift+F 显示反馈表单
  if (e.ctrlKey && e.shiftKey && e.key === 'F') {
    e.preventDefault();
    window.performanceMonitor.showFeedbackForm();
  }
});