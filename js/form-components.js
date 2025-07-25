/**
 * 表单组件系统
 * 提供响应式表单组件的创建和管理功能
 */
class FormComponents {
  
  /**
   * 渲染基础输入字段
   * @param {string} type - 输入类型 (text, email, password, number等)
   * @param {string} id - 字段ID
   * @param {string} label - 标签文本
   * @param {Object} options - 配置选项
   * @returns {string} HTML字符串
   */
  static renderInput(type, id, label, options = {}) {
    const {
      placeholder = '',
      value = '',
      required = false,
      disabled = false,
      error = '',
      success = '',
      className = '',
      attributes = {}
    } = options;
    
    const requiredAttr = required ? 'required' : '';
    const disabledAttr = disabled ? 'disabled' : '';
    const errorClass = error ? 'error' : '';
    const additionalAttrs = Object.entries(attributes)
      .map(([key, val]) => `${key}="${val}"`)
      .join(' ');
    
    return `
      <div class="form-group">
        <label for="${id}" class="form-label">
          ${label}
          ${required ? '<span style="color: var(--danger-color);">*</span>' : ''}
        </label>
        <input 
          type="${type}"
          id="${id}"
          name="${id}"
          class="form-input ${errorClass} ${className}"
          placeholder="${placeholder}"
          value="${value}"
          ${requiredAttr}
          ${disabledAttr}
          ${additionalAttrs}
        />
        ${error ? `<div class="form-error-message">${error}</div>` : ''}
        ${success ? `<div class="form-success-message">${success}</div>` : ''}
      </div>
    `;
  }
  
  /**
   * 渲染文本域
   * @param {string} id - 字段ID
   * @param {string} label - 标签文本
   * @param {Object} options - 配置选项
   * @returns {string} HTML字符串
   */
  static renderTextarea(id, label, options = {}) {
    const {
      placeholder = '',
      value = '',
      required = false,
      disabled = false,
      rows = 4,
      error = '',
      success = '',
      className = '',
      attributes = {}
    } = options;
    
    const requiredAttr = required ? 'required' : '';
    const disabledAttr = disabled ? 'disabled' : '';
    const errorClass = error ? 'error' : '';
    const additionalAttrs = Object.entries(attributes)
      .map(([key, val]) => `${key}="${val}"`)
      .join(' ');
    
    return `
      <div class="form-group">
        <label for="${id}" class="form-label">
          ${label}
          ${required ? '<span style="color: var(--danger-color);">*</span>' : ''}
        </label>
        <textarea 
          id="${id}"
          name="${id}"
          class="form-textarea ${errorClass} ${className}"
          placeholder="${placeholder}"
          rows="${rows}"
          ${requiredAttr}
          ${disabledAttr}
          ${additionalAttrs}
        >${value}</textarea>
        ${error ? `<div class="form-error-message">${error}</div>` : ''}
        ${success ? `<div class="form-success-message">${success}</div>` : ''}
      </div>
    `;
  }
  
  /**
   * 渲染选择框
   * @param {string} id - 字段ID
   * @param {string} label - 标签文本
   * @param {Array} options - 选项数组 [{value, text, selected}]
   * @param {Object} config - 配置选项
   * @returns {string} HTML字符串
   */
  static renderSelect(id, label, options, config = {}) {
    const {
      required = false,
      disabled = false,
      error = '',
      success = '',
      className = '',
      attributes = {}
    } = config;
    
    const requiredAttr = required ? 'required' : '';
    const disabledAttr = disabled ? 'disabled' : '';
    const errorClass = error ? 'error' : '';
    const additionalAttrs = Object.entries(attributes)
      .map(([key, val]) => `${key}="${val}"`)
      .join(' ');
    
    const optionsHtml = options.map(option => {
      const selected = option.selected ? 'selected' : '';
      return `<option value="${option.value}" ${selected}>${option.text}</option>`;
    }).join('');
    
    return `
      <div class="form-group">
        <label for="${id}" class="form-label">
          ${label}
          ${required ? '<span style="color: var(--danger-color);">*</span>' : ''}
        </label>
        <select 
          id="${id}"
          name="${id}"
          class="form-select ${errorClass} ${className}"
          ${requiredAttr}
          ${disabledAttr}
          ${additionalAttrs}
        >
          ${optionsHtml}
        </select>
        ${error ? `<div class="form-error-message">${error}</div>` : ''}
        ${success ? `<div class="form-success-message">${success}</div>` : ''}
      </div>
    `;
  }
  
  /**
   * 渲染复选框组
   * @param {string} name - 字段名称
   * @param {string} label - 组标签
   * @param {Array} options - 选项数组 [{value, text, checked}]
   * @param {Object} config - 配置选项
   * @returns {string} HTML字符串
   */
  static renderCheckboxGroup(name, label, options, config = {}) {
    const {
      required = false,
      horizontal = false,
      error = '',
      success = '',
      className = ''
    } = config;
    
    const groupClass = horizontal ? 'horizontal' : '';
    
    const checkboxesHtml = options.map((option, index) => {
      const checked = option.checked ? 'checked' : '';
      const id = `${name}_${index}`;
      
      return `
        <div class="form-checkbox-item">
          <input 
            type="checkbox"
            id="${id}"
            name="${name}"
            value="${option.value}"
            class="form-checkbox"
            ${checked}
          />
          <label for="${id}">${option.text}</label>
        </div>
      `;
    }).join('');
    
    return `
      <div class="form-group">
        <div class="form-label">
          ${label}
          ${required ? '<span style="color: var(--danger-color);">*</span>' : ''}
        </div>
        <div class="form-checkbox-group ${groupClass} ${className}">
          ${checkboxesHtml}
        </div>
        ${error ? `<div class="form-error-message">${error}</div>` : ''}
        ${success ? `<div class="form-success-message">${success}</div>` : ''}
      </div>
    `;
  }
  
  /**
   * 渲染单选框组
   * @param {string} name - 字段名称
   * @param {string} label - 组标签
   * @param {Array} options - 选项数组 [{value, text, checked}]
   * @param {Object} config - 配置选项
   * @returns {string} HTML字符串
   */
  static renderRadioGroup(name, label, options, config = {}) {
    const {
      required = false,
      horizontal = false,
      error = '',
      success = '',
      className = ''
    } = config;
    
    const groupClass = horizontal ? 'horizontal' : '';
    
    const radiosHtml = options.map((option, index) => {
      const checked = option.checked ? 'checked' : '';
      const id = `${name}_${index}`;
      
      return `
        <div class="form-radio-item">
          <input 
            type="radio"
            id="${id}"
            name="${name}"
            value="${option.value}"
            class="form-radio"
            ${checked}
          />
          <label for="${id}">${option.text}</label>
        </div>
      `;
    }).join('');
    
    return `
      <div class="form-group">
        <div class="form-label">
          ${label}
          ${required ? '<span style="color: var(--danger-color);">*</span>' : ''}
        </div>
        <div class="form-radio-group ${groupClass} ${className}">
          ${radiosHtml}
        </div>
        ${error ? `<div class="form-error-message">${error}</div>` : ''}
        ${success ? `<div class="form-success-message">${success}</div>` : ''}
      </div>
    `;
  }
  
  /**
   * 渲染搜索表单
   * @param {string} id - 字段ID
   * @param {string} placeholder - 占位符文本
   * @param {Object} options - 配置选项
   * @returns {string} HTML字符串
   */
  static renderSearchForm(id, placeholder = '搜索...', options = {}) {
    const {
      value = '',
      onSearch = 'handleSearch',
      className = ''
    } = options;
    
    return `
      <div class="form-group">
        <div class="search-form ${className}">
          <input 
            type="text"
            id="${id}"
            name="${id}"
            class="form-input"
            placeholder="${placeholder}"
            value="${value}"
          />
          <button 
            type="button" 
            class="search-button"
            onclick="${onSearch}()"
            aria-label="搜索"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * 渲染文件上传组件
   * @param {string} id - 字段ID
   * @param {string} label - 标签文本
   * @param {Object} options - 配置选项
   * @returns {string} HTML字符串
   */
  static renderFileUpload(id, label, options = {}) {
    const {
      accept = '',
      multiple = false,
      required = false,
      error = '',
      success = '',
      uploadText = '点击选择文件或拖拽文件到此处'
    } = options;
    
    const multipleAttr = multiple ? 'multiple' : '';
    const requiredAttr = required ? 'required' : '';
    const acceptAttr = accept ? `accept="${accept}"` : '';
    
    return `
      <div class="form-group">
        <label class="form-label">
          ${label}
          ${required ? '<span style="color: var(--danger-color);">*</span>' : ''}
        </label>
        <div class="form-file-upload">
          <input 
            type="file"
            id="${id}"
            name="${id}"
            ${acceptAttr}
            ${multipleAttr}
            ${requiredAttr}
          />
          <div class="form-file-upload-label">
            ${uploadText}
          </div>
        </div>
        ${error ? `<div class="form-error-message">${error}</div>` : ''}
        ${success ? `<div class="form-success-message">${success}</div>` : ''}
      </div>
    `;
  }
  
  /**
   * 渲染表单按钮组
   * @param {Array} buttons - 按钮配置数组
   * @returns {string} HTML字符串
   */
  static renderFormActions(buttons) {
    const buttonsHtml = buttons.map(button => {
      const {
        text,
        type = 'button',
        variant = 'primary',
        size = 'medium',
        onclick = '',
        disabled = false
      } = button;
      
      const disabledAttr = disabled ? 'disabled' : '';
      const onclickAttr = onclick ? `onclick="${onclick}"` : '';
      
      return `
        <button 
          type="${type}"
          class="game-btn ${variant} ${size}"
          ${disabledAttr}
          ${onclickAttr}
        >
          ${text}
        </button>
      `;
    }).join('');
    
    return `
      <div class="form-actions">
        ${buttonsHtml}
      </div>
    `;
  }
  
  /**
   * 渲染完整表单容器
   * @param {string} id - 表单ID
   * @param {string} content - 表单内容HTML
   * @param {Object} options - 配置选项
   * @returns {string} HTML字符串
   */
  static renderForm(id, content, options = {}) {
    const {
      method = 'POST',
      action = '',
      onsubmit = '',
      className = ''
    } = options;
    
    const actionAttr = action ? `action="${action}"` : '';
    const onsubmitAttr = onsubmit ? `onsubmit="${onsubmit}"` : '';
    
    return `
      <div class="form-container">
        <form 
          id="${id}"
          method="${method}"
          ${actionAttr}
          ${onsubmitAttr}
          class="${className}"
        >
          ${content}
        </form>
      </div>
    `;
  }
  
  /**
   * 表单验证工具
   */
  static validation = {
    /**
     * 验证必填字段
     * @param {string} value - 字段值
     * @returns {boolean} 是否有效
     */
    required(value) {
      return value && value.trim().length > 0;
    },
    
    /**
     * 验证邮箱格式
     * @param {string} email - 邮箱地址
     * @returns {boolean} 是否有效
     */
    email(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    /**
     * 验证最小长度
     * @param {string} value - 字段值
     * @param {number} minLength - 最小长度
     * @returns {boolean} 是否有效
     */
    minLength(value, minLength) {
      return value && value.length >= minLength;
    },
    
    /**
     * 验证最大长度
     * @param {string} value - 字段值
     * @param {number} maxLength - 最大长度
     * @returns {boolean} 是否有效
     */
    maxLength(value, maxLength) {
      return !value || value.length <= maxLength;
    },
    
    /**
     * 验证数字范围
     * @param {number} value - 数值
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {boolean} 是否有效
     */
    numberRange(value, min, max) {
      const num = parseFloat(value);
      return !isNaN(num) && num >= min && num <= max;
    }
  };
  
  /**
   * 设置字段错误状态
   * @param {string} fieldId - 字段ID
   * @param {string} errorMessage - 错误消息
   */
  static setFieldError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add('error');
      
      // 移除现有错误消息
      const existingError = field.parentNode.querySelector('.form-error-message');
      if (existingError) {
        existingError.remove();
      }
      
      // 添加新错误消息
      if (errorMessage) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
      }
    }
  }
  
  /**
   * 清除字段错误状态
   * @param {string} fieldId - 字段ID
   */
  static clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.remove('error');
      
      const errorMessage = field.parentNode.querySelector('.form-error-message');
      if (errorMessage) {
        errorMessage.remove();
      }
    }
  }
  
  /**
   * 设置表单加载状态
   * @param {string} formId - 表单ID
   * @param {boolean} loading - 是否加载中
   */
  static setFormLoading(formId, loading) {
    const form = document.getElementById(formId);
    if (form) {
      if (loading) {
        form.classList.add('form-loading');
      } else {
        form.classList.remove('form-loading');
      }
    }
  }
}

// 导出到全局
window.FormComponents = FormComponents;