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
      window.gameData = this.gameData; // 设置全局gameData
      
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

    // 显示游戏主界面
    window.userSystem.showGameInterface();
  }

  // 显示主菜单
  showMainMenu() {
    const user = window.userSystem.user;
    const availableScenarios = window.userSystem.getAvailableScenarios(
      this.gameData.scenarios, 
      user.grade
    );

    const mainMenu = `
      <div class="doodle-container">
        <div class="doodle-title">英雄之旅</div>
        <div class="doodle-subtitle">欢迎回来，${user.grade}年级的小英雄！</div>
        
        <!-- 技能点显示 -->
        <div class="skill-points">
          <div class="skill-item">
            <div class="skill-icon">E</div>
            <div class="skill-value">${user.empathy}</div>
            <div>同理心</div>
          </div>
          <div class="skill-item">
            <div class="skill-icon">C</div>
            <div class="skill-value">${user.courage}</div>
            <div>勇气</div>
          </div>
          <div class="skill-item">
            <div class="skill-icon">W</div>
            <div class="skill-value">${user.wisdom}</div>
            <div>智慧</div>
          </div>
        </div>

        <!-- 进度信息 -->
        <div class="progress-section">
          <div class="progress-info">
            <span>场景进度: ${user.completed_scenarios.length}/${user.max_scenarios}</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(user.completed_scenarios.length / user.max_scenarios) * 100}%"></div>
            </div>
          </div>
          
          ${user.completed_scenarios.length > 0 ? 
            `<div class="replay-section">
              <button class="replay-all-btn" onclick="resetProgress()">重新挑战所有场景</button>
              <button class="homepage-btn" onclick="goToHomepage()">回到首页</button>
            </div>` : ''
          }
          
          ${user.completed_scenarios.length >= user.max_scenarios ? 
            `<div class="completion-notice">
              <p>🎉 恭喜！你已完成所有场景！</p>
            </div>` : ''
          }
        </div>

        <!-- 场景列表 -->
        <div class="scenarios-list">
          <h3>${user.completed_scenarios.length >= user.max_scenarios ? '已完成的冒险' : '选择你的挑战'}</h3>
          ${availableScenarios.map(scenario => this.renderScenarioCard(scenario)).join('')}
        </div>

        <!-- 底部信息 -->
        <div class="footer-info">
          <p>提示：每个场景都会帮助你提升不同的技能！</p>
          <p>有问题？关注微信公众号《摸鱼读书》</p>
        </div>
      </div>
    `;

    document.getElementById('app').innerHTML = mainMenu;
    this.bindScenarioEvents();
  }

  // 渲染场景卡片
  renderScenarioCard(scenario) {
    const isCompleted = window.userSystem.user.completed_scenarios.includes(scenario.id);
    
    let statusIcon, statusClass, actionButton;
    
    if (isCompleted) {
      statusIcon = '✅';
      statusClass = 'completed';
      // 已完成的场景只显示"已完成"状态
      actionButton = `<div class="completed-status">已完成</div>`;
    } else {
      statusIcon = '🆕';
      statusClass = 'new';
      actionButton = `<button class="start-btn" data-scenario-id="${scenario.id}">开始挑战</button>`;
    }
    
    // 使用图片管理器获取场景图片
    const imageHtml = window.imageManager ? 
      window.imageManager.generateImagePreview(scenario.id, 'medium') : 
      (scenario.image ? 
        `<div class="scenario-image">
          <img src="${scenario.image}" alt="${scenario.title}" loading="lazy">
        </div>` : '');
    
    return `
      <div class="scenario-card ${statusClass}" data-scenario-id="${scenario.id}">
        <div class="scenario-header">
          <div class="scenario-title">
            ${statusIcon} ${scenario.title}
          </div>
          <div class="scenario-meta">
            <span class="difficulty ${scenario.difficulty.toLowerCase()}">${scenario.difficulty}</span>
            <span class="category">${scenario.category}</span>
          </div>
        </div>
        
        ${imageHtml}
        
        <div class="scenario-description">
          ${scenario.description}
        </div>
        
        <div class="scenario-actions">
          ${actionButton}
        </div>
      </div>
    `;
  }

  // 绑定场景事件
  bindScenarioEvents() {
    // 开始挑战按钮
    document.querySelectorAll('.start-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scenarioId = e.target.dataset.scenarioId;
        this.startScenario(scenarioId);
      });
    });
    
    // 重新挑战按钮
    document.querySelectorAll('.replay-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scenarioId = e.target.dataset.scenarioId;
        this.replayScenario(scenarioId);
      });
    });
  }

  // 重新挑战场景
  replayScenario(scenarioId) {
    const confirmReset = confirm('重新挑战将重置所有进度和成就，确定要继续吗？');
    if (confirmReset) {
      // 重置用户进度
      window.userSystem.resetUserProgress();
      
      // 开始场景
      this.startScenario(scenarioId);
    }
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
    
    // 使用图片管理器获取场景图片
    const imageHtml = window.imageManager ? 
      window.imageManager.generateImagePreview(scenario.id, 'large') : 
      (scenario.image ? 
        `<div class="scenario-image-large">
          <img src="${scenario.image}" alt="${scenario.title}" loading="lazy">
        </div>` : '');
    
    const scenarioView = `
      <div class="doodle-container">
        <div class="doodle-title">${scenario.title}</div>
        <div class="scenario-content">
          ${imageHtml}
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
              ${choice.points.empathy !== 0 ? `<div>同理心: ${choice.points.empathy > 0 ? '+' : ''}${choice.points.empathy}</div>` : ''}
              ${choice.points.courage !== 0 ? `<div>勇气: ${choice.points.courage > 0 ? '+' : ''}${choice.points.courage}</div>` : ''}
              ${choice.points.wisdom !== 0 ? `<div>智慧: ${choice.points.wisdom > 0 ? '+' : ''}${choice.points.wisdom}</div>` : ''}
            </div>
          </div>
          
          <div class="learning-moment">
            <h3>学习要点</h3>
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
        window.userSystem.clearUserData();
      });
    }
  }

  // 显示错误
  showError(message) {
    const errorView = `
      <div class="doodle-container">
        <div class="doodle-title">出错了</div>
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