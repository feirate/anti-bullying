#!/usr/bin/env node

/**
 * Git提交前安全检查脚本
 * 检测即将提交的文件中是否包含敏感信息
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PreCommitSecurityCheck {
    constructor() {
        this.sensitivePatterns = [
            // API密钥模式
            /(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{10,}['"]/gi,
            /(?:secret[_-]?key|secretkey)\s*[:=]\s*['"][^'"]{10,}['"]/gi,
            /(?:access[_-]?token|accesstoken)\s*[:=]\s*['"][^'"]{10,}['"]/gi,

            // 数据库连接
            /(?:mongodb|mysql|postgres):\/\/[^'"]+/gi,
            /(?:database[_-]?url|db[_-]?url)\s*[:=]\s*['"][^'"]+['"]/gi,

            // 密码模式
            /(?:password|pwd)\s*[:=]\s*['"][^'"]{3,}['"]/gi,

            // 私钥模式
            /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,

            // 常见服务密钥
            /(?:aws[_-]?access[_-]?key|aws[_-]?secret)/gi,
            /(?:stripe[_-]?key)/gi,
            /(?:google[_-]?api[_-]?key)/gi,
            /(?:openai[_-]?api[_-]?key)/gi,
            /(?:vercel[_-]?token)/gi,

            // JWT和其他token
            /(?:jwt[_-]?secret|bearer[_-]?token)\s*[:=]\s*['"][^'"]{10,}['"]/gi,

            // 真实的Supabase URL模式（排除占位符）
            /https:\/\/(?!your-project-id)[a-z0-9]+\.supabase\.co/gi,

            // 真实的JWT令牌模式（完整格式）
            /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,

            // Supabase匿名密钥模式（排除占位符）
            /eyJ(?!hbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.your_)[A-Za-z0-9_-]{40,}/g,

            // 配置文件中的硬编码值检查
            /(?:url|key|token|secret)\s*:\s*['"][^'"]{20,}['"]/gi,

            // 硬编码URL（可能包含敏感信息）
            /https?:\/\/(?!(?:localhost|127\.0\.0\.1|example\.com|your-|placeholder))[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi
        ];

        this.allowedPatterns = [
            // 允许的示例URL
            /https?:\/\/(?:api\.)?example\.com/gi,
            /https?:\/\/(?:cdn\.)?example\.com/gi,
            /your_.*_here/gi,
            /your-.*-domain\.com/gi,
            /placeholder/gi,
            // 文档和注释中的示例
            /https:\/\/your-project-id\.supabase\.co/gi
        ];
    }

    /**
     * 获取即将提交的文件
     */
    getStagedFiles() {
        try {
            const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
            return output.trim().split('\n').filter(file => file && fs.existsSync(file));
        } catch (error) {
            console.error('获取暂存文件失败:', error.message);
            return [];
        }
    }

    /**
     * 检查文件内容
     */
    checkFile(filePath) {
        const issues = [];

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');

            lines.forEach((line, index) => {
                const lineNumber = index + 1;

                // 检查敏感模式
                for (const pattern of this.sensitivePatterns) {
                    const matches = line.match(pattern);
                    if (matches) {
                        // 检查是否为允许的模式
                        const isAllowed = this.allowedPatterns.some(allowedPattern =>
                            allowedPattern.test(line)
                        );

                        if (!isAllowed) {
                            issues.push({
                                file: filePath,
                                line: lineNumber,
                                content: line.trim(),
                                match: matches[0],
                                type: this.getPatternType(pattern)
                            });
                        }
                    }
                }
            });
        } catch (error) {
            console.error(`读取文件失败 ${filePath}:`, error.message);
        }

        return issues;
    }

    /**
     * 获取模式类型描述
     */
    getPatternType(pattern) {
        const patternStr = pattern.toString();
        if (patternStr.includes('api[_-]?key')) return 'API密钥';
        if (patternStr.includes('secret')) return '密钥';
        if (patternStr.includes('password')) return '密码';
        if (patternStr.includes('token')) return '访问令牌';
        if (patternStr.includes('PRIVATE')) return '私钥';
        if (patternStr.includes('supabase')) return 'Supabase URL';
        if (patternStr.includes('eyJ')) return 'JWT令牌';
        if (patternStr.includes('https?')) return '可疑URL';
        return '敏感信息';
    }

    /**
     * 运行安全检查
     */
    run() {
        console.log('🔍 运行提交前安全检查...\n');

        const stagedFiles = this.getStagedFiles();
        if (stagedFiles.length === 0) {
            console.log('✅ 没有暂存的文件需要检查');
            return true;
        }

        const allIssues = [];

        // 只检查相关文件类型
        const relevantFiles = stagedFiles.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.js', '.ts', '.json', '.env', '.md', '.html', '.css', '.sh'].includes(ext) ||
                file.includes('.env') || file.includes('config');
        });

        for (const file of relevantFiles) {
            const issues = this.checkFile(file);
            allIssues.push(...issues);
        }

        if (allIssues.length === 0) {
            console.log('✅ 安全检查通过，未发现敏感信息');
            return true;
        }

        // 报告问题
        console.log('🚨 发现潜在的敏感信息:\n');

        const groupedIssues = {};
        allIssues.forEach(issue => {
            if (!groupedIssues[issue.file]) {
                groupedIssues[issue.file] = [];
            }
            groupedIssues[issue.file].push(issue);
        });

        for (const [file, issues] of Object.entries(groupedIssues)) {
            console.log(`📄 ${file}:`);
            issues.forEach(issue => {
                console.log(`  ⚠️  第${issue.line}行 [${issue.type}]: ${issue.match}`);
                console.log(`      ${issue.content}`);
            });
            console.log('');
        }

        console.log('🛡️  建议操作:');
        console.log('1. 将敏感信息移至环境变量');
        console.log('2. 确保 .env 文件已添加到 .gitignore');
        console.log('3. 使用占位符替换真实的API密钥和URL');
        console.log('4. 检查是否误提交了配置文件');
        console.log('\n如果确认这些不是敏感信息，可以使用 git commit --no-verify 跳过检查');

        return false;
    }
}

// 运行检查
const checker = new PreCommitSecurityCheck();
const passed = checker.run();

process.exit(passed ? 0 : 1);