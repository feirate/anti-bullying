// 用户系统管理
class UserSystem {
  constructor() {
    this.user = null;
    this.init();
  }

  // 初始化用户系统
  init() {
    this.loadUser();
    if (!this.user) {
      this.showGradeSelection();
    }
  }

  // 显示年级选择界面
  showGradeSelection() {
    const gradeSelection = `
      <div class="grade-selection-container">
        <h2>选择你的年级</h2>
        <p>这样我们可以为你推荐最适合的场景</p>
        <div class="grade-buttons">
          <button class="grade-btn" data-grade="1">一年级</button>
          <button class="grade-btn" data-grade="2">二年级</button>
          <button class="grade-btn" data-grade="3">三年级</button>
          <button class="grade-btn" data-grade="4">四年级</button>
          <button class="grade-btn" data-grade="5">五年级</button>
          <button class="grade-btn" data-grade="6">六年级</button>
        </div>
      </div>
    `;
    
    document.body.innerHTML = gradeSelection;
    this.bindGradeSelectionEvents();
  }

  // 绑定年级选择事件
  bindGradeSelectionEvents() {
    const gradeButtons = document.querySelectorAll('.grade-btn');
    gradeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const grade = parseInt(e.target.dataset.grade);
        this.createUser(grade);
      });
    });
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
      updated_at: new Date().toISOString()
    };
    
    this.saveUser();
    this.showUserID();
  }

  // 生成UUID
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // 显示用户ID
  showUserID() {
    const userIDDisplay = `
      <div class="user-id-container">
        <h2>你的英雄ID</h2>
        <div class="user-id-box">
          <code>${this.user.uuid}</code>
          <button class="copy-btn" onclick="navigator.clipboard.writeText('${this.user.uuid}')">
            复制ID
          </button>
        </div>
        <p class="user-id-tip">
          💡 请保存这个ID，这样你以后可以查看自己的成就！
        </p>
        <button class="start-game-btn" onclick="startGame()">
          开始我的英雄之旅
        </button>
      </div>
    `;
    
    document.body.innerHTML = userIDDisplay;
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
      const notification = `
        <div class="achievement-notification">
          <h3>🎉 解锁成就：${achievement.title}</h3>
          <p>${achievement.description}</p>
        </div>
      `;
      
      // 显示通知
      const notificationContainer = document.createElement('div');
      notificationContainer.innerHTML = notification;
      document.body.appendChild(notificationContainer);
      
      // 3秒后自动移除
      setTimeout(() => {
        notificationContainer.remove();
      }, 3000);
    });
  }
}

// 全局用户系统实例
window.userSystem = new UserSystem(); 