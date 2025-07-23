/**
 * UI组件库
 * 提供统一的UI组件，替代emoji和不一致的视觉元素
 */
class UIComponents {
  /**
   * 渲染图标
   * @param {string} iconName - 图标名称
   * @param {string} size - 图标尺寸 (small, medium, large)
   * @param {string} color - 图标颜色 (可选)
   * @returns {string} 图标HTML
   */
  static renderIcon(iconName, size = 'medium', color = null) {
    // 使用IconSystem获取图标
    if (window.IconSystem) {
      return IconSystem.renderIcon(iconName, size, color);
    }
    
    // 如果IconSystem不可用，使用简单的占位符
    const sizeClass = `icon-${size}`;
    const colorStyle = color ? `style="color: ${color};"` : '';
    
    return `<span class="game-icon ${sizeClass}" aria-label="${iconName}" ${colorStyle}>
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <rect x="2" y="2" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"/>
        <text x="12" y="16" font-size="12" text-anchor="middle" fill="currentColor">${iconName.charAt(0).toUpperCase()}</text>
      </svg>
    </span>`;
  }
  
  /**
   * 渲染按钮
   * @param {string} text - 按钮文本
   * @param {string} onClick - 点击事件处理函数名称
   * @param {string} type - 按钮类型 (primary, secondary, success, warning, danger, outline primary, ...)
   * @param {string} size - 按钮尺寸 (small, medium, large)
   * @param {string} icon - 可选的图标名称
   * @param {boolean} disabled - 是否禁用按钮
   * @param {string} ariaLabel - 可选的ARIA标签，用于辅助功能
   * @returns {string} 按钮HTML
   */
  static renderButton(text, onClick, type = 'primary', size = 'medium', icon = null, disabled = false, ariaLabel = null) {
    // 生成唯一ID
    const buttonId = `btn-${Math.random().toString(36).substring(2, 9)}`;
    
    // 处理按钮类型
    const typeClasses = type.split(' ').map(t => t.trim()).join(' ');
    
    // 图标HTML
    const iconHtml = icon ? this.renderIcon(icon, 'small') : '';
    
    // 禁用属性
    const disabledAttr = disabled ? 'disabled' : '';
    
    // ARIA标签
    const ariaLabelAttr = ariaLabel ? `aria-label="${ariaLabel}"` : '';
    
    return `
      <button 
        id="${buttonId}" 
        class="game-btn ${typeClasses} ${size}" 
        onclick="${onClick}" 
        ${disabledAttr}
        ${ariaLabelAttr}
      >
        ${iconHtml}
        <span class="btn-text">${text}</span>
      </button>
    `;
  }
  
  /**
   * 渲染年级选择按钮
   * @param {string} grade - 年级文本 (如 "一年级", "二年级")
   * @param {string} onClick - 点击事件处理函数名称
   * @param {boolean} isSelected - 是否被选中
   * @returns {string} 年级按钮HTML
   */
  static renderGradeButton(grade, onClick, isSelected = false) {
    const buttonType = isSelected ? 'primary' : 'outline secondary';
    return this.renderButton(grade, onClick, buttonType, 'medium');
  }
  
  /**
   * 渲染年级选择按钮组
   * @param {Array} grades - 年级数组 ["一年级", "二年级", ...]
   * @param {string} selectedGrade - 当前选中的年级
   * @param {string} onClickFunction - 点击处理函数名称 (会传入年级作为参数)
   * @returns {string} 年级按钮组HTML
   */
  static renderGradeButtonGroup(grades, selectedGrade = null, onClickFunction = 'selectGrade') {
    const buttonsHtml = grades.map(grade => {
      const isSelected = grade === selectedGrade;
      return this.renderGradeButton(grade, `${onClickFunction}('${grade}')`, isSelected);
    }).join('');
    
    return `
      <div class="grade-button-group">
        ${buttonsHtml}
      </div>
    `;
  }
  
  /**
   * 渲染按钮组
   * @param {Array} buttons - 按钮配置数组 [{text, onClick, type, size, icon, disabled}]
   * @param {string} alignment - 对齐方式 (left, center, right, space-between, space-around)
   * @returns {string} 按钮组HTML
   */
  static renderButtonGroup(buttons, alignment = 'center') {
    const buttonsHtml = buttons.map(btn => 
      this.renderButton(
        btn.text, 
        btn.onClick, 
        btn.type || 'primary', 
        btn.size || 'medium', 
        btn.icon, 
        btn.disabled || false,
        btn.ariaLabel
      )
    ).join('');
    
    return `
      <div class="button-group" style="justify-content: ${alignment}">
        ${buttonsHtml}
      </div>
    `;
  }
  
  /**
   * 渲染卡片
   * @param {string} title - 卡片标题
   * @param {string} content - 卡片内容
   * @param {string} imageUrl - 可选的图片URL
   * @param {string} footer - 可选的底部内容
   * @returns {string} 卡片HTML
   */
  static renderCard(title, content, imageUrl = null, footer = null) {
    // 图片HTML
    const imageHtml = imageUrl ? `
      <div class="card-image">
        <img src="${imageUrl}" alt="${title}" loading="lazy">
      </div>
    ` : '';
    
    // 底部HTML
    const footerHtml = footer ? `
      <div class="card-footer">
        ${footer}
      </div>
    ` : '';
    
    return `
      <div class="game-card">
        <div class="card-header">
          <h3 class="card-title">${title}</h3>
        </div>
        ${imageHtml}
        <div class="card-content">
          ${content}
        </div>
        ${footerHtml}
      </div>
    `;
  }
  
  /**
   * 渲染带边框颜色的卡片
   * @param {string} title - 卡片标题
   * @param {string} content - 卡片内容
   * @param {string} borderColor - 边框颜色 (primary, secondary, success, warning, danger)
   * @param {string} footer - 可选的底部内容
   * @returns {string} 卡片HTML
   */
  static renderBorderedCard(title, content, borderColor = 'primary', footer = null) {
    // 底部HTML
    const footerHtml = footer ? `
      <div class="card-footer">
        ${footer}
      </div>
    ` : '';
    
    return `
      <div class="game-card bordered-card ${borderColor}-border">
        <div class="card-header">
          <h3 class="card-title">${title}</h3>
        </div>
        <div class="card-content">
          ${content}
        </div>
        ${footerHtml}
      </div>
    `;
  }
  
  /**
   * 渲染特性卡片
   * @param {string} title - 特性标题
   * @param {string} description - 特性描述
   * @param {string} iconName - 图标名称
   * @param {string} borderColor - 边框颜色 (primary, secondary, success, warning, danger)
   * @returns {string} 特性卡片HTML
   */
  static renderFeatureCard(title, description, iconName, borderColor = 'primary') {
    return `
      <div class="feature-card ${borderColor}-border">
        <div class="feature-icon">
          ${this.renderIcon(iconName, 'large')}
        </div>
        <h3 class="feature-title">${title}</h3>
        <p class="feature-description">${description}</p>
      </div>
    `;
  }
  
  /**
   * 渲染欢迎卡片
   * @param {string} title - 欢迎标题
   * @param {string} content - 欢迎内容
   * @param {string} borderColor - 边框颜色 (primary, secondary, success, warning, danger)
   * @returns {string} 欢迎卡片HTML
   */
  static renderWelcomeCard(title, content, borderColor = 'primary') {
    return `
      <div class="welcome-card ${borderColor}-border">
        <h2 class="welcome-title">${title}</h2>
        <div class="welcome-content">
          ${content}
        </div>
      </div>
    `;
  }
  
  /**
   * 渲染年级选择卡片
   * @param {string} title - 卡片标题
   * @param {string} description - 卡片描述
   * @param {Array} grades - 年级数组 ["一年级", "二年级", ...]
   * @param {string} selectedGrade - 当前选中的年级
   * @param {string} onClickFunction - 点击处理函数名称
   * @param {string} borderColor - 边框颜色 (primary, secondary, success, warning, danger)
   * @returns {string} 年级选择卡片HTML
   */
  static renderGradeSelectionCard(title, description, grades, selectedGrade = null, onClickFunction = 'selectGrade', borderColor = 'secondary') {
    return `
      <div class="grade-selection-card ${borderColor}-border">
        <h2 class="grade-selection-title">${title}</h2>
        <p class="grade-selection-description">${description}</p>
        <div class="grade-selection-buttons">
          ${this.renderGradeButtonGroup(grades, selectedGrade, onClickFunction)}
        </div>
      </div>
    `;
  }
  
  /**
   * 渲染提示卡片
   * @param {string} message - 提示消息
   * @param {string} iconName - 图标名称
   * @param {string} borderColor - 边框颜色 (primary, secondary, success, warning, danger)
   * @returns {string} 提示卡片HTML
   */
  static renderTipCard(message, iconName = 'info', borderColor = 'warning') {
    return `
      <div class="tip-card ${borderColor}-border">
        <div class="tip-icon">
          ${this.renderIcon(iconName, 'medium')}
        </div>
        <div class="tip-message">${message}</div>
      </div>
    `;
  }
  
  /**
   * 渲染首页综合卡片（包含欢迎信息和三个特性）
   * @param {string} welcomeTitle - 欢迎标题
   * @param {string} welcomeContent - 欢迎内容
   * @param {Array} features - 特性数组 [{title, description, iconName}]
   * @param {string} borderColor - 边框颜色 (primary, secondary, success, warning, danger)
   * @returns {string} 综合卡片HTML
   */
  static renderHomepageCard(welcomeTitle, welcomeContent, features, borderColor = 'primary') {
    // 生成特性HTML
    const featuresHtml = features.map(feature => `
      <div class="homepage-feature">
        <div class="homepage-feature-icon">
          ${this.renderIcon(feature.iconName, 'large')}
        </div>
        <h3 class="homepage-feature-title">${feature.title}</h3>
        <p class="homepage-feature-description">${feature.description}</p>
      </div>
    `).join('');
    
    return `
      <div class="homepage-card ${borderColor}-border">
        <div class="homepage-welcome">
          <h2 class="homepage-welcome-title">${welcomeTitle}</h2>
          <div class="homepage-welcome-content">
            ${welcomeContent}
          </div>
        </div>
        <div class="homepage-features">
          ${featuresHtml}
        </div>
      </div>
    `;
  }
  
  /**
   * 渲染进度条
   * @param {number} current - 当前值
   * @param {number} total - 总值
   * @param {string} label - 可选的标签
   * @param {string} color - 可选的颜色
   * @returns {string} 进度条HTML
   */
  static renderProgressBar(current, total, label = null, color = null) {
    // 计算百分比
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));
    
    // 标签HTML
    const labelHtml = label ? `
      <div class="progress-label">${label}</div>
    ` : '';
    
    // 颜色样式
    const colorStyle = color ? `style="background-color: ${color};"` : '';
    
    return `
      <div class="progress-container">
        ${labelHtml}
        <div class="progress-text">${current}/${total}</div>
        <div class="progress-bar">
          <div class="progress-fill" ${colorStyle} style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }
  
  /**
   * 渲染徽章
   * @param {string} text - 徽章文本
   * @param {string} type - 徽章类型 (default, success, warning, danger)
   * @returns {string} 徽章HTML
   */
  static renderBadge(text, type = 'default') {
    return `<span class="game-badge ${type}">${text}</span>`;
  }
  
  /**
   * 渲染技能点显示
   * @param {string} type - 技能类型 (empathy, courage, wisdom)
   * @param {number} value - 技能值
   * @returns {string} 技能点HTML
   */
  static renderSkillPoint(type, value) {
    // 技能名称映射
    const skillNames = {
      'empathy': '同理心',
      'courage': '勇气',
      'wisdom': '智慧'
    };
    
    const name = skillNames[type] || type;
    
    return `
      <div class="skill-item">
        <div class="skill-icon">${this.renderIcon(type, 'medium')}</div>
        <div class="skill-value">${value}</div>
        <div class="skill-name">${name}</div>
      </div>
    `;
  }
  
  /**
   * 渲染场景卡片
   * @param {Object} scenario - 场景对象
   * @param {boolean} isCompleted - 是否已完成
   * @returns {string} 场景卡片HTML
   */
  static renderScenarioCard(scenario, isCompleted = false) {
    // 确保isCompleted是布尔值
    isCompleted = Boolean(isCompleted);
    
    // 状态类和难度类
    const statusClass = isCompleted ? 'completed' : 'new';
    let difficultyClass = '';
    if (scenario.difficulty === '简单') difficultyClass = 'easy';
    else if (scenario.difficulty === '中等') difficultyClass = 'medium';
    else if (scenario.difficulty === '困难') difficultyClass = 'hard';
    
    // 操作按钮
    const actionButton = isCompleted 
      ? `<div class="completed-status">
          <span class="game-icon icon-small">
            <svg viewBox="0 0 24 24" width="100%" height="100%">
              <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </span>
          已完成
        </div>`
      : `<button class="start-btn difficulty-${difficultyClass}" data-scenario-id="${scenario.id}">开始挑战</button>`;
    
    // 难度徽章
    let difficultyType = 'info';
    if (scenario.difficulty === '简单') difficultyType = 'info';
    else if (scenario.difficulty === '中等') difficultyType = 'warning';
    else if (scenario.difficulty === '困难') difficultyType = 'danger';
    
    return `
      <div class="scenario-card no-image ${difficultyClass} ${statusClass}" data-scenario-id="${scenario.id}">
        <div class="scenario-header">
          <div class="scenario-title">${scenario.title}</div>
          <div class="scenario-meta">
            <span class="game-badge ${difficultyType}">${scenario.difficulty}</span>
            <span class="game-badge">${scenario.category}</span>
          </div>
        </div>
        
        <div class="scenario-description">
          ${scenario.description}
        </div>
        
        <div class="scenario-actions">
          ${actionButton}
        </div>
      </div>
    `;
  }
  
  /**
   * 渲染场景详情页
   * @param {Object} scenario - 场景对象
   * @returns {string} 场景详情页HTML
   */
  static renderScenarioDetail(scenario) {
    // 设置背景颜色
    let headerColor;
    switch(scenario.difficulty) {
      case "简单":
        headerColor = 'var(--secondary-color)';
        break;
      case "中等":
        headerColor = 'var(--warning-color)';
        break;
      case "困难":
        headerColor = 'var(--danger-color)';
        break;
      default:
        headerColor = 'var(--secondary-color)';
    }
    
    // 选项按钮
    const choicesHtml = scenario.choices ? scenario.choices.map((choice, index) => `
      <div class="scenario-choice">
        <button class="game-btn ${index === 0 ? 'primary' : 'outline primary'} full-width" style="margin-bottom: 10px;" onclick="selectChoice('${choice.id}')">
          ${choice.text}
        </button>
      </div>
    `).join('') : '';
    
    return `
      <div class="scenario-detail">
        <div class="scenario-detail-header" style="background-color: ${headerColor};">
          <div class="scenario-detail-title">${scenario.title}</div>
          <div class="scenario-detail-meta">
            <span class="game-badge">${scenario.difficulty}</span>
            <span class="game-badge">${scenario.category}</span>
          </div>
          <button class="scenario-detail-back" onclick="hideScenarioDetail()">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="scenario-detail-image">
          <img src="${scenario.image}" alt="${scenario.title}">
        </div>
        <div class="scenario-detail-content">
          <div class="scenario-detail-description">${scenario.description}</div>
          <div class="scenario-detail-situation">
            <h3>${scenario.situation}</h3>
            <div class="scenario-choices">
              ${choicesHtml}
            </div>
          </div>
        </div>
        <div class="scenario-detail-actions">
          ${this.renderButton('返回主页', "window.location.href='index.html'", 'success', 'medium', 'home')}
        </div>
      </div>
    `;
  }
  
  /**
   * 渲染对话框
   * @param {string} title - 对话框标题
   * @param {string} content - 对话框内容
   * @param {Array} buttons - 按钮配置数组 [{text, onClick, type}]
   * @returns {string} 对话框HTML
   */
  static renderDialog(title, content, buttons = []) {
    // 按钮HTML
    const buttonsHtml = buttons.map(btn => 
      this.renderButton(btn.text, btn.onClick, btn.type || 'primary', 'medium')
    ).join('');
    
    return `
      <div class="game-dialog-overlay">
        <div class="game-dialog">
          <div class="dialog-header">
            <h3 class="dialog-title">${title}</h3>
            <button class="dialog-close" onclick="closeDialog()">${this.renderIcon('close', 'small')}</button>
          </div>
          <div class="dialog-content">
            ${content}
          </div>
          <div class="dialog-footer">
            ${buttonsHtml}
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * 渲染通知
   * @param {string} message - 通知消息
   * @param {string} type - 通知类型 (info, success, warning, error)
   * @param {number} duration - 显示时长（毫秒）
   * @returns {string} 通知HTML
   */
  static renderNotification(message, type = 'info', duration = 3000) {
    // 生成唯一ID
    const notificationId = `notification-${Math.random().toString(36).substring(2, 9)}`;
    
    // 图标映射
    const iconMap = {
      'info': 'info',
      'success': 'achievement',
      'warning': 'warning',
      'error': 'close'
    };
    
    const icon = iconMap[type] || 'info';
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `game-notification ${type}`;
    notification.id = notificationId;
    notification.innerHTML = `
      <div class="notification-icon">${this.renderIcon(icon, 'small')}</div>
      <div class="notification-message">${message}</div>
      <button class="notification-close" onclick="document.getElementById('${notificationId}').remove()">
        ${this.renderIcon('close', 'small')}
      </button>
    `;
    
    // 添加到文档
    document.body.appendChild(notification);
    
    // 设置自动消失
    setTimeout(() => {
      const notificationElement = document.getElementById(notificationId);
      if (notificationElement) {
        notificationElement.classList.add('fade-out');
        setTimeout(() => notificationElement.remove(), 300);
      }
    }, duration);
    
    return notificationId;
  }
}

// 导出组件库
window.UIComponents = UIComponents;