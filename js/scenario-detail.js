/**
 * 场景详情页功能
 * 提供场景详情页的显示和交互功能
 */

// 当前选中的场景ID
let currentScenarioId = null;

/**
 * 显示场景详情
 * @param {string} scenarioId - 场景ID
 */
function showScenarioDetail(scenarioId) {
  // 获取场景数据
  const scenario = window.gameData?.scenarios.find(s => s.id === scenarioId);
  if (!scenario) {
    console.error(`场景不存在: ${scenarioId}`);
    return;
  }
  
  currentScenarioId = scenarioId;
  
  // 创建模态框
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'scenario-detail-modal';
  modalOverlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  // 设置场景详情内容
  const detailContent = document.createElement('div');
  detailContent.id = 'scenario-detail-content';
  
  // 设置背景颜色
  let headerColor;
  switch(scenario.difficulty) {
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
  
  // 根据难度设置按钮颜色
  let buttonColor, buttonColorLight;
  switch(scenario.difficulty) {
    case "简单":
      buttonColor = 'var(--secondary-color)'; // 天蓝色
      buttonColorLight = 'rgba(76, 212, 255, 0.1)';
      break;
    case "中等":
      buttonColor = 'var(--warning-color)'; // 橙色
      buttonColorLight = 'rgba(255, 159, 28, 0.1)';
      break;
    case "困难":
      buttonColor = 'var(--danger-color)'; // 红色
      buttonColorLight = 'rgba(255, 107, 107, 0.1)';
      break;
    default:
      buttonColor = 'var(--secondary-color)'; // 默认天蓝色
      buttonColorLight = 'rgba(76, 212, 255, 0.1)';
  }
  
  // 选项按钮 - 根据难度使用不同颜色
  const choicesHtml = scenario.choices ? scenario.choices.map((choice, index) => `
    <div class="scenario-choice">
      <button class="game-btn ${index === 0 ? 'primary' : 'outline primary'} full-width difficulty-${scenario.difficulty === '简单' ? 'easy' : scenario.difficulty === '中等' ? 'medium' : 'hard'}" style="margin-bottom: 10px; text-align: left;" onclick="selectChoice('${choice.id}')">
        ${choice.text}
      </button>
    </div>
  `).join('') : '';
  
  detailContent.innerHTML = `
    <div class="scenario-detail">
      <div class="scenario-detail-header" style="background-color: ${headerColor};">
        <div class="scenario-detail-title">${scenario.title}</div>
        <div class="scenario-detail-meta">
          <span class="game-badge ${scenario.difficulty === '简单' ? 'info' : scenario.difficulty === '中等' ? 'warning' : 'danger'}">${scenario.difficulty}</span>
          <span class="game-badge">${scenario.category}</span>
        </div>
        <button class="scenario-detail-back" onclick="hideScenarioDetail()">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="scenario-detail-image">
        <img src="${scenario.image}" alt="${scenario.title}" onerror="this.src='data/pic/default.png'">
      </div>
      <div class="scenario-detail-content">
        <div class="scenario-detail-description">${scenario.description}</div>
        <div class="scenario-detail-situation">
          <h3>${scenario.situation}</h3>
          <div class="scenario-choices">
            ${choicesHtml}
          </div>
        </div>
      </div>
      <div class="scenario-detail-actions">
        <button onclick="window.location.href='index.html'" style="
          background-color: white;
          color: #666666;
          border: 2px solid #cccccc;
          border-radius: 25px;
          padding: 12px 24px;
          font-family: 'SimHei', 'Microsoft YaHei UI', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        " onmouseover="this.style.backgroundColor='#f8f8f8'; this.style.borderColor='#999999'; this.style.color='#333333'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.12)';" onmouseout="this.style.backgroundColor='white'; this.style.borderColor='#cccccc'; this.style.color='#666666'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.08)';">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path d="M9 22V12h6v10"/>
            </svg>
          </span>
          返回主页
        </button>
      </div>
    </div>
  `;
  
  modal.appendChild(detailContent);
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);
  
  // 点击模态框背景关闭
  modalOverlay.addEventListener('click', function(event) {
    if (event.target === this) {
      hideScenarioDetail();
    }
  });
}

/**
 * 隐藏场景详情
 */
function hideScenarioDetail() {
  const modal = document.getElementById('scenario-detail-modal');
  if (modal) {
    modal.remove();
  }
  currentScenarioId = null;
}

/**
 * 选择场景选项
 * @param {string} choiceId - 选项ID
 */
function selectChoice(choiceId) {
  if (!currentScenarioId) return;
  
  // 获取场景数据
  const scenario = window.gameData?.scenarios.find(s => s.id === currentScenarioId);
  if (!scenario) return;
  
  // 获取选项数据
  const choice = scenario.choices.find(c => c.id === choiceId);
  if (!choice) return;
  
  // 更新用户进度（如果用户系统可用）
  if (window.userSystem && typeof window.userSystem.updateProgress === 'function') {
    window.userSystem.updateProgress(currentScenarioId, choice.points);
    
    // 检查成就
    if (typeof window.userSystem.checkAchievements === 'function') {
      window.userSystem.checkAchievements();
    }
  }
  
  // 显示选择结果
  const detailContent = document.getElementById('scenario-detail-content');
  if (detailContent) {
    // 设置背景颜色
    let headerColor;
    switch(scenario.difficulty) {
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
    
    detailContent.innerHTML = `
      <div class="scenario-detail">
        <div class="scenario-detail-header" style="background-color: ${headerColor};">
          <div class="scenario-detail-title">${scenario.title}</div>
          <div class="scenario-detail-meta">
            <span class="game-badge ${scenario.difficulty === '简单' ? 'info' : scenario.difficulty === '中等' ? 'warning' : 'danger'}">${scenario.difficulty}</span>
            <span class="game-badge">${scenario.category}</span>
          </div>
          <button class="scenario-detail-back" onclick="hideScenarioDetail()">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="scenario-detail-image">
          <img src="${scenario.image}" alt="${scenario.title}" onerror="this.src='data/pic/default.png'">
        </div>
        <div class="scenario-detail-content">
          <div class="scenario-detail-description">
            <h3>你选择了: ${choice.text}</h3>
            <p>${choice.feedback}</p>
            
            <div class="points-earned" style="margin-top: 20px;">
              <h4>获得的技能点：</h4>
              <div class="points-list" style="display: flex; gap: 15px; margin: 10px 0;">
                ${choice.points.empathy !== 0 ? `<span class="game-badge ${choice.points.empathy > 0 ? 'primary' : 'danger'}">同理心: ${choice.points.empathy > 0 ? '+' : ''}${choice.points.empathy}</span>` : ''}
                ${choice.points.courage !== 0 ? `<span class="game-badge ${choice.points.courage > 0 ? 'warning' : 'danger'}">勇气: ${choice.points.courage > 0 ? '+' : ''}${choice.points.courage}</span>` : ''}
                ${choice.points.wisdom !== 0 ? `<span class="game-badge ${choice.points.wisdom > 0 ? 'info' : 'danger'}">智慧: ${choice.points.wisdom > 0 ? '+' : ''}${choice.points.wisdom}</span>` : ''}
              </div>
            </div>
            
            <div style="margin-top: 20px;">
              <h4>学习要点:</h4>
              <p>${scenario.learning_moment}</p>
            </div>
          </div>
        </div>
        <div class="scenario-detail-actions">
          <button onclick="window.location.href='index.html'" style="
            background-color: white;
            color: #666666;
            border: 2px solid #cccccc;
            border-radius: 25px;
            padding: 12px 24px;
            font-family: 'SimHei', 'Microsoft YaHei UI', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          " onmouseover="this.style.backgroundColor='#f8f8f8'; this.style.borderColor='#999999'; this.style.color='#333333'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.12)';" onmouseout="this.style.backgroundColor='white'; this.style.borderColor='#cccccc'; this.style.color='#666666'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.08)';">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path d="M9 22V12h6v10"/>
              </svg>
            </span>
            返回主页
          </button>
        </div>
      </div>
    `;
  }
}

// 导出函数
window.showScenarioDetail = showScenarioDetail;
window.hideScenarioDetail = hideScenarioDetail;
window.selectChoice = selectChoice;