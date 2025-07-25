#!/usr/bin/env node

/**
 * 增强版安全检查脚本
 * 检测代码中的敏感信息和安全问题
 */

const fs = require('fs');
const path = require('path');

class SecurityChecker {
  constructor() {
    this.issues = [];
    this.patterns = {
      // API 密钥模式
      apiKeys: [
        /api[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/gi,
        /secret[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/gi,
        /access[_-]?token\s*[:=]\s*['"][^'"]{10,}['"]/gi,
        /auth[_-]?token\s*[:=]\s*['"][^'"]{10,}['"]/gi
      ],
      
      // 数据库连接字符串
      dbConnections: [
        /(mongodb|mysql|postgres|redis|sqlite):\/\/[^\s'"]+/gi,
        /database[_-]?url\s*[:=]\s*['"][^'"]+['"]/gi,
        /connection[_-]?string\s*[:=]\s*['"][^'"]+['"]/gi
      ],
      
      // 私钥和证书
      privateKeys: [
        /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/g,
        /-----BEGIN\s+CERTIFICATE-----/g,
        /private[_-]?key\s*[:=]\s*['"][^'"]{50,}['"]/gi
      ],
      
      // 硬编码密码
      passwords: [
        /password\s*[:=]\s*['"][^'"]{3,}['"]/gi,
        /passwd\s*[:=]\s*['"][^'"]{3,}['"]/gi,
        /pwd\s*[:=]\s*['"][^'"]{3,}['"]/gi
      ],
      
      // 废弃的 API
      deprecatedApis: [
        /document\.execCommand\s*\(/g,
        /window\.showModalDialog\s*\(/g,
        /navigator\.getUserMedia\s*\(/g
      ],
      
      // 不安全的函数
      unsafeFunctions: [
        /eval\s*\(/g,
        /innerHTML\s*=\s*[^;]+\+/g,
        /document\.write\s*\(/g
      ]
    };
  }

  /**
   * 检查单个文件
   */
  checkFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // 检查各种安全模式
      Object.entries(this.patterns).forEach(([category, patterns]) => {
        patterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => {
              const lineNumber = this.getLineNumber(content, match);
              this.issues.push({
                file: relativePath,
                line: lineNumber,
                category,
                issue: match.trim(),
                severity: this.getSeverity(category)
              });
            });
          }
        });
      });
      
    } catch (error) {
      console.error(`无法读取文件 ${filePath}:`, error.message);
    }
  }

  /**
   * 获取匹配内容的行号
   */
  getLineNumber(content, match) {
    const index = content.indexOf(match);
    if (index === -1) return 1;
    
    return content.substring(0, index).split('\n').length;
  }

  /**
   * 获取问题严重程度
   */
  getSeverity(category) {
    const severityMap = {
      apiKeys: 'HIGH',
      dbConnections: 'HIGH',
      privateKeys: 'CRITICAL',
      passwords: 'HIGH',
      deprecatedApis: 'MEDIUM',
      unsafeFunctions: 'MEDIUM'
    };
    
    return severityMap[category] || 'LOW';
  }

  /**
   * 扫描目录
   */
  scanDirectory(dir, extensions = ['.js', '.ts', '.json', '.env']) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // 跳过某些目录
        if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
          this.scanDirectory(filePath, extensions);
        }
      } else if (extensions.some(ext => file.endsWith(ext))) {
        this.checkFile(filePath);
      }
    });
  }

  /**
   * 检查环境变量配置
   */
  checkEnvConfig() {
    const envFile = '.env';
    const envExampleFile = '.env.example';
    const gitignoreFile = '.gitignore';
    
    // 检查 .env 文件
    if (fs.existsSync(envFile)) {
      const envContent = fs.readFileSync(envFile, 'utf8');
      
      // 检查是否包含占位符值
      const placeholders = [
        'your_',
        '_here',
        'placeholder',
        'example',
        'changeme'
      ];
      
      placeholders.forEach(placeholder => {
        if (envContent.includes(placeholder)) {
          this.issues.push({
            file: envFile,
            line: this.getLineNumber(envContent, placeholder),
            category: 'envConfig',
            issue: `包含占位符值: ${placeholder}`,
            severity: 'LOW'
          });
        }
      });
    }
    
    // 检查 .gitignore 是否包含 .env
    if (fs.existsSync(gitignoreFile)) {
      const gitignoreContent = fs.readFileSync(gitignoreFile, 'utf8');
      if (!gitignoreContent.includes('.env')) {
        this.issues.push({
          file: gitignoreFile,
          line: 1,
          category: 'gitignore',
          issue: '.env 文件未被忽略',
          severity: 'HIGH'
        });
      }
    }
  }

  /**
   * 生成报告
   */
  generateReport() {
    console.log('\n🔒 安全检查报告');
    console.log('='.repeat(50));
    
    if (this.issues.length === 0) {
      console.log('✅ 未发现安全问题');
      return true;
    }
    
    // 按严重程度分组
    const groupedIssues = this.issues.reduce((acc, issue) => {
      if (!acc[issue.severity]) {
        acc[issue.severity] = [];
      }
      acc[issue.severity].push(issue);
      return acc;
    }, {});
    
    // 显示问题
    ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
      if (groupedIssues[severity]) {
        console.log(`\n${this.getSeverityIcon(severity)} ${severity} (${groupedIssues[severity].length})`);
        console.log('-'.repeat(30));
        
        groupedIssues[severity].forEach(issue => {
          console.log(`📁 ${issue.file}:${issue.line}`);
          console.log(`   ${issue.issue}`);
          console.log(`   类别: ${issue.category}\n`);
        });
      }
    });
    
    // 统计信息
    console.log('\n📊 统计信息');
    console.log('-'.repeat(20));
    console.log(`总问题数: ${this.issues.length}`);
    console.log(`严重问题: ${(groupedIssues.CRITICAL || []).length}`);
    console.log(`高危问题: ${(groupedIssues.HIGH || []).length}`);
    console.log(`中危问题: ${(groupedIssues.MEDIUM || []).length}`);
    console.log(`低危问题: ${(groupedIssues.LOW || []).length}`);
    
    return this.issues.filter(i => ['CRITICAL', 'HIGH'].includes(i.severity)).length === 0;
  }

  /**
   * 获取严重程度图标
   */
  getSeverityIcon(severity) {
    const icons = {
      CRITICAL: '🚨',
      HIGH: '⚠️',
      MEDIUM: '⚡',
      LOW: 'ℹ️'
    };
    
    return icons[severity] || 'ℹ️';
  }

  /**
   * 运行完整检查
   */
  run() {
    console.log('🔍 开始安全检查...');
    
    // 扫描代码文件
    this.scanDirectory('.');
    
    // 检查环境变量配置
    this.checkEnvConfig();
    
    // 生成报告
    const passed = this.generateReport();
    
    // 退出码
    process.exit(passed ? 0 : 1);
  }
}

// 运行检查
if (require.main === module) {
  const checker = new SecurityChecker();
  checker.run();
}

module.exports = SecurityChecker;