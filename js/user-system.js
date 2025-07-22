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

  // 显示真正的首页（仅游戏介绍和年级选择）
  showHomePage() {
    const homePage = `
      <div class="homepage-container">
        <div class="hero-section">
          <h1 class="hero-title">反霸凌小英雄</h1>
          <p class="hero-subtitle">学习站出来并说出来</p>
        </div>
        
        <div id="homepage-card"></div>
        
        <div id="grade-selection"></div>
        
        <div id="tip-card"></div>
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

  // 显示游戏主界面（截图2内容）
  showGameInterface() {
    const gameInterface = `
      <div class="game-interface-container">
        <div class="game-interface">
          <div class="user-info">
            <h2>欢迎回来，${this.user.grade}年级的小英雄！</h2>
            <div class="user-id-display" title="点击复制用户ID" onclick="copyUserID()">
              <span class="user-id-text">ID: ${this.user.uuid}</span>
              <span class="copy-hint">点击复制</span>
            </div>
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
          
          <div class="progress-section">
            <div class="progress-info">
              <span>场景进度: ${this.user.completed_scenarios.length}/${this.maxScenariosPerGrade}</span>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(this.user.completed_scenarios.length / this.maxScenariosPerGrade) * 100}%"></div>
              </div>
            </div>
            
            ${this.user.completed_scenarios.length > 0 ? 
              `<div class="replay-section">
                <button class="game-btn primary" onclick="resetProgress()">重新挑战所有场景</button>
                <button class="game-btn secondary" onclick="goToHomepage()">回到首页</button>
              </div>` : ''
            }
          </div>
          
          <div class="scenarios-section">
            <h3>选择你的挑战</h3>
            <div id="scenarios-list">
              <!-- 场景列表将通过游戏引擎动态加载 -->
            </div>
          </div>
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
    
    const availableScenarios = this.getAvailableScenarios(
      window.gameEngine.gameData.scenarios, 
      this.user.grade
    );
    
    const scenariosList = document.getElementById('scenarios-list');
    if (scenariosList) {
      scenariosList.innerHTML = availableScenarios.map(scenario => 
        window.gameEngine.renderScenarioCard(scenario)
      ).join('');
      window.gameEngine.bindScenarioEvents();
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
    const uuid = this.generateUUID();
    this.user = {
      uuid: uuid,
      grade: grade,
      empathy: 0,
      courage: 0,
      wisdom: 0,
      completed_scenarios: [],
      achievements: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      scenario_progress: 0, // 当前场景进度
      max_scenarios: this.maxScenariosPerGrade
    };
    
    this.saveUser();
    // 直接跳转到游戏主界面（截图2）
    this.showGameInterface();
  }

  // 显示欢迎页面（优化UUID显示）
  showWelcomePage() {
    const welcomePage = `
      <div class="welcome-container">
        <div class="welcome-header">
          <h1>欢迎回来，${this.user.grade}年级的小英雄！</h1>
          <div class="user-id-display" title="点击复制用户ID" onclick="copyUserID()">
            <span class="user-id-text">ID: ${this.user.uuid}</span>
            <span class="copy-hint">点击复制</span>
          </div>
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
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
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
    localStorage.removeItem('bgh_user');
    this.user = null;
    this.showHomePage();
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
    localStorage.setItem('bgh_user', JSON.stringify(this.user));
    // TODO: 同步到 Supabase
  }

  // 加载用户数据
  loadUser() {
    const savedUser = localStorage.getItem('bgh_user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      // 兼容性修复：确保用户数据包含必要的属性
      if (this.user && !this.user.max_scenarios) {
        this.user.max_scenarios = this.maxScenariosPerGrade;
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