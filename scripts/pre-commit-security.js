#!/usr/bin/env node

/**
 * Git提交前安全检查脚本
 * 防止敏感信息被意外提交
 */

const { execSync } = require('child_process');
const fs = require('fs');

class PreCommitSecurityCheck {
  constructor() {
    this.sensitivePatterns = [
      /api[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/gi,
      /secret[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/gi,
      /password\s*[:=]\s*['"][^'"]{3,}['"]/gi,
      /token\s*[:=]\s*['"][^'"]{10,}['"]/gi,
      /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/g,
      /(mongodb|mysql|postgres):\/\/[^\s'"]+/gi
    ];
  }

  checkStagedFiles() {
    try {
      const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
        .split('\n')
        .filter(file => file.trim() && file.endsWith('.js'));

      let hasIssues = false;

      for (const file of stagedFiles) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          
          for (const pattern of this.sensitivePatterns) {
            if (pattern.test(content)) {
              console.error(`❌ 检测到敏感信息: ${file}`);
              hasIssues = true;
            }
          }
        }
      }

      return !hasIssues;
    } catch (error) {
      console.warn('安全检查失败:', error.message);
      return true;
    }
  }

  run() {
    console.log('🔍 执行提交前安全检查...');
    
    if (!this.checkStagedFiles()) {
      console.error('\n🚨 发现敏感信息，提交已阻止！');
      console.error('请移除敏感信息或将其移至环境变量');
      process.exit(1);
    }

    console.log('✅ 安全检查通过');
  }
}

if (require.main === module) {
  new PreCommitSecurityCheck().run();
}

module.exports = PreCommitSecurityCheck;