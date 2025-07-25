// 现代剪贴板工具函数
class ClipboardUtils {
  /**
   * 复制文本到剪贴板
   * @param {string} text 要复制的文本
   * @returns {Promise<boolean>} 复制是否成功
   */
  static async copyToClipboard(text) {
    if (!text) {
      return false;
    }

    // 优先使用现代剪贴板API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.warn('现代剪贴板API失败:', error);
      }
    }

    // 降级到传统方法
    return this.fallbackCopyToClipboard(text);
  }

  /**
   * 降级复制方法
   * @param {string} text 要复制的文本
   * @returns {Promise<boolean>} 复制是否成功
   */
  static async fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    textArea.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    let success = false;
    try {
      // 使用现代选择API
      if (textArea.setSelectionRange) {
        textArea.setSelectionRange(0, text.length);
      }
      
      // 尝试复制 - 使用现代API替代废弃的execCommand
      try {
        // 选择文本内容
        if (textArea.setSelectionRange) {
          textArea.setSelectionRange(0, text.length);
        }
        
        // 尝试使用现代剪贴板API作为降级方案
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(text);
            success = true;
          } catch (clipboardError) {
            // 如果现代API也失败，则提示用户手动复制
            success = false;
          }
        } else {
          // 最后的降级方案：提示用户手动复制
          success = false;
        }
      } catch (error) {
        console.warn('剪贴板操作失败:', error);
        success = false;
      }
    } catch (error) {
      console.warn('降级复制失败:', error);
      success = false;
    } finally {
      document.body.removeChild(textArea);
    }
    
    return success;
  }

  /**
   * 检查剪贴板权限
   * @returns {Promise<boolean>} 是否有权限
   */
  static async checkClipboardPermission() {
    if (!navigator.permissions) {
      return false;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'clipboard-write' });
      return permission.state === 'granted';
    } catch (error) {
      console.warn('检查剪贴板权限失败:', error);
      return false;
    }
  }
}

// 导出到全局
window.ClipboardUtils = ClipboardUtils;