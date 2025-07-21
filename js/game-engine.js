// 游戏引擎
class GameEngine {
  constructor() {
    this.currentScenario = null;
    this.gameData = null;
    this.init();
  }

  // 初始化游戏引擎
  async init() {
    try {
      // 加载游戏数据
      const response = await fetch('data/scenarios.json');
      this.gameData = await response.json();
      
      // 加载联系方式
      const contactResponse = await fetch('data/contact-info.json');
      const contactData = await contactResponse.json();
      window.contactInfo = contactData;
      
      console.log('游戏数据加载成功');
      this.startGame();
    } catch (error) {
      console.error('游戏数据加载失败:', error);
      this.showError('游戏数据加载失败，请刷新页面重试');
    }
  }

  // 开始游戏
  startGame() {
    const user = window.userSystem.user;
    if (!user) {
      console.log('等待用户选择年级...');
      return;
    }

    this.showMainMenu();
  }

  // 显示主菜单
  showMainMenu() {
    const user = window.userSystem.user;
    const filteredScenarios = window.userSystem.filterScenariosByGrade(
      this.gameData.scenarios, 
      user.grade
    );

    const mainMenu = `
      <div class="doodle-container">
        <div class="doodle-title">🛡️ 英雄之旅</div>
        <div class="doodle-subtitle">欢迎回来，${user.grade}年级的小英雄！</div>
        
        <!-- 技能点显示 -->
        <div class="skill-points">
          <div class="skill-item">
            <div class="skill-icon">💙</div>
            <div class="skill-value">${user.empathy}</div>
            <div>同理心</div>
          </div>
          <div class="skill-item">
            <div class="skill-icon">💪</div>
            <div class="skill-value">${user.courage}</div>
            <div>勇气</div>
          </div>
          <div class="skill-item">
            <div class="skill-icon">🧠</div>
            <div class="skill-value">${user.wisdom}</div>
            <div>智慧</div>
          </div>
        </div>

        <!-- 场景列表 -->
        <div class="scenarios-list">
          <h3>选择你的挑战</h3>
          ${filteredScenarios.map(scenario => this.renderScenarioCard(scenario)).join('')}
        </div>

        <!-- 底部信息 -->
        <div class="footer-info">
          <p>💡 提示：每个场景都会帮助你提升不同的技能！</p>
          <p>📞 有问题？关注微信公众号《摸鱼读书》</p>
        </div>
      </div>
    `;

    document.getElementById('app').innerHTML = mainMenu;
    this.bindScenarioEvents();
  }

  // 渲染场景卡片
  renderScenarioCard(scenario) {
    const isCompleted = window.userSystem.user.completed_scenarios.includes(scenario.id);
    const statusIcon = isCompleted ? '✅' : '🆕';
    const statusClass = isCompleted ? 'completed' : 'new';
    
    return `
      <div class="scenario-card ${statusClass}" data-scenario-id="${scenario.id}">
        <div class="scenario-title">
          ${statusIcon} ${scenario.title}
        </div>
        <div class="scenario-description">
          ${scenario.description}
        </div>
        <div class="scenario-meta">
          <span class="difficulty">难度：${scenario.difficulty}</span>
          <span class="category">类型：${scenario.category}</span>
        </div>
        <button class="doodle-btn start-scenario-btn" data-scenario-id="${scenario.id}">
          ${isCompleted ? '重新挑战' : '开始挑战'}
        </button>
      </div>
    `;
  }

  // 绑定场景事件
  bindScenarioEvents() {
    const scenarioButtons = document.querySelectorAll('.start-scenario-btn');
    scenarioButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scenarioId = e.target.dataset.scenarioId;
        this.startScenario(scenarioId);
      });
    });
  }

  // 开始场景
  startScenario(scenarioId) {
    const scenario = this.gameData.scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      this.showError('场景不存在');
      return;
    }

    this.currentScenario = scenario;
    this.showScenario();
  }

  // 显示场景
  showScenario() {
    const scenario = this.currentScenario;
    
    const scenarioView = `
      <div class="doodle-container">
        <div class="doodle-title">${scenario.title}</div>
        <div class="scenario-content">
          <div class="scenario-description">
            ${scenario.description}
          </div>
          <div class="scenario-situation">
            <strong>${scenario.situation}</strong>
          </div>
          
          <div class="choices-container">
            <h3>你会怎么做？</h3>
            ${scenario.choices.map((choice, index) => `
              <button class="choice-btn" data-choice-id="${choice.id}">
                ${index + 1}. ${choice.text}
              </button>
            `).join('')}
          </div>
        </div>
        
        <button class="doodle-btn back-btn">返回主菜单</button>
      </div>
    `;

    document.getElementById('app').innerHTML = scenarioView;
    this.bindChoiceEvents();
  }

  // 绑定选择事件
  bindChoiceEvents() {
    const choiceButtons = document.querySelectorAll('.choice-btn');
    choiceButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const choiceId = e.target.dataset.choiceId;
        this.makeChoice(choiceId);
      });
    });

    const backButton = document.querySelector('.back-btn');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.showMainMenu();
      });
    }
  }

  // 做出选择
  makeChoice(choiceId) {
    const scenario = this.currentScenario;
    const choice = scenario.choices.find(c => c.id === choiceId);
    
    if (!choice) {
      this.showError('选择无效');
      return;
    }

    // 更新用户进度
    window.userSystem.updateProgress(scenario.id, choice.points);
    
    // 检查成就
    window.userSystem.checkAchievements();
    
    // 显示结果
    this.showChoiceResult(choice);
  }

  // 显示选择结果
  showChoiceResult(choice) {
    const resultView = `
      <div class="doodle-container">
        <div class="doodle-title">选择结果</div>
        <div class="choice-result">
          <div class="feedback">
            ${choice.feedback}
          </div>
          
          <div class="points-earned">
            <h3>获得的技能点：</h3>
            <div class="points-list">
              ${choice.points.empathy !== 0 ? `<div>💙 同理心: ${choice.points.empathy > 0 ? '+' : ''}${choice.points.empathy}</div>` : ''}
              ${choice.points.courage !== 0 ? `<div>💪 勇气: ${choice.points.courage > 0 ? '+' : ''}${choice.points.courage}</div>` : ''}
              ${choice.points.wisdom !== 0 ? `<div>🧠 智慧: ${choice.points.wisdom > 0 ? '+' : ''}${choice.points.wisdom}</div>` : ''}
            </div>
          </div>
          
          <div class="learning-moment">
            <h3>💡 学习要点</h3>
            <p>${this.currentScenario.learning_moment}</p>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="doodle-btn continue-btn">继续下一个场景</button>
          <button class="doodle-btn menu-btn">返回主菜单</button>
        </div>
      </div>
    `;

    document.getElementById('app').innerHTML = resultView;
    this.bindResultEvents();
  }

  // 绑定结果事件
  bindResultEvents() {
    const continueBtn = document.querySelector('.continue-btn');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        this.showMainMenu();
      });
    }
    
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        this.showMainMenu();
      });
    }
  }

  // 显示错误
  showError(message) {
    const errorView = `
      <div class="doodle-container">
        <div class="doodle-title">❌ 出错了</div>
        <div class="error-message">
          ${message}
        </div>
        <button class="doodle-btn retry-btn">重试</button>
      </div>
    `;

    document.getElementById('app').innerHTML = errorView;
    
    const retryBtn = document.querySelector('.retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.showMainMenu();
      });
    }
  }
}

// 全局游戏引擎实例
window.gameEngine = new GameEngine(); 