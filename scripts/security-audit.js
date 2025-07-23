#!/usr/bin/env node

/**
 * 安全审计脚本
 * 在提交前检查敏感信息
 */

const fs = require('fs');
const path = require('path');

class SecurityAudit {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.sensitivePatterns = [
      /(api[_-]?key|secret|password|token|credential|private[_-]?key|access[_-]?key)/i,
      /[A-Za-z0-9]{32,}/,
      /sk-[A-Za-z0-9]{48}/,
      /pk_[a-z]+_[A-Za-z0-9]{24}/
    ];
  }

  /**
   * 执行安全审计
   */
  async audit() {
    console.log('🔍 开始安全审计...\n');
    
    await this.checkFiles();
    await this.checkEnvironmentFiles();
    await this.checkGitignore();
    
    this.reportResults();
    
    return this.errors.length === 0;
  }

  /**
   * 检查源代码文件
   */
  async checkFiles() {
    const extensions = ['.js', '.ts', '.json', '.html', '.md'];
    const files = this.getFilesRecursively('.', extensions);
    
    for (const file of files) {
      if (this.shouldSkipFile(file)) continue;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        this.checkFileContent(file, content);
      } catch (error) {
        this.warnings.push(`无法读取文件: ${file}`);
      }
    }
  }

  /**
   * 检查文件内容
   */
  checkFileContent(filePath, content) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // 检查敏感信息模式
      this.sensitivePatterns.forEach(pattern => {
        if (pattern.test(line) && !this.isCommentOrExample(line)) {
          this.errors.push(`${filePath}:${index + 1} - 可能包含敏感信息: ${line.trim()}`);
        }
      });
      
      // 检查硬编码URL
      const urlMatch = line.match(/https?:\/\/[^\s'"]+/);
      if (urlMatch && !this.isAllowedUrl(urlMatch[0])) {
        this.warnings.push(`${filePath}:${index + 1} - 硬编码URL: ${urlMatch[0]}`);
      }
    });
  }

  /**
   * 检查环境文件
   */
  async checkEnvironmentFiles() {
    const envFiles = ['.env', '.env.local', '.env.production'];
    
    for (const envFile of envFiles) {
      if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, 'utf8');
        
        if (content.includes('your_') || content.includes('_here')) {
          this.warnings.push(`${envFile} 包含占位符值，请确保生产环境使用真实值`);
        }
      }
    }
  }

  /**
   * 检查.gitignore配置
   */
  async checkGitignore() {
    if (!fs.existsSync('.gitignore')) {
      this.errors.push('缺少.gitignore文件');
      return;
    }
    
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const requiredPatterns = ['.env', '*.key', '*.pem', 'secrets.json'];
    
    requiredPatterns.forEach(pattern => {
      if (!gitignore.includes(pattern)) {
        this.warnings.push(`.gitignore缺少模式: ${pattern}`);
      }
    });
  }

  /**
   * 获取文件列表
   */
  getFilesRecursively(dir, extensions) {
    const files = [];
    
    const traverse = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !this.shouldSkipDirectory(item)) {
          traverse(fullPath);
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    };
    
    traverse(dir);
    return files;
  }

  /**
   * 是否跳过目录
   */
  shouldSkipDirectory(dirname) {
    const skipDirs = ['node_modules', '.git', 'dist', 'build', '.vercel'];
    return skipDirs.includes(dirname);
  }

  /**
   * 是否跳过文件
   */
  shouldSkipFile(filepath) {
    const skipFiles = ['package-lock.json', 'yarn.lock'];
    return skipFiles.some(file => filepath.includes(file));
  }

  /**
   * 是否为注释或示例
   */
  isCommentOrExample(line) {
    const trimmed = line.trim();
    return trimmed.startsWith('//') || 
           trimmed.startsWith('#') || 
           trimmed.startsWith('*') ||
           trimmed.includes('example') ||
           trimmed.includes('placeholder') ||
           trimmed.includes('your_') ||
           trimmed.includes('_here') ||
           trimmed.includes('eyJhbGci') || // JWT示例
           trimmed.includes('sensitivePatterns') || // 安全脚本本身
           trimmed.includes('requiredPatterns') || // 配置模式
           trimmed.includes('--disable-features') || // 系统进程参数
           trimmed.includes('--enable-features') || // 系统进程参数
           trimmed.includes('partialSemantic') || // TypeScript编译器参数
           trimmed.includes('cancellationPipe') || // 编译器内部参数
           trimmed.includes('http://www.w3.org/2000/svg'); // SVG命名空间
  }

  /**
   * 是否为允许的URL
   */
  isAllowedUrl(url) {
    const allowedDomains = [
      'github.com',
      'docs.astral.sh',
      'app.supabase.com',
      'via.placeholder.com', // 测试占位符图片
      'fonts.googleapis.com', // Google字体
      'registry.npmjs.org' // NPM注册表
    ];
    
    // 警告外部CDN使用
    const cdnDomains = ['unpkg.com', 'esm.sh', 'jsdelivr.net'];
    if (cdnDomains.some(domain => url.includes(domain))) {
      this.warnings.push(`使用外部CDN: ${url}，建议本地化处理`);
      return true; // 允许但警告
    }
    
    return allowedDomains.some(domain => url.includes(domain));
  }

  /**
   * 报告结果
   */
  reportResults() {
    console.log('\n📊 安全审计结果:\n');
    
    if (this.errors.length > 0) {
      console.log('🚨 发现安全问题:');
      this.errors.forEach(error => console.log(`  ❌ ${error}`));
      console.log('');
    }
    
    if (this.warnings.length > 0) {
      console.log('⚠️  安全警告:');
      this.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
      console.log('');
    }
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ 未发现安全问题');
    }
    
    console.log(`\n📈 统计: ${this.errors.length} 个错误, ${this.warnings.length} 个警告\n`);
  }
}

// 执行审计
if (require.main === module) {
  const audit = new SecurityAudit();
  audit.audit().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = SecurityAudit;