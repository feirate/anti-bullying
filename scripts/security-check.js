#!/usr/bin/env node

/**
 * 安全检查脚本
 * 在提交前检查代码中的敏感信息
 */

const fs = require('fs');
const path = require('path');

class SecurityChecker {
  constructor() {
    this.sensitivePatterns = [
      // API密钥模式
      /(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]+['"]/gi,
      /(?:secret[_-]?key|secretkey)\s*[:=]\s*['"][^'"]+['"]/gi,
      /(?:access[_-]?token|accesstoken)\s*[:=]\s*['"][^'"]+['"]/gi,
      
      // 数据库连接
      /(?:database[_-]?url|db[_-]?url)\s*[:=]\s*['"][^'"]+['"]/gi,
      /(?:connection[_-]?string)\s*[:=]\s*['"][^'"]+['"]/gi,
      /(?:supabase[_-]?url|supabase[_-]?key)\s*[:=]\s*['"][^'"]+['"]/gi,
      
      // 密码模式
      /(?:password|pwd)\s*[:=]\s*['"][^'"]+['"]/gi,
      
      // 私钥模式
      /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,
      
      // 常见服务密钥
      /(?:aws[_-]?access[_-]?key|aws[_-]?secret)/gi,
      /(?:google[_-]?api[_-]?key)/gi,
      /(?:openai[_-]?api[_-]?key)/gi,
      /(?:vercel[_-]?token)/gi,
      
      // JWT和其他token
      /(?:jwt[_-]?secret|bearer[_-]?token)\s*[:=]\s*['"][^'"]+['"]/gi,
      
      // 硬编码URL（可能包含敏感信息）
      /https?:\/\/[^\/\s]+\.(?:amazonaws\.com|googleapis\.com|openai\.com|supabase\.co)/gi,
      
      // 可疑的配置模式
      /(?:config|settings|credentials)\s*[:=]\s*\{[^}]*(?:key|secret|token|password)[^}]*\}/gi
    ];
    
    this.excludeFiles = [
      '.env.example',
      'security-check.js',
      '.gitignore',
      'package-lock.json'
    ];
    
    this.excludeDirs = [
      'node_modules',
      '.git',
      '.kiro',
      '.specstory',
      'dist',
      'build'
    ];
  }
  
  /**
   * 检查单个文件
   */
  checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    this.sensitivePatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const lines = content.substring(0, content.indexOf(match)).split('\n');
          issues.push({
            file: filePath,
            line: lines.length,
            pattern: pattern.toString(),
            match: match,
            severity: 'HIGH'
          });
        });
      }
    });
    
    return issues;
  }
  
  /**
   * 递归检查目录
   */
  checkDirectory(dirPath) {
    const issues = [];
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          if (!this.excludeDirs.includes(item)) {
            issues.push(...this.checkDirectory(itemPath));
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          const fileName = path.basename(item);
          
          // 只检查代码文件
          if (['.js', '.ts', '.json', '.html', '.css', '.md'].includes(ext) && 
              !this.excludeFiles.includes(fileName)) {
            issues.push(...this.checkFile(itemPath));
          }
        }
      }
    } catch (error) {
      console.warn(`无法读取目录 ${dirPath}: ${error.message}`);
    }
    
    return issues;
  }
  
  /**
   * 运行安全检查
   */
  run() {
    console.log('🔍 开始安全检查...\n');
    
    const issues = this.checkDirectory('.');
    
    if (issues.length === 0) {
      console.log('✅ 未发现安全问题');
      return true;
    }
    
    console.log(`❌ 发现 ${issues.length} 个潜在安全问题:\n`);
    
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}:${issue.line}`);
      console.log(`   严重程度: ${issue.severity}`);
      console.log(`   匹配内容: ${issue.match}`);
      console.log(`   建议: 将敏感信息移至环境变量\n`);
    });
    
    console.log('🚨 请在提交前修复这些安全问题!');
    return false;
  }
}

// 运行检查
const checker = new SecurityChecker();
const isSecure = checker.run();

process.exit(isSecure ? 0 : 1);