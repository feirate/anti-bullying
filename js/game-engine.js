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
    // 使用新的UI组件库渲染场景卡片
    if (window.UIComponents && typeof window.UIComponents.renderScenarioCard === 'function') {
      const isCompleted = window.userSystem.user.completed_scenarios.includes(scenario.id);
      return window.UIComponents.renderScenarioCard(scenario, isCompleted);
    }

    // 如果新的UI组件库不可用，使用旧的渲染方式
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
    // 开始挑战按钮 - 使用场景详情页模态框
    document.querySelectorAll('.start-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scenarioId = e.target.dataset.scenarioId;
        
        // 如果场景详情页功能可用，使用模态框显示
        if (window.showScenarioDetail && typeof window.showScenarioDetail === 'function') {
          window.showScenarioDetail(scenarioId);
        } else {
          // 否则使用原来的方式
          this.startScenario(scenarioId);
        }
      });
    });
    
    // 场景卡片点击事件 - 也使用场景详情页模态框
    document.querySelectorAll('.scenario-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // 如果点击的是按钮，不处理卡片点击事件
        if (e.target.closest('.start-btn, .completed-status')) {
          return;
        }
        
        const scenarioId = card.dataset.scenarioId;
        if (scenarioId && window.showScenarioDetail && typeof window.showScenarioDetail === 'function') {
          window.showScenarioDetail(scenarioId);
        }
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

    // 使用新的UI组件库渲染场景详情页
    if (window.UIComponents && typeof window.UIComponents.renderScenarioDetail === 'function') {
      // 使用新的场景详情页组件
      const scenarioDetailHtml = window.UIComponents.renderScenarioDetail(scenario);

      const scenarioView = `
        <div class="scenario-container">
          ${scenarioDetailHtml}
        </div>
      `;

      document.getElementById('app').innerHTML = scenarioView;
      this.bindChoiceEvents();
      return;
    }

    // 如果新的UI组件库不可用，使用旧的渲染方式
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
    // 绑定选择按钮事件
    const choiceButtons = document.querySelectorAll('.choice-btn, .game-btn.primary.full-width, .game-btn.outline.primary.full-width');
    choiceButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // 尝试从按钮的data属性获取choiceId
        const choiceId = e.target.dataset.choiceId;

        // 如果没有data属性，尝试从onclick属性中提取
        if (!choiceId && e.target.getAttribute('onclick')) {
          const onclickAttr = e.target.getAttribute('onclick');
          const match = onclickAttr.match(/selectChoice\('(.+?)'\)/);
          if (match && match[1]) {
            this.makeChoice(match[1]);
            return;
          }
        }

        if (choiceId) {
          this.makeChoice(choiceId);
        }
      });
    });

    // 绑定返回按钮事件
    const backButtons = document.querySelectorAll('.back-btn, .scenario-detail-back');
    backButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.showMainMenu();
      });
    });
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
    const scenario = this.currentScenario;

    // 使用新的UI组件库渲染结果页
    if (window.UIComponents && typeof window.UIComponents.renderButton === 'function') {
      // 设置背景颜色
      let headerColor;
      switch (scenario.difficulty) {
        case "简单":
          headerColor = 'var(--secondary-color)';
          break;
        case "中等":
          headerColor = 'var(--warning-color)';
          break;
        case "困难":
          headerColor = 'var(--danger-color)';
          break;
        default:
          headerColor = 'var(--secondary-color)';
      }

      const resultView = `
        <div class="scenario-detail">
          <div class="scenario-detail-header" style="background-color: ${headerColor};">
            <div class="scenario-detail-title">${scenario.title}</div>
            <div class="scenario-detail-meta">
              <span class="game-badge">${scenario.difficulty}</span>
              <span class="game-badge">${scenario.category}</span>
            </div>
          </div>
          <div class="scenario-detail-image">
            <img src="${scenario.image}" alt="${scenario.title}">
          </div>
          <div class="scenario-detail-content">
            <div class="scenario-detail-description">
              <h3>你选择了: ${choice.text}</h3>
              <p>${choice.feedback}</p>
              
              <div class="points-earned" style="margin-top: 20px;">
                <h4>获得的技能点：</h4>
                <div class="points-list">
                  ${choice.points.empathy !== 0 ? `<div>同理心: ${choice.points.empathy > 0 ? '+' : ''}${choice.points.empathy}</div>` : ''}
                  ${choice.points.courage !== 0 ? `<div>勇气: ${choice.points.courage > 0 ? '+' : ''}${choice.points.courage}</div>` : ''}
                  ${choice.points.wisdom !== 0 ? `<div>智慧: ${choice.points.wisdom > 0 ? '+' : ''}${choice.points.wisdom}</div>` : ''}
                </div>
              </div>
              
              <div style="margin-top: 20px;">
                <h4>学习要点:</h4>
                <p>${scenario.learning_moment}</p>
              </div>
            </div>
          </div>
          <div class="scenario-detail-actions">
            ${window.UIComponents.renderButton('继续下一个场景', "gameEngine.showMainMenu()", 'primary', 'medium')}
            ${window.UIComponents.renderButton('返回主页', "window.location.href='index.html'", 'success', 'medium', 'home')}
          </div>
        </div>
      `;

      document.getElementById('app').innerHTML = resultView;
      return;
    }

    // 如果新的UI组件库不可用，使用旧的渲染方式
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
    // 绑定继续按钮事件
    const continueButtons = document.querySelectorAll('.continue-btn, .game-btn.primary');
    continueButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.showMainMenu();
      });
    });

    // 绑定返回主菜单按钮事件
    const menuButtons = document.querySelectorAll('.menu-btn, .game-btn.success');
    menuButtons.forEach(btn => {
      if (btn.textContent.includes('返回主页')) {
        // 如果是返回主页按钮，不需要绑定事件，因为已经设置了href
        return;
      }

      btn.addEventListener('click', () => {
        window.userSystem.clearUserData();
      });
    });
  }

  // 显示错误
  showError(message) {
    // 使用新的UI组件库渲染错误页面
    if (window.UIComponents && typeof window.UIComponents.renderButton === 'function') {
      const errorView = `
        <div class="scenario-detail">
          <div class="scenario-detail-header" style="background-color: var(--danger-color);">
            <div class="scenario-detail-title">出错了</div>
          </div>
          <div class="scenario-detail-content">
            <div class="scenario-detail-description">
              <p>${message}</p>
            </div>
          </div>
          <div class="scenario-detail-actions">
            ${window.UIComponents.renderButton('重试', "gameEngine.showMainMenu()", 'primary', 'medium')}
            ${window.UIComponents.renderButton('返回主页', "window.location.href='index.html'", 'success', 'medium', 'home')}
          </div>
        </div>
      `;

      document.getElementById('app').innerHTML = errorView;
      return;
    }

    // 如果新的UI组件库不可用，使用旧的渲染方式
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