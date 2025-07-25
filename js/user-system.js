// 用户系统管理
class UserSystem {
  constructor() {
    this.user = null;
    this.maxScenariosPerGrade = 10; // 每个年级最多10个场景
    this.init();
  }

  // 初始化用户系统
  init() {
    this.loadUser();
    if (!this.user) {
      this.showHomePage();
    }
  }

  // 显示真正的首页（紧凑化版本）
  showHomePage() {
    const homePage = `
      <div class="homepage-container">
        <div class="homepage-content">
          <div id="homepage-card"></div>
          <div id="grade-selection"></div>
          <div id="tip-card"></div>
        </div>
      </div>
    `;

    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = homePage;

      // 渲染首页综合卡片（包含欢迎信息和三个特性）
      document.getElementById('homepage-card').innerHTML = UIComponents.renderHomepageCard(
        '欢迎来到反霸凌小英雄！',
        '<p>你即将踏上一段重要的旅程，成为一个对抗欺凌的英雄。通过互动场景，你将学习如何识别、预防和应对欺凌情况。</p>',
        [
          {
            title: '培养同理心',
            description: '学习理解和关心他人的感受',
            iconName: 'empathy'
          },
          {
            title: '展现勇气',
            description: '我们为勇于正直的事情站出来',
            iconName: 'courage'
          },
          {
            title: '结交朋友',
            description: '创建一个支持性和包容性的环境',
            iconName: 'social'
          }
        ],
        'primary'
      );

      // 渲染年级选择卡片
      document.getElementById('grade-selection').innerHTML = UIComponents.renderGradeSelectionCard(
        '选择你的年级',
        '这样我们可以为你提供最适合的场景',
        ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
        null,
        'selectGrade',
        'secondary'
      );

      // 渲染提示卡片
      document.getElementById('tip-card').innerHTML = UIComponents.renderTipCard(
        '记住：每个英雄都始于一个勇敢的行动。你拥有改变力量！',
        'star',
        'warning'
      );

      this.bindGradeSelectionEvents();
    } else {
      console.error('找不到app元素');
    }
  }

  // 显示游戏主界面（紧凑化优化版本）
  showGameInterface() {
    const gameInterface = `
      <div class="game-interface-container compact">
        <div class="game-interface compact">
          <div class="user-info compact">
            <h2>${this.user.grade}年级小英雄</h2>
          </div>
          
          <div class="skill-points compact">
            <div class="skill-item">
              <div class="skill-icon">${UIComponents.renderIcon('empathy', 'medium')}</div>
              <div class="skill-content">
                <div class="skill-value">${this.user.empathy}</div>
                <div class="skill-name">同理心</div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-icon">${UIComponents.renderIcon('courage', 'medium')}</div>
              <div class="skill-content">
                <div class="skill-value">${this.user.courage}</div>
                <div class="skill-name">勇气</div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-icon">${UIComponents.renderIcon('wisdom', 'medium')}</div>
              <div class="skill-content">
                <div class="skill-value">${this.user.wisdom}</div>
                <div class="skill-name">智慧</div>
              </div>
            </div>
          </div>
          
          <div class="progress-section compact">
            <div class="progress-info">
              <span>进度: ${this.user.completed_scenarios.length}/${this.maxScenariosPerGrade}</span>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(this.user.completed_scenarios.length / this.maxScenariosPerGrade) * 100}%"></div>
              </div>
            </div>
            
            ${this.user.completed_scenarios.length > 0 ?
        `<div class="replay-section compact">
                ${UIComponents.renderButton('重新挑战', 'resetProgress()', 'danger', 'small')}
                ${UIComponents.renderButton('回到首页', 'goToHomepage()', 'secondary', 'small')}
              </div>` : ''
      }
          </div>
        </div>
        
        <!-- 场景轮播容器 - 直接集成到主界面 -->
        <div id="scenario-carousel-container">
          <!-- 场景轮播将通过卡片轮播组件动态加载 -->
        </div>
      </div>
    `;

    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = gameInterface;

      // 加载场景列表
      if (window.gameEngine && window.gameEngine.gameData) {
        this.loadScenariosList();
      }
    } else {
      console.error('找不到app元素');
    }
  }

  // 加载场景列表
  loadScenariosList() {
    if (!this.user || !window.gameEngine || !window.gameEngine.gameData) return;

    let availableScenarios = this.getAvailableScenarios(
      window.gameEngine.gameData.scenarios,
      this.user.grade
    );

    // 尝试恢复之前的轮播状态（避免重新排序）
    availableScenarios = this.restoreCarouselState(availableScenarios);

    // 查找场景轮播容器
    const carouselContainer = document.getElementById('scenario-carousel-container');
    if (carouselContainer) {
      // 调试信息
      console.log('加载场景列表，用户完成的场景:', this.user.completed_scenarios);
      console.log('可用场景数量:', availableScenarios.length);

      // 初始化卡片轮播
      setTimeout(() => {
        // 检查是否有保存的轮播状态
        const hasRestoredState = this.tempCarouselState !== null && this.tempCarouselState !== undefined;
        
        if (hasRestoredState) {
          const savedIndex = (this.tempCarouselState && this.tempCarouselState.currentIndex) || 0;
          window.cardCarousel = new CardCarousel(availableScenarios, true); // 跳过初始排序
          window.cardCarousel.currentIndex = Math.min(savedIndex, availableScenarios.length - 1);
          this.tempCarouselState = null; // 清除临时状态
        } else {
          window.cardCarousel = new CardCarousel(availableScenarios);
        }
        
        carouselContainer.innerHTML = window.cardCarousel.render();
        window.cardCarousel.updateCards();
      }, 100);
    }
  }

  // 绑定年级选择事件
  bindGradeSelectionEvents() {
    // 使用新的年级选择按钮
    window.selectGrade = (grade) => {
      if (!grade || typeof grade !== 'string') {
        console.error('无效的年级值:', grade);
        return;
      }

      // 处理中文年级名称
      const gradeMap = {
        '一年级': 1,
        '二年级': 2,
        '三年级': 3,
        '四年级': 4,
        '五年级': 5,
        '六年级': 6
      };

      if (gradeMap[grade]) {
        this.createUser(gradeMap[grade]);
      } else {
        // 尝试从字符串中提取数字作为备选方案
        const match = grade.match(/\d+/);
        if (!match) {
          console.error('无法从年级中提取数字:', grade);
          return;
        }

        const gradeNumber = parseInt(match[0]);
        this.createUser(gradeNumber);
      }
    };
  }

  // 创建新用户
  createUser(grade) {
    // 输入验证
    if (!grade || grade < 1 || grade > 6) {
      console.error('无效的年级值:', grade);
      return;
    }

    const uuid = this.generateUUID();
    this.user = {
      uuid: uuid,
      grade: parseInt(grade), // 确保为数字类型
      empathy: 0,
      courage: 0,
      wisdom: 0,
      completed_scenarios: [], // 确保初始化为空数组
      achievements: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      scenario_progress: 0, // 当前场景进度
      max_scenarios: this.maxScenariosPerGrade
    };

    this.saveUser();

    // 等待游戏数据加载完成后再显示游戏界面
    if (window.gameEngine && window.gameEngine.gameData) {
      this.showGameInterface();
    } else {
      // 如果游戏数据还没加载，等待一下
      setTimeout(() => {
        this.showGameInterface();
      }, 100);
    }
  }

  // 显示欢迎页面（优化UUID显示）
  showWelcomePage() {
    const welcomePage = `
      <div class="welcome-container">
        <div class="welcome-header">
          <h1>欢迎回来，${this.user.grade}年级的小英雄！</h1>
        </div>
        
        <div class="skill-points">
          <div class="skill-item">
            ${UIComponents.renderIcon('empathy', 'medium')}
            <div class="skill-value">${this.user.empathy}</div>
            <div>同理心</div>
          </div>
          <div class="skill-item">
            ${UIComponents.renderIcon('courage', 'medium')}
            <div class="skill-value">${this.user.courage}</div>
            <div>勇气</div>
          </div>
          <div class="skill-item">
            ${UIComponents.renderIcon('wisdom', 'medium')}
            <div class="skill-value">${this.user.wisdom}</div>
            <div>智慧</div>
          </div>
        </div>
        
        <div class="progress-info">
          <p>场景进度: ${this.user.completed_scenarios.length}/${this.maxScenariosPerGrade}</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(this.user.completed_scenarios.length / this.maxScenariosPerGrade) * 100}%"></div>
          </div>
        </div>
        
        <div class="welcome-actions">
          <button class="game-btn primary" onclick="startGame()">
            开始我的英雄之旅
          </button>
          <button class="game-btn secondary" onclick="restartGame()">
            重新开始
          </button>
        </div>
      </div>
    `;

    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = welcomePage;
    }
  }

  // 生成UUID
  generateUUID() {
    // 使用CoreUtils，如果不可用则使用内联实现
    if (window.CoreUtils) {
      return CoreUtils.generateUUID();
    }

    // 使用更安全的随机数生成
    if (window.crypto && window.crypto.getRandomValues) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = window.crypto.getRandomValues(new Uint8Array(1))[0] % 16;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    // 降级实现
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // 重置用户进度（重新挑战时调用）
  resetUserProgress() {
    if (this.user) {
      this.user.empathy = 0;
      this.user.courage = 0;
      this.user.wisdom = 0;
      this.user.completed_scenarios = [];
      this.user.achievements = [];
      this.user.scenario_progress = 0;
      this.user.max_scenarios = this.maxScenariosPerGrade; // 确保设置正确的值
      this.user.updated_at = new Date().toISOString();
      this.saveUser();
    }
  }

  // 检查是否可以开始新场景
  canStartNewScenario() {
    return this.user.completed_scenarios.length < this.maxScenariosPerGrade;
  }

  // 获取可用场景列表
  getAvailableScenarios(scenarios, grade) {
    const filteredScenarios = this.filterScenariosByGrade(scenarios, grade);

    // 如果已完成场景数量达到上限，只显示已完成的场景
    if (this.user.completed_scenarios.length >= this.maxScenariosPerGrade) {
      return filteredScenarios.filter(scenario =>
        this.user.completed_scenarios.includes(scenario.id)
      );
    }

    return filteredScenarios;
  }

  // 清除用户数据，返回首页
  clearUserData() {
    // 保存当前轮播状态（如果存在）
    const carouselState = this.saveCarouselState();
    
    // 使用CoreUtils存储，如果不可用则使用内联实现
    if (window.CoreUtils) {
      CoreUtils.storage.remove('bgh_user');
    } else {
      try {
        localStorage.removeItem('bgh_user');
      } catch (e) {
        console.warn('删除用户数据失败:', e);
      }
    }
    this.user = null;
    
    // 保存轮播状态到临时存储
    if (carouselState) {
      this.tempCarouselState = carouselState;
    }
    
    this.showHomePage();
  }

  // 保存轮播状态
  saveCarouselState() {
    if (window.cardCarousel && window.cardCarousel.scenarios) {
      return {
        scenarios: window.cardCarousel.scenarios.map(s => ({
          id: s.id,
          completed: s.completed
        })),
        currentIndex: window.cardCarousel.currentIndex,
        scenarioOrder: window.cardCarousel.scenarios.map(s => s.id)
      };
    }
    return null;
  }

  // 恢复轮播状态
  restoreCarouselState(availableScenarios) {
    if (!this.tempCarouselState || !this.tempCarouselState.scenarioOrder) {
      return availableScenarios;
    }
    
    const savedState = this.tempCarouselState;
    
    // 按照保存的顺序重新排列场景
    const orderedScenarios = [];
    const scenarioMap = new Map(availableScenarios.map(s => [s.id, s]));
    
    // 首先按保存的顺序添加场景
    if (savedState.scenarioOrder && Array.isArray(savedState.scenarioOrder)) {
      savedState.scenarioOrder.forEach(scenarioId => {
        const scenario = scenarioMap.get(scenarioId);
        if (scenario) {
          orderedScenarios.push(scenario);
          scenarioMap.delete(scenarioId);
        }
      });
    }
    
    // 添加任何新的场景到末尾
    scenarioMap.forEach(scenario => {
      orderedScenarios.push(scenario);
    });
    
    return orderedScenarios;
  }

  // 显示用户ID
  showUserID() {
    const userIDDisplay = `
      <div class="user-id-container">
        <h2>你的英雄ID</h2>
        <div class="user-id-box">
          <code>${this.user.uuid}</code>
          <button class="game-btn primary" onclick="navigator.clipboard.writeText('${this.user.uuid}')">
            复制ID
          </button>
        </div>
        <p class="user-id-tip">
          请保存这个ID，这样你以后可以查看自己的成就！
        </p>
        <button class="game-btn primary" onclick="startGame()">
          开始我的英雄之旅
        </button>
      </div>
    `;

    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = userIDDisplay;
    }
  }

  // 保存用户数据
  saveUser() {
    // 使用CoreUtils存储，如果不可用则使用内联实现
    if (window.CoreUtils) {
      CoreUtils.storage.set('bgh_user', this.user);
    } else {
      try {
        localStorage.setItem('bgh_user', JSON.stringify(this.user));
      } catch (e) {
        console.warn('保存用户数据失败:', e);
      }
    }

    // 同步到 Supabase（如果可用）
    if (window.supabaseClient && window.supabaseClient.isInitialized) {
      window.supabaseClient.saveUser(this.user).catch(error => {
        console.warn('Supabase同步失败:', error);
      });
    }
  }

  // 加载用户数据
  loadUser() {
    let savedUser;

    // 使用CoreUtils存储，如果不可用则使用内联实现
    if (window.CoreUtils) {
      savedUser = CoreUtils.storage.get('bgh_user');
    } else {
      try {
        const item = localStorage.getItem('bgh_user');
        savedUser = item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn('读取用户数据失败:', e);
        savedUser = null;
      }
    }

    if (savedUser) {
      this.user = savedUser;
      // 兼容性修复：确保用户数据包含必要的属性
      if (this.user) {
        if (!this.user.max_scenarios) {
          this.user.max_scenarios = this.maxScenariosPerGrade;
        }
        if (!this.user.completed_scenarios) {
          this.user.completed_scenarios = [];
        }
        if (!this.user.achievements) {
          this.user.achievements = [];
        }
        this.saveUser();
      }
    }
  }

  // 获取用户年级
  getUserGrade() {
    return this.user ? this.user.grade : null;
  }

  // 根据年级过滤场景
  filterScenariosByGrade(scenarios, grade) {
    return scenarios.filter(scenario => {
      const [minGrade, maxGrade] = scenario.grade_range;
      return grade >= minGrade && grade <= maxGrade;
    });
  }

  // 更新用户进度
  updateProgress(scenarioId, points) {
    if (!this.user) return;

    this.user.empathy += points.empathy || 0;
    this.user.courage += points.courage || 0;
    this.user.wisdom += points.wisdom || 0;

    if (!this.user.completed_scenarios.includes(scenarioId)) {
      this.user.completed_scenarios.push(scenarioId);
    }

    this.user.updated_at = new Date().toISOString();
    this.saveUser();
  }

  // 检查成就
  checkAchievements() {
    if (!window.gameData || !window.gameData.achievements) {
      console.warn('游戏数据未加载，跳过成就检查');
      return;
    }

    const achievements = window.gameData.achievements;
    const newAchievements = [];

    achievements.forEach(achievement => {
      if (!this.user.achievements.includes(achievement.id)) {
        if (this.evaluateCondition(achievement.condition)) {
          newAchievements.push(achievement);
          this.user.achievements.push(achievement.id);
        }
      }
    });

    if (newAchievements.length > 0) {
      this.saveUser();
      this.showAchievementNotification(newAchievements);
    }
  }

  // 评估成就条件
  evaluateCondition(condition) {
    // 简单的条件评估
    const user = this.user;
    const conditions = {
      'completed_scenarios >= 1': user.completed_scenarios.length >= 1,
      'empathy >= 10': user.empathy >= 10,
      'courage >= 8': user.courage >= 8,
      'wisdom >= 8': user.wisdom >= 8,
      'empathy >= 15 && courage >= 15 && wisdom >= 15':
        user.empathy >= 15 && user.courage >= 15 && user.wisdom >= 15,
      'completed_scenarios >= 4': user.completed_scenarios.length >= 4
    };

    return conditions[condition] || false;
  }

  // 显示成就通知
  showAchievementNotification(achievements) {
    achievements.forEach(achievement => {
      UIComponents.renderNotification(`解锁成就：${achievement.title}`, 'success', 3000);
    });
  }
}

// 全局用户系统实例
window.userSystem = new UserSystem();

// 全局函数：复制用户ID
window.copyUserID = async function () {
  if (window.userSystem && window.userSystem.user) {
    const userID = window.userSystem.user.uuid;

    let success = false;

    // 优先使用ClipboardUtils
    if (window.ClipboardUtils) {
      success = await ClipboardUtils.copyToClipboard(userID);
    } else if (window.CoreUtils) {
      success = await CoreUtils.copyToClipboard(userID);
    } else {
      // 最后降级实现
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(userID);
          success = true;
        } catch (e) {
          console.warn('现代剪贴板API失败');
        }
      }

      if (!success) {
        const textArea = document.createElement('textarea');
        textArea.value = userID;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          // 使用现代剪贴板API替代废弃的execCommand
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(userID);
            success = true;
          } else {
            success = false;
          }
        } catch (err) {
          success = false;
        }
        document.body.removeChild(textArea);
      }
    }

    if (success) {
      if (window.UIComponents) {
        UIComponents.renderNotification('用户ID已复制到剪贴板', 'success', 2000);
      } else {
        alert('用户ID已复制到剪贴板');
      }
    } else {
      if (window.UIComponents) {
        UIComponents.renderNotification('复制失败，请手动复制用户ID', 'warning', 3000);
      } else {
        alert('复制失败，请手动复制：' + userID);
      }
    }
  }
};

// 全局函数：重置进度
window.resetProgress = function () {
  if (window.userSystem && confirm('确定要重新开始吗？这将清除你的所有进度。')) {
    window.userSystem.resetUserProgress();
    window.userSystem.showGameInterface();
    UIComponents.renderNotification('进度已重置，开始新的英雄之旅！', 'info', 3000);
  }
};

// 全局函数：回到首页
window.goToHomepage = function () {
  if (window.userSystem) {
    window.userSystem.clearUserData();
  }
}; 
