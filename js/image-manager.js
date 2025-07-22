/**
 * 图片管理器 - 负责管理场景与图片的关联关系
 */
class ImageManager {
    constructor() {
        this.imageMappings = {
            image_mappings: []
        };
        this.loadMappings();
    }
    
    /**
     * 生成图片预览HTML
     * @param {string} scenarioId - 场景ID
     * @param {string} size - 图片尺寸 (small, medium, large)
     * @returns {string} - 图片HTML
     */
    generateImagePreview(scenarioId, size = 'medium') {
        const imagePath = this.getImageForScenario(scenarioId);
        if (!imagePath) return '';
        
        // 对图片路径进行编码，确保中文字符正确处理
        const encodedPath = encodeURI(imagePath);
        
        const sizeClass = size === 'large' ? 'scenario-image-large' : 'scenario-image';
        
        return `
            <div class="${sizeClass}">
                <img src="${encodedPath}" alt="场景图片" loading="lazy" onerror="this.onerror=null; this.src='data/pic/default.png';">
            </div>
        `;
    }

    /**
     * 加载图片映射数据
     */
    loadMappings() {
        // 强制使用新的映射数据，忽略localStorage中的旧数据
        // 注释掉以下代码以确保使用新的映射数据
        /*
        const savedMappings = localStorage.getItem('imageMappings');
        if (savedMappings) {
            try {
                this.imageMappings = JSON.parse(savedMappings);
            } catch (e) {
                console.error('加载图片映射数据失败:', e);
                this.imageMappings = { image_mappings: [] };
            }
        } else {
        */
        // 始终使用新的映射数据
            // 初始化默认映射
            this.imageMappings = {
                image_mappings: [
                    {
                        scenario_id: "lunch_table",
                        scenario_title: "午餐时间",
                        image_path: "data/pic/社交排斥-午餐-1.png",
                        description: "一个学生独自坐在食堂的桌子旁，其他学生在远处指着他",
                        style: "Cartoon",
                        added_date: new Date().toISOString().split('T')[0]
                    },
                    {
                        scenario_id: "hallway_harassment",
                        scenario_title: "走廊骚扰",
                        image_path: "data/pic/言语欺凌-走廊骚扰.png",
                        description: "一个大学生在走廊里欺负一个小学生，周围有旁观者",
                        style: "Cartoon",
                        added_date: new Date().toISOString().split('T')[0]
                    },
                    {
                        scenario_id: "online_drama",
                        scenario_title: "网络纷争",
                        image_path: "data/pic/网络欺凌-社交媒体.png",
                        description: "一个学生看着手机上的恶意评论，表情很难过",
                        style: "Cartoon",
                        added_date: new Date().toISOString().split('T')[0]
                    },
                    {
                        scenario_id: "confrontation",
                        scenario_title: "对抗",
                        image_path: "data/pic/身体欺凌-校园暴力.png",
                        description: "一个大学生威胁一个小学生，要求交出零花钱",
                        style: "Cartoon",
                        added_date: new Date().toISOString().split('T')[0]
                    }
                ]
            };
            this.saveMappings();
        //}
    }

    /**
     * 保存图片映射数据到localStorage
     */
    saveMappings() {
        localStorage.setItem('imageMappings', JSON.stringify(this.imageMappings));
    }

    /**
     * 添加新的图片映射
     * @param {string} scenarioId - 场景ID
     * @param {string} imagePath - 图片路径
     * @param {string} description - 图片描述
     * @param {string} style - 图片风格
     * @returns {boolean} - 是否添加成功
     */
    addImageMapping(scenarioId, imagePath, description, style) {
        // 检查是否已存在该场景的映射
        const existingIndex = this.imageMappings.image_mappings.findIndex(
            m => m.scenario_id === scenarioId
        );

        // 获取场景标题
        let scenarioTitle = '';
        if (window.gameData && window.gameData.scenarios) {
            const scenario = window.gameData.scenarios.find(s => s.id === scenarioId);
            if (scenario) {
                scenarioTitle = scenario.title;
            }
        }

        const newMapping = {
            scenario_id: scenarioId,
            scenario_title: scenarioTitle || scenarioId,
            image_path: imagePath,
            description: description || '',
            style: style || 'Cartoon',
            added_date: new Date().toISOString().split('T')[0]
        };

        if (existingIndex >= 0) {
            // 更新现有映射
            this.imageMappings.image_mappings[existingIndex] = newMapping;
        } else {
            // 添加新映射
            this.imageMappings.image_mappings.push(newMapping);
        }

        this.saveMappings();
        return true;
    }

    /**
     * 获取场景对应的图片路径
     * @param {string} scenarioId - 场景ID
     * @returns {string|null} - 图片路径，如果没有则返回null
     */
    getImageForScenario(scenarioId) {
        const mapping = this.imageMappings.image_mappings.find(
            m => m.scenario_id === scenarioId
        );
        return mapping ? mapping.image_path : null;
    }

    /**
     * 获取图片统计信息
     * @returns {Object} - 统计信息
     */
    getImageStats() {
        const mappings = this.imageMappings.image_mappings;
        
        // 获取所有分类
        const categories = new Set();
        mappings.forEach(m => {
            if (window.gameData && window.gameData.scenarios) {
                const scenario = window.gameData.scenarios.find(s => s.id === m.scenario_id);
                if (scenario && scenario.category) {
                    categories.add(scenario.category);
                }
            }
        });
        
        // 获取所有风格
        const styles = [...new Set(mappings.map(m => m.style))];
        
        // 获取最近添加的图片（最多5个）
        const recentAdditions = [...mappings]
            .sort((a, b) => new Date(b.added_date) - new Date(a.added_date))
            .slice(0, 5);
        
        return {
            total_images: mappings.length,
            categories: categories.size,
            styles: styles,
            recent_additions: recentAdditions
        };
    }
}

// 初始化图片管理器
window.imageManager = new ImageManager();

// 模拟游戏数据（如果不存在）
if (!window.gameData) {
    window.gameData = {
        scenarios: [
            {
                id: "lunch_table",
                title: "午餐时间",
                category: "社交排斥",
                difficulty: "简单"
            },
            {
                id: "hallway_harassment",
                title: "走廊骚扰",
                category: "言语欺凌",
                difficulty: "中等"
            },
            {
                id: "online_drama",
                title: "网络纷争",
                category: "网络欺凌",
                difficulty: "困难"
            },
            {
                id: "confrontation",
                title: "对抗",
                category: "身体欺凌",
                difficulty: "困难"
            }
        ]
    };
}